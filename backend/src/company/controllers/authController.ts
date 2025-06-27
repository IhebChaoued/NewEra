import { Request, Response } from "express";
import Company from "../models/Company";
import bcrypt from "bcryptjs"; // For secure password hashing
import jwt from "jsonwebtoken"; // For issuing JWT tokens

// Handles company registration logic
export const registerCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already used
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      res.status(400).json({ message: "Company already exists" });
      return;
    }

    // Encrypt the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new company
    const newCompany = new Company({ name, email, password: hashedPassword });
    await newCompany.save();

    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// Handles company login logic
export const loginCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the company by email
    const company = await Company.findOne({ email });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Sign JWT token and send to client
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, company });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
