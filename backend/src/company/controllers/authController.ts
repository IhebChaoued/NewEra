import { Request, Response } from "express";
import Company from "../models/Company";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../config/cloudinary";
import fs from "fs";

/**
 * Registers a new company.
 */
export const registerCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      res.status(400).json({ message: "Company already exists" });
      return;
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
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Authenticates a company and returns a JWT token.
 */
export const loginCompany = async (req: Request, res: Response) => {
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
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};

/**
 * Loads the logged-in company's profile.
 */
export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.userId).select("-password");
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    res.status(200).json({
      message: "Company profile loaded successfully",
      company,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      message: "Failed to load profile",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Updates the logged-in company's profile.
 */
export const updateCompanyProfile = async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    const { name, email, password } = req.body;

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
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
      res.status(404).json({ message: "Company not found" });
      return;
    }

    res.status(200).json({
      message: "Company profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Deletes the logged-in company's account.
 */
export const deleteCompanyProfile = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndDelete(req.userId);
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    res.status(200).json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Failed to delete company",
      error: error instanceof Error ? error.message : error,
    });
  }
};
