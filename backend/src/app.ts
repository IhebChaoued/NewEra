import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import companyAuthRoutes from "./company/routes/authRoutes";
import companyRoutes from "./company/routes/companyRoutes";
import jobRoutes from "./company/routes/jobRoutes";

// Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/company", companyAuthRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root health check endpoint.
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "✅ CaptureGet backend is running.",
  });
});

export default app;
