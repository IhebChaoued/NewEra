/**
 * Entry point of the backend server.
 * - Loads environment variables from .env
 * - Connects to MongoDB
 * - Starts the Express server
 */

import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

// Determine the port and MongoDB URI from environment variables
const PORT = parseInt(process.env.PORT || "5000", 10);
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/captureget";

// Connect to MongoDB and launch Express server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
