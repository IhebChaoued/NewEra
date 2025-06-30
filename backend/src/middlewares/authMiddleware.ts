import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * Extend Express Request object with custom properties:
 * - userId: the logged-in user's or company's ID
 * - userRole: either "user" or "company"
 */
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: "user" | "company";
}

/**
 * Verifies JWT token and attaches user ID and role to the request.
 */
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: "user" | "company";
    };

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware to ensure only users can access the route.
 */
export const isUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole === "user") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Users only." });
  }
};

/**
 * Middleware to ensure only companies can access the route.
 */
export const isCompany = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole === "company") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Companies only." });
  }
};
