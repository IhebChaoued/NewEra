import mongoose, { Document, Schema } from "mongoose";

/**
 * Represents an application submitted by a user for a job.
 */
export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  message: string;
  status: "pending" | "in_progress" | "qualified" | "not_qualified";
  cvUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in_progress", "qualified", "not_qualified"],
      default: "pending",
    },
    cvUrl: { type: String, default: "" }, // NEW: store the CV link
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
