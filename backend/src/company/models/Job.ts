import mongoose, { Schema, Document } from "mongoose";

/**
 * Mongoose schema that defines the structure of a job document in MongoDB.
 */
export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryRange: string;
  howToApply: string;
  companyId: mongoose.Types.ObjectId;
  blurry: boolean;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, default: "Negotiable" },
    howToApply: { type: String, default: "" },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    blurry: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJob>("Job", JobSchema);
