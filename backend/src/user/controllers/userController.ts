import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import cloudinary from "../../config/cloudinary";
import User from "../models/User";

/**
 * Handles user registration:
 * - Hashes password
 * - Uploads CV to Cloudinary if provided
 * - Saves user in MongoDB
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, middleName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let cvUrl = "";

    // Upload CV if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_cvs",
        resource_type: "raw", // allow PDFs, docs, etc.
      });
      cvUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      cvUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        middleName: newUser.middleName,
        lastName: newUser.lastName,
        email: newUser.email,
        cvUrl: newUser.cvUrl,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Handles user login:
 * - Validates credentials
 * - Issues JWT token
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        cvUrl: user.cvUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Loads the profile of the logged-in user:
 * - Returns user data except sensitive fields
 */
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password -__v");

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({
      message: "User profile loaded successfully.",
      user,
    });
  } catch (error) {
    console.error("Fetch user profile error:", error);
    res.status(500).json({
      message: "Failed to load user profile.",
      error: error instanceof Error ? error.message : error,
    });
  }
};
