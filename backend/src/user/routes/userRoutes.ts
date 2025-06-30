import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController";

import upload from "../../middlewares/uploadMiddleware";

const router = express.Router();

/**
 * @route   POST /api/user/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", upload.single("cv"), registerUser);

/**
 * @route   POST /api/user/login
 * @desc    User login
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/user/profile
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get("/profile", verifyToken, getUserProfile);

export default router;
