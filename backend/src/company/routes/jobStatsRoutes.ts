import express from "express";
import { getJobStats } from "../controllers/jobStatsController";
import { verifyToken, isCompany } from "../../middlewares/authMiddleware";

const router = express.Router();

/**
 * @route GET /api/job-stats
 * @desc  Fetch all archived job stats for dashboard
 * @access Private (company only)
 */
router.get("/", verifyToken, isCompany, getJobStats);

export default router;
