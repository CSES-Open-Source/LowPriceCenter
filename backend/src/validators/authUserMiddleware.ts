import { Request, Response, NextFunction } from "express";
import UserModel, { User } from "src/models/user";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: User;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
    ),
  });
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await UserModel.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(403).json({ message: "User not found in database." });
    }

    if (!user.activeUser) {
      return res.status(403).json({ message: "User account is inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ 
      message: "Invalid or expired token",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Middleware that requires the user to have admin role
 */
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  await authenticateUser(req, res, () => {
    if (!req.user) {
      return res.status(403).json({ message: "User not authenticated." });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required." 
      });
    }

    next();
  });
};

/**
 * Middleware that requires either staff or admin role
 */
export const requireStaff = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  await authenticateUser(req, res, () => {
    if (!req.user) {
      return res.status(403).json({ message: "User not authenticated." });
    }

    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. Staff or admin privileges required." 
      });
    }

    next();
  });
};