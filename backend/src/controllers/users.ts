import { Request, Response } from "express";
import UserModel from "src/models/user";
import { getAuth } from "firebase-admin/auth";
import { AuthenticatedRequest } from "src/validators/authUserMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// id: firebase user id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.params.firebaseUid;
    const user = await UserModel.findOne({ firebaseUid: firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error getting user", error });
  }
};

// id: firebase user id
export const addUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.body;
    const firebaseUser = await getAuth().getUser(firebaseUid);
    const userEmail = firebaseUser.email;
    const displayName = firebaseUser.displayName || "";

    // Restrict to UCSD emails only
    if (!userEmail || !userEmail.endsWith("@ucsd.edu")) {
      return res.status(403).json({ message: "Only UCSD emails are allowed." });
    }

    // Check for an existing user in MongoDB
    const existingUser = await UserModel.findOne({ firebaseUid: firebaseUid });
    if (existingUser) {
      res.status(409).json({ message: "User already exists", user: existingUser });
      return;
    }

    // Add user to MongoDB
    const newUser = new UserModel({
      userEmail,
      displayName,
      activeUser: true,
      lastLogin: new Date(),
      productList: [],
      firebaseUid,
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
};

// id: firebase user id
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.params.firebaseUid;
    const user = await UserModel.findOne({ firebaseUid: firebaseUid });
    if (!user) {
      throw new Error("User not found");
    }

    // Toggle activeUser status
    user.activeUser = false;
    await user.save();

    // Update Firebase user
    const firebaseUser = await getAuth().getUserByEmail(user.userEmail);
    if (firebaseUser) {
      await getAuth().updateUser(firebaseUser.uid, { disabled: !user.activeUser });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// id: firebase user id
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { displayName, deactivateAccount } = req.body;
    const firebaseUid = req.params.firebaseUid;

    const updatedUser = await UserModel.findOne({ firebaseUid: firebaseUid });
    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Update fields if provided
    if (displayName != undefined) {
      updatedUser.displayName = displayName;
    }
    if (deactivateAccount != undefined) {
      updatedUser.activeUser = false;
    }

    // Update Firebase user
    const firebaseUser = await getAuth().getUserByEmail(updatedUser.userEmail);
    if (firebaseUser) {
      await getAuth().updateUser(firebaseUser.uid, { disabled: true });
    }

    await updatedUser.save();

    res.status(200).json({
      message: "User successfully updated",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/avatars";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.body.userId;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}${ext}`);
  },
});

const avatarFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
  }
};

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadAvatar = [
  avatarUpload.single("avatar"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No avatar image provided" });
      }

      const protocol = req.protocol;
      const host = req.get("host");
      const avatarUrl = `${protocol}://${host}/uploads/avatars/${req.file.filename}`;

      console.log(`Avatar uploaded for user ${userId}:`, avatarUrl);

      res.status(200).json({
        message: "Avatar uploaded successfully",
        avatarUrl: avatarUrl,
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: "Error uploading avatar",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
];

// ========================================
// NEW COVER UPLOAD FUNCTIONALITY
// ========================================

// Configure multer for cover uploads
const coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/covers";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.body.userId;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}${ext}`);
  },
});

const coverFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
  }
};

const coverUpload = multer({
  storage: coverStorage,
  fileFilter: coverFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/users/cover
export const uploadCover = [
  coverUpload.single("cover"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No cover image provided" });
      }

      const protocol = req.protocol;
      const host = req.get("host");
      const coverUrl = `${protocol}://${host}/uploads/covers/${req.file.filename}`;

      console.log(`Cover uploaded for user ${userId}:`, coverUrl);

      return res.status(200).json({
        message: "Cover uploaded successfully",
        coverUrl,
      });
    } catch (error) {
      console.error("Error uploading cover:", error);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        message: "Error uploading cover",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
];
