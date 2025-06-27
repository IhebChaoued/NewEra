import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware"; // Middleware to verify JWT

const router = express.Router();

/**
 * @route   GET /api/company/profile
 * @desc    Access secured company profile route
 * @access  Private (JWT token required)
 */
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Bienvenue 👋 à votre espace entreprise sécurisé.",
    userId: req.userId, // Provided by auth middleware
  });
});

export default router;
