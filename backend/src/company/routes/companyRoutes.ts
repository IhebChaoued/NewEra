import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
} from "../controllers/authController";
import upload from "../../middlewares/uploadMiddleware";

const router = express.Router();

/**
 * @route GET /api/company/profile
 * @desc Get company profile
 * @access Private
 */
router.get("/profile", verifyToken, getCompanyProfile);

/**
 * @route PATCH /api/company/profile
 * @desc Update company profile
 * @access Private
 */
router.patch(
  "/profile",
  verifyToken,
  upload.single("logo"),
  updateCompanyProfile
);

/**
 * @route DELETE /api/company/profile
 * @desc Delete company profile
 * @access Private
 */
router.delete("/profile", verifyToken, deleteCompanyProfile);

export default router;
