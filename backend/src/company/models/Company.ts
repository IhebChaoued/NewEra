import mongoose from "mongoose";

// Mongoose schema that defines the structure of a company document in MongoDB
const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra white spaces
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Exports the model to interact with company documents in the DB
export default mongoose.model("Company", CompanySchema);
