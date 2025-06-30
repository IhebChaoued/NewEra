import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import cloudinary from "../../config/cloudinary";
import User from "../models/User";

/**
 * Registers a new user.
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let cvUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_cvs",
        resource_type: "raw",
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
        createdAt: newUser.createdAt,
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
 * Logs in a user and issues a JWT token.
 */
export const loginUser = async (req: Request, res: Response) => {
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

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

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
 * Fetches the logged-in user's profile.
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

/**
 * Updates the logged-in user's profile.
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const { firstName, middleName, lastName, email, password } = req.body;

    if (firstName) user.firstName = firstName;
    if (middleName !== undefined) user.middleName = middleName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_cvs",
        resource_type: "raw",
      });
      user.cvUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

/**
 * Deletes the logged-in user's account.
 */
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({ message: "User account deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};
