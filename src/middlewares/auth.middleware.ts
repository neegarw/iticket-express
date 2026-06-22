import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/user.model";

export interface AuthRequest extends Request {
  user?: User;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
