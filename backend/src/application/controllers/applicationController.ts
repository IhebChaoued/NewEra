import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";
import cloudinary from "../../config/cloudinary";
import fs from "fs";
import User from "../../user/models/User";
import Job from "../../company/models/Job";
import CustomField from "../../company/models/CustomField"; // ✅ ADDED
import { AppError } from "../../utils/errors";
import { extractPublicId } from "../../utils/cloudinary";
import { AuthRequest } from "../../middlewares/authMiddleware";

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
 * Company fetches all applications for its jobs, including custom fields.
 */
export const getApplicationsForCompany = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // ✅ Find all job IDs owned by this company
    const jobs = await Job.find({ companyId: req.userId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const total = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // ✅ Fetch applications
    const applications = await Application.find({
      jobId: { $in: jobIds },
    })
      .populate("jobId")
      .populate("userId")
      .skip(skip)
      .limit(limit);

    // ✅ Fetch custom field definitions for this company
    const customFields = await CustomField.find({
      companyId: req.userId,
    });

    // ✅ Merge custom field definitions with application values
    const applicationsWithCustomFields = applications.map((app) => {
      const customFieldsArray = customFields.map((field) => ({
        _id: field._id,
        name: field.name,
        fieldType: field.fieldType,
        options: field.options,
        value: app.customFields?.get(String(field._id)) || null,
      }));

      return {
        ...app.toObject(),
        customFields: customFieldsArray,
      };
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages,
      applications: applicationsWithCustomFields,
      customFields, // also send definitions separately if needed
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
 * Adds a new step to the application.
 */
export const createStepResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      throw new AppError("Application not found.", 404);
    }

    application.steps.push({
      name,
      result: "",
      comment: "",
    });

    await application.save();

    res.status(201).json({
      message: "Step created successfully.",
      application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the result of a specific step.
 */
export const updateStepResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { result, comment } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      throw new AppError("Application not found.", 404);
    }

    const step = application.steps.id(req.params.stepId);

    if (!step) {
      throw new AppError("Step not found.", 404);
    }

    step.result = result;
    step.comment = comment || "";

    await application.save();

    res.status(200).json({
      message: "Step result updated successfully.",
      application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an application and its custom CV if exists.
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

    if (app.cvUrl) {
      const publicId = extractPublicId(app.cvUrl, "application_cvs");
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      }
    }

    res.status(200).json({ message: "Application deleted." });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates custom field values on an application.
 */
export const updateCustomFields = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applicationId = req.params.id;
    const { customFields } = req.body;

    const app = await Application.findById(applicationId);
    if (!app) {
      throw new AppError("Application not found.", 404);
    }

    // ✅ Save custom field values to the Map
    for (const [fieldId, value] of Object.entries(customFields)) {
      app.customFields.set(fieldId, value);
    }

    await app.save();

    res.status(200).json({
      message: "Custom fields updated successfully.",
      application: app,
    });
  } catch (error) {
    next(error);
  }
};
