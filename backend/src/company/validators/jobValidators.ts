import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().required(),
  requirements: Joi.string().required(),
  location: Joi.string().required(),
  salaryRange: Joi.string().optional(),
  howToApply: Joi.string().optional(),
  blurry: Joi.boolean().optional(),
});

export const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional(),
  requirements: Joi.string().optional(),
  location: Joi.string().optional(),
  salaryRange: Joi.string().optional(),
  howToApply: Joi.string().optional(),
  blurry: Joi.boolean().optional(),
});
