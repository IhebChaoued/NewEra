import express from "express";
import {
  verifyToken,
  isUser,
  isCompany,
} from "../../middlewares/authMiddleware";
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
 * @access  Private (User only)
 */
router.post("/", verifyToken, isUser, upload.single("cv"), createApplication);

/**
 * @route   GET /api/applications/user
 * @desc    User fetches their applications
 * @access  Private (User only)
 */
router.get("/user", verifyToken, isUser, getApplicationsForUser);

/**
 * @route   GET /api/applications/company
 * @desc    Company fetches all applications for its jobs
 * @access  Private (Company only)
 */
router.get("/company", verifyToken, isCompany, getApplicationsForCompany);

/**
 * @route   PATCH /api/applications/:id
 * @desc    Company updates application status
 * @access  Private (Company only)
 */
router.patch("/:id", verifyToken, isCompany, updateApplicationStatus);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete an application
 * @access  Private (User only)
 */
router.delete("/:id", verifyToken, isUser, deleteApplication);

/**
 * @route   POST /api/applications/:id/steps
 * @desc    Company adds an interview step result
 * @access  Private (Company only)
 */
router.post("/:id/steps", verifyToken, isCompany, createStepResult);

/**
 * @route   PATCH /api/applications/:id/steps/:stepId
 * @desc    Company updates an interview step result
 * @access  Private (Company only)
 */
router.patch("/:id/steps/:stepId", verifyToken, isCompany, updateStepResult);

export default router;
