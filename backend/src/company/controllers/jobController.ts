import { Request, Response } from "express";
import Job from "../models/Job";

/**
 * Creates a new job linked to the logged-in company.
 */
export const createJob = async (req: Request, res: Response) => {
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

    // Create new job
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
    console.error("Job creation error:", error);
    res.status(500).json({ message: "Failed to create job." });
  }
};

/**
 * Returns all jobs for public browsing.
 * Blurry flag determines whether details should be visible.
 */
export const getAllJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Fetch jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
};

/**
 * Returns details of a single job.
 */
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: "Job not found." });
      return;
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Fetch single job error:", error);
    res.status(500).json({ message: "Failed to fetch job." });
  }
};

/**
 * Updates a job if owned by the logged-in company.
 */
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, companyId: req.userId },
      req.body,
      { new: true }
    );

    if (!job) {
      res.status(404).json({ message: "Job not found or not authorized." });
      return;
    }

    res.status(200).json({
      message: "Job updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Failed to update job." });
  }
};

/**
 * Deletes a job if owned by the logged-in company.
 */
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      companyId: req.userId,
    });

    if (!job) {
      res.status(404).json({ message: "Job not found or not authorized." });
      return;
    }

    res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Failed to delete job." });
  }
};
