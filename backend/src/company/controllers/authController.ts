import { Request, Response } from "express";
import Company from "../models/Company";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import fs from "fs";

/**
 * Handles company registration.
 * - Checks if email already exists
 * - Hashes password
 * - Uploads logo to Cloudinary (if provided)
 * - Stores company in database
 */
export const registerCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check for duplicate email
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      res.status(400).json({ message: "Company already exists" });
      return;
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    let logoUrl = "";

    // If logo file uploaded, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos",
      });
      logoUrl = result.secure_url;

      // Remove local temp file after upload
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
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Handles company login.
 * - Validates credentials
 * - Issues JWT token
 */
export const loginCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

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
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};

/**
 * Retrieves the profile of the currently logged-in company.
 * - Uses the userId from the verified JWT
 * - Excludes sensitive data like password
 */
export const getCompanyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company = await Company.findById(req.userId).select(
      "-password" // Exclude password field for security
    );

    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    res.status(200).json({
      message: "Company profile loaded successfully",
      company,
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({
      message: "Failed to load company profile",
      error: error instanceof Error ? error.message : error,
    });
  }
};
