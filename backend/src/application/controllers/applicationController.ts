import { Request, Response } from "express";
import Application from "../models/Application";
import cloudinary from "../../config/cloudinary";
import fs from "fs";
import User from "../../user/models/User";
import Job from "../../company/models/Job";

/**
 * User applies to a job.
 * - Uploads new CV if provided
 * - Otherwise uses CV from user's profile
 */
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { jobId, message } = req.body;

    let cvUrl = "";

    if (req.file) {
      // Upload the new CV to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "application_cvs",
        resource_type: "raw",
      });
      cvUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    } else {
      // No new CV uploaded → fall back to user's existing CV
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
    console.error("Application creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to submit application.", error: error });
  }
};

/**
 * Company fetches all applications for its jobs.
 * Filters ONLY applications belonging to jobs posted by this company.
 */
export const getApplicationsForCompany = async (
  req: Request,
  res: Response
) => {
  try {
    // Find all jobs owned by this company
    const jobs = await Job.find({ companyId: req.userId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    // Fetch applications linked to those jobs
    const applications = await Application.find({
      jobId: { $in: jobIds },
    })
      .populate("jobId")
      .populate("userId");

    res.status(200).json({
      message: "Applications fetched successfully.",
      applications,
    });
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({
      message: "Failed to fetch applications.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * User fetches all applications they submitted.
 */
export const getApplicationsForUser = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({
      userId: req.userId,
    }).populate("jobId");

    res.status(200).json({
      message: "User applications fetched successfully.",
      applications,
    });
  } catch (error) {
    console.error("Fetch user applications error:", error);
    res.status(500).json({
      message: "Failed to fetch user applications.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Company updates application status.
 */
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    res.status(200).json({
      message: "Application status updated.",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({
      message: "Failed to update application.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Optional: delete an application.
 */
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);

    if (!app) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    res.status(200).json({ message: "Application deleted." });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      message: "Failed to delete application.",
      error: error instanceof Error ? error.message : error,
    });
  }
};
