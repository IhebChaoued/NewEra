import mongoose, { Schema, Document } from "mongoose";

/**
 * Represents aggregated stats for a job after it’s deleted.
 */
export interface IJobStats extends Document {
  jobTitle: string;
  companyId: mongoose.Types.ObjectId;
  location: string;
  salaryRange: string;
  totalApplications: number;
  pending: number;
  in_progress: number;
  qualified: number;
  not_qualified: number;
  deletedAt: Date;
}

const JobStatsSchema = new Schema<IJobStats>(
  {
    jobTitle: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, required: true },
    totalApplications: { type: Number, required: true },
    pending: { type: Number, required: true },
    in_progress: { type: Number, required: true },
    qualified: { type: Number, required: true },
    not_qualified: { type: Number, required: true },
    deletedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJobStats>("JobStats", JobStatsSchema);
