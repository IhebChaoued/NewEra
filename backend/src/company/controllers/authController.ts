import { Request, Response } from "express";
import Company from "../models/Company";
import bcrypt from "bcryptjs"; // For secure password hashing
import jwt from "jsonwebtoken"; // For issuing JWT tokens
import cloudinary from "../../config/cloudinary";
import fs from "fs";

/**
 * Handles company registration, including optional logo upload.
 * - Checks for existing email
 * - Hashes password
 * - Uploads logo to Cloudinary if provided
 * - Saves company in database
 */
export const registerCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      res.status(400).json({ message: "Company already exists" });
      return;
    }

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    let logoUrl = "";

    // If a file was uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos", // optional: groups images in Cloudinary
      });
      logoUrl = result.secure_url;

      // Delete the temp file from local uploads folder
      fs.unlinkSync(req.file.path);
    }

    // Create and save the new company
    const newCompany = new Company({
      name,
      email,
      password: hashedPassword,
      logo: logoUrl, // store the Cloudinary URL if uploaded
    });

    await newCompany.save();

    res.status(201).json({
      message: "Company registered successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};

/**
 * Handles company login logic.
 * - Validates credentials
 * - Issues JWT token
 */
export const loginCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Issue JWT token
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, company });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};
