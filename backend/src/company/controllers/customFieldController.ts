import { Request, Response, NextFunction } from "express";
import CustomField from "../models/CustomField";
import { AuthRequest } from "../../middlewares/authMiddleware";

/**
 * Create a new custom field definition for the company.
 */
export const createCustomField = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, fieldType, options } = req.body;

    const field = await CustomField.create({
      companyId: req.userId,
      name,
      fieldType,
      options,
    });

    res.status(201).json(field);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a custom field definition.
 */
export const deleteCustomField = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await CustomField.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Custom field deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * List all custom fields for the logged-in company.
 */
export const listCustomFields = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const fields = await CustomField.find({ companyId: req.userId });
    res.status(200).json(fields);
  } catch (error) {
    next(error);
  }
};
