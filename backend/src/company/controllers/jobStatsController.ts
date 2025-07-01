import { Request, Response, NextFunction } from "express";
import JobStats from "../models/JobStats";

/**
 * Fetch all archived job stats.
 * Optionally filter by companyId or date range.
 */
export const getJobStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: any = {};

    // Optional: filter by companyId
    if (req.query.companyId) {
      filters.companyId = req.query.companyId;
    }

    // Optional: filter by date range
    if (req.query.startDate || req.query.endDate) {
      filters.deletedAt = {};
      if (req.query.startDate) {
        filters.deletedAt.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filters.deletedAt.$lte = new Date(req.query.endDate as string);
      }
    }

    const stats = await JobStats.find(filters);

    res.status(200).json({
      total: stats.length,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
