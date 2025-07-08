import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * Represents a step in the application pipeline.
 */
export interface IApplicationStep extends Types.Subdocument {
  name: string;
  result: "GO" | "NO_GO" | "STILL" | "";
  comment?: string;
}

/**
 * Represents an application submitted by a user for a job.
 */
export interface IApplication extends Document {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  message: string;
  status: "pending" | "in_progress" | "qualified" | "not_qualified";
  cvUrl?: string;
  steps: Types.DocumentArray<IApplicationStep>;
  customFields: Map<string, any>;
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
    cvUrl: { type: String, default: "" },
    steps: [
      {
        name: { type: String, required: true },
        result: {
          type: String,
          enum: ["GO", "NO_GO", "STILL", ""],
          default: "",
        },
        comment: { type: String, default: "" },
      },
    ],
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
