import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Secret used to verify the JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Extend Express Request object to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

// 🔐 Middleware to verify JWT tokens for protected routes
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // 🔍 Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract token part

  try {
    // ✅ Verify token and extract payload
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Attach user ID to request for use in next middleware/controller
    req.userId = decoded.id;

    next(); // Allow the request to proceed
  } catch (error) {
    // ❌ Token is invalid or expired
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
