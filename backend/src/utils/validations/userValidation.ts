import Joi from "joi";

// User registration fields
export const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  middleName: Joi.string().allow("").optional(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// User login fields
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
