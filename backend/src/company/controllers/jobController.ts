import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";
import Application from "../../application/models/Application";
import JobStats from "../models/JobStats";
import { AppError } from "../../utils/errors";
import { createJobSchema, updateJobSchema } from "../validators/jobValidators";

/**
 * Creates a new job linked to the logged-in company.
 */
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate request body
    const { error } = createJobSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const {
      title,
      description,
      requirements,
      location,
      salaryRange,
      howToApply,
      blurry,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      salaryRange,
      howToApply,
      blurry,
      companyId: req.userId,
    });

    res.status(201).json({
      message: "Job created successfully.",
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns all jobs for public browsing with pagination.
 */
export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Job.countDocuments();

    const jobs = await Job.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages,
      results: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns details of a single job.
 */
export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      throw new AppError("Job not found.", 404);
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a job if owned by the logged-in company.
 */
export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Validate update fields
    const { error } = updateJobSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, companyId: req.userId },
      req.body,
      { new: true }
    );

    if (!job) {
      throw new AppError("Job not found or not authorized.", 404);
    }

    res.status(200).json({
      message: "Job updated successfully.",
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a job if owned by the logged-in company.
 * Saves aggregated stats before removing the job and related applications.
 */
export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      companyId: req.userId,
    });

    if (!job) {
      throw new AppError("Job not found or not authorized.", 404);
    }

    // Aggregate application stats
    const pipeline = [
      { $match: { jobId: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const aggregationResults = await Application.aggregate(pipeline);

    let stats = {
      pending: 0,
      in_progress: 0,
      qualified: 0,
      not_qualified: 0,
    };

    for (const result of aggregationResults) {
      const status = result._id as
        | "pending"
        | "in_progress"
        | "qualified"
        | "not_qualified";
      stats[status] = result.count;
    }

    const totalApplications =
      stats.pending + stats.in_progress + stats.qualified + stats.not_qualified;

    await JobStats.create({
      jobTitle: job.title,
      companyId: job.companyId,
      location: job.location,
      salaryRange: job.salaryRange,
      totalApplications,
      pending: stats.pending,
      in_progress: stats.in_progress,
      qualified: stats.qualified,
      not_qualified: stats.not_qualified,
      deletedAt: new Date(),
    });

    await Application.deleteMany({ jobId: job._id });

    await Job.findByIdAndDelete(job._id);

    res.status(200).json({
      message: "Job deleted successfully. Stats archived.",
    });
  } catch (error) {
    next(error);
  }
};
