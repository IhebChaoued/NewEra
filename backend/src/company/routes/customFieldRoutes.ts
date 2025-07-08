import express from "express";
import { verifyToken, isCompany } from "../../middlewares/authMiddleware";
import {
  createCustomField,
  deleteCustomField,
  listCustomFields,
} from "../controllers/customFieldController";

const router = express.Router();

/**
 * POST /api/custom-fields
 * Create a new custom field.
 */
router.post("/", verifyToken, isCompany, createCustomField);

/**
 * DELETE /api/custom-fields/:id
 * Delete a custom field.
 */
router.delete("/:id", verifyToken, isCompany, deleteCustomField);

/**
 * GET /api/custom-fields
 * List all custom fields for the company.
 */
router.get("/", verifyToken, isCompany, listCustomFields);

export default router;
