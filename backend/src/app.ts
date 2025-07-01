import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import companyAuthRoutes from "./company/routes/authRoutes";
import companyRoutes from "./company/routes/companyRoutes";
import jobRoutes from "./company/routes/jobRoutes";
import userRoutes from "./user/routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import applicationRoutes from "./application/routes/applicationRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import jobStatsRoutes from "./company/routes/jobStatsRoutes";

dotenv.config();

const app = express();

// Security middlewares
app.use(cors());
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "15") * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parser
app.use(express.json());

// API routes
app.use("/api/company", companyAuthRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/job-stats", jobStatsRoutes);

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root health check endpoint.
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "✅ CaptureGet backend is running.",
  });
});

// Global error handler
app.use(errorHandler);

export default app;
