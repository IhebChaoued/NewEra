import Joi from "joi";

// Job creation fields
export const createJobSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).required(),
  requirements: Joi.string().allow("").optional(),
  location: Joi.string().allow("").optional(),
  salaryRange: Joi.string().allow("").optional(),
  howToApply: Joi.string().allow("").optional(),
  blurry: Joi.boolean().optional(),
});
