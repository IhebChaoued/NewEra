import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import cloudinary from "../../config/cloudinary";
import User from "../models/User";
import { AppError } from "../../utils/errors";
import { extractPublicId } from "../../utils/cloudinary";
import {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validators/userValidators";

/**
 * Registers a new user.
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await registerUserSchema.validateAsync(req.body);

    const { firstName, middleName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists", 400);
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
    next(error);
  }
};

/**
 * Logs in a user and issues a JWT token.
 */
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await loginUserSchema.validateAsync(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
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
    next(error);
  }
};

/**
 * Fetches the logged-in user's profile.
 */
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the logged-in user's profile.
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateUserSchema.validateAsync(req.body);

    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError("User not found.", 404);
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
      if (user.cvUrl) {
        const publicId = extractPublicId(user.cvUrl, "user_cvs");
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        }
      }

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
    next(error);
  }
};

/**
 * Deletes the logged-in user's account.
 */
export const deleteUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.cvUrl) {
      const publicId = extractPublicId(user.cvUrl, "user_cvs");
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      }
    }

    res.status(200).json({ message: "User account deleted successfully." });
  } catch (error) {
    next(error);
  }
};
