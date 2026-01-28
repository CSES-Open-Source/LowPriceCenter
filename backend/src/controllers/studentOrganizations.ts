import { Response } from "express";
import StudentOrganizationModel from "src/models/studentOrganization";
import { AuthenticatedRequest } from "src/validators/authUserMiddleware";
import mongoose from "mongoose";
import { bucket } from "src/config/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "src/config/firebaseConfig";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).single("profilePicture");

/**
 * Get all student organizations
 */
export const getStudentOrganizations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizations = await StudentOrganizationModel.find();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student organizations", error });
  }
};

/**
 * Get student organization by ID
 */
export const getStudentOrganizationById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const organization = await StudentOrganizationModel.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Student organization not found" });
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error getting student organization", error });
  }
};

/**
 * Get student organization by Firebase UID
 */
export const getStudentOrganizationByFirebaseUid = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const firebaseUid = req.params.firebaseUid;
    const organization = await StudentOrganizationModel.findOne({ firebaseUid });
    if (!organization) {
      return res.status(404).json({ message: "Student organization not found" });
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error getting student organization", error });
  }
};

/**
 * Create a new student organization profile
 */
export const createStudentOrganization = [
  upload,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) return res.status(404).json({ message: "User not found" });

      const { organizationName, bio, location, contactInfo, merchLocation } = req.body;
      const firebaseUid = req.user.firebaseUid;

      if (!organizationName) {
        return res.status(400).json({ message: "Organization name is required." });
      }

      // Check if organization already exists for this user
      const existingOrg = await StudentOrganizationModel.findOne({ firebaseUid });
      if (existingOrg) {
        return res.status(409).json({
          message: "Student organization profile already exists for this user",
          organization: existingOrg,
        });
      }

      let profilePictureUrl = "";
      if (req.file) {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const fileName = `${uuidv4()}-${req.file.originalname}`;
        const firebaseFile = bucket.file(fileName);

        await firebaseFile.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        profilePictureUrl = await getDownloadURL(ref(storage, fileName));
      }

      // Parse contactInfo if it's a string
      let parsedContactInfo = {
        email: "",
        instagram: "",
        website: "",
        other: "",
      };
      if (contactInfo) {
        if (typeof contactInfo === "string") {
          parsedContactInfo = JSON.parse(contactInfo);
        } else {
          parsedContactInfo = contactInfo;
        }
      }

      const newOrganization = new StudentOrganizationModel({
        organizationName,
        profilePicture: profilePictureUrl,
        bio: bio || "",
        location: location || "",
        contactInfo: parsedContactInfo,
        merchLocation: merchLocation || "",
        firebaseUid,
        timeCreated: new Date(),
        timeUpdated: new Date(),
      });

      const savedOrganization = await newOrganization.save();
      res.status(201).json(savedOrganization);
    } catch (error) {
      res.status(500).json({ message: "Error creating student organization", error });
    }
  },
];

/**
 * Update student organization profile
 */
export const updateStudentOrganization = [
  upload,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) return res.status(404).json({ message: "User not found" });

      const firebaseUid = req.user.firebaseUid;
      const organization = await StudentOrganizationModel.findOne({ firebaseUid });

      if (!organization) {
        return res.status(404).json({ message: "Student organization not found" });
      }

      const { organizationName, bio, location, contactInfo, merchLocation, existingProfilePicture } =
        req.body;

      // Handle profile picture upload
      let profilePictureUrl = existingProfilePicture || organization.profilePicture;
      if (req.file) {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const fileName = `${uuidv4()}-${req.file.originalname}`;
        const firebaseFile = bucket.file(fileName);

        await firebaseFile.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        profilePictureUrl = await getDownloadURL(ref(storage, fileName));
      }

      // Parse contactInfo if it's a string
      let parsedContactInfo = organization.contactInfo;
      if (contactInfo) {
        if (typeof contactInfo === "string") {
          parsedContactInfo = JSON.parse(contactInfo);
        } else {
          parsedContactInfo = contactInfo;
        }
      }

      const updatedOrganization = await StudentOrganizationModel.findOneAndUpdate(
        { firebaseUid },
        {
          organizationName: organizationName || organization.organizationName,
          profilePicture: profilePictureUrl,
          bio: bio !== undefined ? bio : organization.bio,
          location: location !== undefined ? location : organization.location,
          contactInfo: parsedContactInfo,
          merchLocation: merchLocation !== undefined ? merchLocation : organization.merchLocation,
          timeUpdated: new Date(),
        },
        { new: true },
      );

      if (!updatedOrganization) {
        return res.status(404).json({ message: "Student organization not found" });
      }

      res.status(200).json({
        message: "Student organization successfully updated",
        organization: updatedOrganization,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating student organization", error });
    }
  },
];

/**
 * Delete student organization profile
 */
export const deleteStudentOrganization = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    const firebaseUid = req.user.firebaseUid;
    const organization = await StudentOrganizationModel.findOneAndDelete({ firebaseUid });

    if (!organization) {
      return res.status(404).json({ message: "Student organization not found" });
    }

    res.status(200).json({
      message: "Student organization successfully deleted",
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student organization", error });
  }
};

