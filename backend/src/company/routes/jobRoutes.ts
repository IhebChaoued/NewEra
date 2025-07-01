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
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Fetch all jobs (public)
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get("/", getAllJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get details for a single job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get("/:id", getJobById);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - requirements
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frontend Developer
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               location:
 *                 type: string
 *               salaryRange:
 *                 type: string
 *                 example: €60k-80k
 *               howToApply:
 *                 type: string
 *                 example: Send your CV to hr@example.com
 *               blurry:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post("/", verifyToken, isCompany, createJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   patch:
 *     summary: Update an existing job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               location:
 *                 type: string
 *               salaryRange:
 *                 type: string
 *               howToApply:
 *                 type: string
 *               blurry:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found or not authorized
 */
router.patch("/:id", verifyToken, isCompany, updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job and archive its stats
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job to delete
 *     responses:
 *       200:
 *         description: Job deleted successfully. Stats archived.
 *       404:
 *         description: Job not found or not authorized.
 */
router.delete("/:id", verifyToken, isCompany, deleteJob);

export default router;
