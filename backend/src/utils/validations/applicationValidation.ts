import Joi from "joi";
import mongoose from "mongoose";

// Application creation fields
export const createApplicationSchema = Joi.object({
  jobId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid", {
          message: "Invalid jobId format",
        });
      }
      return value;
    })
    .required(),
  message: Joi.string().max(500).allow("").optional(),
});

// Application status update
export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "in_progress", "qualified", "not_qualified")
    .required(),
});
