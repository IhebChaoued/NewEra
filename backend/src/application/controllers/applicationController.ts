import { Request, Response } from "express";
import Application from "../models/Application";
import cloudinary from "../../config/cloudinary";
import fs from "fs";
import User from "../../user/models/User";

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

    // Create new application
    const application = await Application.create({
      jobId,
      userId: req.userId, // comes from verifyToken middleware
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
 */
export const getApplicationsForCompany = async (
  req: Request,
  res: Response
) => {
  try {
    const applications = await Application.find()
      .populate("jobId")
      .populate("userId");

    // In real use, you'd filter only apps for the logged-in company’s jobs
    res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications." });
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
    res.status(200).json(applications);
  } catch (error) {
    console.error("Fetch user applications error:", error);
    res.status(500).json({ message: "Failed to fetch user applications." });
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
    res.status(500).json({ message: "Failed to update application." });
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
    res.status(500).json({ message: "Failed to delete application." });
  }
};
