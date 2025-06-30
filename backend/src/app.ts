import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import companyAuthRoutes from "./company/routes/authRoutes";
import companyRoutes from "./company/routes/companyRoutes";
import jobRoutes from "./company/routes/jobRoutes";
import userRoutes from "./user/routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import applicationRoutes from "./application/routes/applicationRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/company", companyAuthRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);
app.use("/api/applications", applicationRoutes);

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root health check endpoint.
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "✅ CaptureGet backend is running.",
  });
});

// Global error handler - keep this last to catch errors from all routes
app.use(errorHandler);

export default app;
