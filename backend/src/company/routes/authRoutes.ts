import express from "express";
import { registerCompany, loginCompany } from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /api/company/register:
 *   post:
 *     summary: Register a new company
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Example Corp
 *               email:
 *                 type: string
 *                 example: example@corp.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: Company registered successfully
 *       400:
 *         description: Company already exists
 */
router.post("/register", registerCompany);

/**
 * @swagger
 * /api/company/login:
 *   post:
 *     summary: Log in a company
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@corp.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login successful, returns token and company info
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Company not found
 */
router.post("/login", loginCompany);

export default router;
