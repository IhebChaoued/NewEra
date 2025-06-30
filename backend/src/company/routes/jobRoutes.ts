import express from "express";
import { verifyToken, isCompany } from "../../middlewares/authMiddleware";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController";

const router = express.Router();

/**
 * @route   GET /api/jobs
 * @desc    Fetch all jobs (public)
 * @access  Public
 */
router.get("/", getAllJobs);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get details for a single job
 * @access  Public
 */
router.get("/:id", getJobById);

/**
 * @route   POST /api/jobs
 * @desc    Create a new job posting
 * @access  Private (Company only)
 */
router.post("/", verifyToken, isCompany, createJob);

/**
 * @route   PATCH /api/jobs/:id
 * @desc    Update an existing job (must belong to logged-in company)
 * @access  Private (Company only)
 */
router.patch("/:id", verifyToken, isCompany, updateJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete an existing job (must belong to logged-in company)
 * @access  Private (Company only)
 */
router.delete("/:id", verifyToken, isCompany, deleteJob);

export default router;
