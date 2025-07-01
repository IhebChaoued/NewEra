import express from "express";
import { getJobStats } from "../controllers/jobStatsController";
import { verifyToken, isCompany } from "../../middlewares/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/job-stats:
 *   get:
 *     summary: Get archived job stats
 *     tags: [JobStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: Filter stats by company ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter stats from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter stats up to this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of archived job stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobTitle:
 *                         type: string
 *                         example: Frontend Developer
 *                       companyId:
 *                         type: string
 *                         example: 649c91d3f8a7c2b1a2f2efbc
 *                       location:
 *                         type: string
 *                         example: Berlin
 *                       salaryRange:
 *                         type: string
 *                         example: €60k-80k
 *                       totalApplications:
 *                         type: integer
 *                         example: 10
 *                       pending:
 *                         type: integer
 *                         example: 2
 *                       in_progress:
 *                         type: integer
 *                         example: 3
 *                       qualified:
 *                         type: integer
 *                         example: 4
 *                       not_qualified:
 *                         type: integer
 *                         example: 1
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-30T12:00:00.000Z
 */
router.get("/", verifyToken, isCompany, getJobStats);

export default router;
