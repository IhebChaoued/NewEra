import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { getCompanyProfile } from "../controllers/authController";

const router = express.Router();

/**
 * @route   GET /api/company/profile
 * @desc    Returns the logged-in company's profile.
 * @access  Private (JWT required)
 */
router.get("/profile", verifyToken, getCompanyProfile);

export default router;
