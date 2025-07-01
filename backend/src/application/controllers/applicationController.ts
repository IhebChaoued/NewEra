import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";
import cloudinary from "../../config/cloudinary";
import fs from "fs";
import User from "../../user/models/User";
import Job from "../../company/models/Job";
import { AppError } from "../../utils/errors";

/**
 * User applies to a job.
 */
export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobId, message } = req.body;

    let cvUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "application_cvs",
        resource_type: "raw",
      });
      cvUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    } else {
      const user = await User.findById(req.userId);
      if (user?.cvUrl) {
        cvUrl = user.cvUrl;
      }
    }

    const application = await Application.create({
      jobId,
      userId: req.userId,
      message,
      cvUrl,
    });

    res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Company fetches all applications for its jobs, paginated.
 */
export const getApplicationsForCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Find all jobs owned by this company
    const jobs = await Job.find({ companyId: req.userId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const total = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    const applications = await Application.find({
      jobId: { $in: jobIds },
    })
      .populate("jobId")
      .populate("userId")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User fetches all applications they submitted, paginated.
 */
export const getApplicationsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Application.countDocuments({
      userId: req.userId,
    });

    const applications = await Application.find({
      userId: req.userId,
    })
      .populate("jobId")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Company updates application status.
 */
export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      throw new AppError("Application not found.", 404);
    }

    res.status(200).json({
      message: "Application status updated.",
      application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Optional: delete an application.
 */
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);

    if (!app) {
      throw new AppError("Application not found.", 404);
    }

    res.status(200).json({ message: "Application deleted." });
  } catch (error) {
    next(error);
  }
};
