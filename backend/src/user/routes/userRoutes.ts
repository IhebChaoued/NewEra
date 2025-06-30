import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import upload from "../../middlewares/uploadMiddleware";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/userController";

const router = express.Router();

/**
 * @route   POST /api/users/register
 */
router.post("/register", upload.single("cv"), registerUser);

/**
 * @route   POST /api/users/login
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/users/profile
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @route   PUT /api/users/profile
 */
router.put("/profile", verifyToken, upload.single("cv"), updateUserProfile);

/**
 * @route   DELETE /api/users/profile
 */
router.delete("/profile", verifyToken, deleteUserAccount);

export default router;
