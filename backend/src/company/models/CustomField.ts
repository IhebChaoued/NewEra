import mongoose, { Schema, Document } from "mongoose";

/**
 * Represents one custom field definition created by a company,
 */
export interface ICustomField extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  fieldType: "text" | "number" | "date" | "select";
  options?: string[];
}

const customFieldSchema = new Schema<ICustomField>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    fieldType: {
      type: String,
      enum: ["text", "number", "date", "select"],
      required: true,
    },
    options: [{ type: String }], // For select/dropdown type fields
  },
  { timestamps: true }
);

export default mongoose.model<ICustomField>("CustomField", customFieldSchema);
