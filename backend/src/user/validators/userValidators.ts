import Joi from "joi";

// User register validation
export const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(255).required(),
  middleName: Joi.string().max(255).allow("").optional(),
  lastName: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// User login validation
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// User update profile validation
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(255).optional(),
  middleName: Joi.string().max(255).allow("").optional(),
  lastName: Joi.string().min(2).max(255).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});
