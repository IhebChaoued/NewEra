import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

/**
 * Central error handler for all routes.
 * Ensures consistent error responses.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
