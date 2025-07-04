import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  createApplication,
  getApplicationsForCompany,
  getApplicationsForUser,
  updateApplicationStatus,
  deleteApplication,
  createStepResult,
  updateStepResult,
} from "../controllers/applicationController";
import upload from "../../middlewares/uploadMiddleware";

const router = express.Router();

/**
 * @route   POST /api/applications
 * @desc    User applies to a job
 * @access  Private
 */
router.post("/", verifyToken, upload.single("cv"), createApplication);

/**
 * @route   GET /api/applications/user
 * @desc    User fetches their applications
 * @access  Private
 */
router.get("/user", verifyToken, getApplicationsForUser);

/**
 * @route   GET /api/applications/company
 * @desc    Company fetches all applications for its jobs
 * @access  Private
 */
router.get("/company", verifyToken, getApplicationsForCompany);

/**
 * @route   PATCH /api/applications/:id
 * @desc    Company updates application status
 * @access  Private
 */
router.patch("/:id", verifyToken, updateApplicationStatus);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete an application
 * @access  Private
 */
router.delete("/:id", verifyToken, deleteApplication);

/**
 * @route   POST /api/applications/:id/steps
 * @desc    Company adds an interview step result
 * @access  Private
 */
router.post("/:id/steps", verifyToken, createStepResult);

/**
 * @route   PATCH /api/applications/:id/steps/:stepId
 * @desc    Company updates an interview step result
 * @access  Private
 */
router.patch("/:id/steps/:stepId", verifyToken, updateStepResult);

export default router;
