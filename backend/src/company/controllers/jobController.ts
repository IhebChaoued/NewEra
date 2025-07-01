import { Request, Response, NextFunction } from "express";
import Job from "../models/Job";
import { AppError } from "../../utils/errors";

/**
 * Creates a new job linked to the logged-in company.
 */
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
 */
export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      companyId: req.userId,
    });

    if (!job) {
      throw new AppError("Job not found or not authorized.", 404);
    }

    res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    next(error);
  }
};
