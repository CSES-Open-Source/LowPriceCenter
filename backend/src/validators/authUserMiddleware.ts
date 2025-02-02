import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "src/models/user";
import dotenv from "dotenv";
dotenv.config();
export interface AuthenticatedRequest extends Request {
  user?: any;
}
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { id: string };
    const user = await UserModel.findById(decoded.id);
    if (!user || !user.activeUser) {
      return res.status(403).json({ message: "User not found or inactive." });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
