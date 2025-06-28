import { Request, Response } from "express";
import Company from "../models/Company";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import fs from "fs";

/**
 * Handles company registration.
 * - Checks for existing email
 * - Hashes password
 * - Uploads logo to Cloudinary (if provided)
 * - Saves company in database
 */
export const registerCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      res.status(400).json({ message: "Company already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let logoUrl = "";

    // If a file was uploaded, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos",
      });
      logoUrl = result.secure_url;

      // Clean up temp file
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
 * - Checks credentials
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

    res.status(200).json({ token, company });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};
