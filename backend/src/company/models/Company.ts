import mongoose from "mongoose";

/**
 * Mongoose schema defining the structure of a Company document in MongoDB.
 */
const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    logo: {
      type: String,
      default: "", // Cloudinary URL will be saved here
    },
    role: {
      type: String,
      enum: ["company"],
      default: "company",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", CompanySchema);
