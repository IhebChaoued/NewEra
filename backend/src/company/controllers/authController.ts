import { Request, Response, NextFunction } from "express";
import Company from "../models/Company";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import fs from "fs";
import { AppError } from "../../utils/errors";
import { extractPublicId } from "../../utils/cloudinary";

/**
 * Registers a new company.
 */
export const registerCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      throw new AppError("Company already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let logoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos",
      });
      logoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newCompany = new Company({
      name,
      email,
      password: hashedPassword,
      logo: logoUrl,
    });

    await newCompany.save();

    res.status(201).json({
      message: "Company registered successfully",
      company: {
        id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
        logo: newCompany.logo,
        createdAt: newCompany.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates a company and returns a JWT token.
 */
export const loginCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { id: company._id, role: "company" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        logo: company.logo,
        createdAt: company.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Loads the logged-in company's profile.
 */
export const getCompanyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findById(req.userId).select("-password");
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    res.status(200).json({
      message: "Company profile loaded successfully",
      company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the logged-in company's profile.
 */
export const updateCompanyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates: any = {};
    const { name, email, password } = req.body;

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      // Find existing company to delete old logo
      const existingCompany = await Company.findById(req.userId);
      if (existingCompany?.logo) {
        const publicId = extractPublicId(existingCompany.logo, "company_logos");
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos",
      });
      updates.logo = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select("-password");

    if (!updatedCompany) {
      throw new AppError("Company not found", 404);
    }

    res.status(200).json({
      message: "Company profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes the logged-in company's account.
 */
export const deleteCompanyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findByIdAndDelete(req.userId);
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    if (company.logo) {
      const publicId = extractPublicId(company.logo, "company_logos");
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.status(200).json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
