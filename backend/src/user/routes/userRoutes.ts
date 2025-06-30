import express from "express";
import { verifyToken, isUser } from "../../middlewares/authMiddleware";
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
router.get("/profile", verifyToken, isUser, getUserProfile);
router.put(
  "/profile",
  verifyToken,
  isUser,
  upload.single("cv"),
  updateUserProfile
);
router.delete("/profile", verifyToken, isUser, deleteUserAccount);

/**
 * @route   PUT /api/users/profile
 */
router.put("/profile", verifyToken, upload.single("cv"), updateUserProfile);

/**
 * @route   DELETE /api/users/profile
 */
router.delete("/profile", verifyToken, deleteUserAccount);

export default router;
