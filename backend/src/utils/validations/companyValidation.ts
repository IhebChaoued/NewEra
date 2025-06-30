import Joi from "joi";

// Company registration fields
export const registerCompanySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Company login fields
export const loginCompanySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
