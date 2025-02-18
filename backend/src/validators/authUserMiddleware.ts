import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "src/models/user";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: any;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)),
  });
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Token");
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const decodedToken = await admin
      .auth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid;

        const user = await UserModel.findOne({ firebaseUid: uid });

        if (!user) {
          return res.status(403).json({ message: "User not found. (middleware)" });
        }

        if (!user.activeUser) {
          return res.status(403).json({ message: "User inactive." });
        }

        req.user = user;
        next();
      });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};
