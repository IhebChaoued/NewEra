import Joi from "joi";

// Company register validation
export const registerCompanySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Company login validation
export const loginCompanySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Company profile update validation
export const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});
