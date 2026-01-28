import { Response } from "express";
import MerchModel from "src/models/merch";
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
}).single("image");

/**
 * Get all merch items
 */
export const getAllMerch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const merchItems = await MerchModel.find().populate("studentOrganizationId");
    res.status(200).json(merchItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching merch items", error });
  }
};

/**
 * Get merch by ID
 */
export const getMerchById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const merch = await MerchModel.findById(id).populate("studentOrganizationId");
    if (!merch) {
      return res.status(404).json({ message: "Merch item not found" });
    }
    res.status(200).json(merch);
  } catch (error) {
    res.status(500).json({ message: "Error getting merch item", error });
  }
};

/**
 * Get all merch items for a specific student organization
 */
export const getMerchByOrganization = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const organizationId = req.params.organizationId;
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ message: "Invalid organization ID format" });
    }
    const merchItems = await MerchModel.find({ studentOrganizationId: organizationId });
    res.status(200).json(merchItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching merch items", error });
  }
};

/**
 * Get all merch items for the authenticated user's organization
 */
export const getMyOrganizationMerch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    const firebaseUid = req.user.firebaseUid;
    const organization = await StudentOrganizationModel.findOne({ firebaseUid });

    if (!organization) {
      return res.status(404).json({ message: "Student organization not found" });
    }

    const merchItems = await MerchModel.find({ studentOrganizationId: organization._id });
    res.status(200).json(merchItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching merch items", error });
  }
};

/**
 * Add merch item to a student organization
 */
export const addMerch = [
  upload,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, price, description } = req.body;
      if (!req.user) return res.status(404).json({ message: "User not found" });

      const firebaseUid = req.user.firebaseUid;
      const organization = await StudentOrganizationModel.findOne({ firebaseUid });

      if (!organization) {
        return res.status(404).json({ message: "Student organization not found" });
      }

      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required." });
      }

      let imageUrl = "";
      if (req.file) {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const fileName = `${uuidv4()}-${req.file.originalname}`;
        const firebaseFile = bucket.file(fileName);

        await firebaseFile.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        imageUrl = await getDownloadURL(ref(storage, fileName));
      }

      const newMerch = new MerchModel({
        name,
        price: parseFloat(price),
        description: description || "",
        image: imageUrl,
        studentOrganizationId: organization._id,
        timeCreated: new Date(),
        timeUpdated: new Date(),
      });

      const savedMerch = await newMerch.save();
      res.status(201).json(savedMerch);
    } catch (error) {
      res.status(500).json({ message: "Error adding merch item", error });
    }
  },
];

/**
 * Update merch item
 */
export const updateMerch = [
  upload,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id;
      if (!req.user) return res.status(404).json({ message: "User not found" });
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const firebaseUid = req.user.firebaseUid;
      const organization = await StudentOrganizationModel.findOne({ firebaseUid });

      if (!organization) {
        return res.status(404).json({ message: "Student organization not found" });
      }

      const merch = await MerchModel.findById(id);
      if (!merch) {
        return res.status(404).json({ message: "Merch item not found" });
      }

      // Verify the merch belongs to the user's organization
      if (merch.studentOrganizationId.toString() !== organization._id.toString()) {
        return res.status(403).json({ message: "You don't have permission to edit this merch item" });
      }

      const { name, price, description, existingImage } = req.body;

      let imageUrl = existingImage || merch.image;
      if (req.file) {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const fileName = `${uuidv4()}-${req.file.originalname}`;
        const firebaseFile = bucket.file(fileName);

        await firebaseFile.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        imageUrl = await getDownloadURL(ref(storage, fileName));
      }

      const updatedMerch = await MerchModel.findByIdAndUpdate(
        id,
        {
          name: name || merch.name,
          price: price !== undefined ? parseFloat(price) : merch.price,
          description: description !== undefined ? description : merch.description,
          image: imageUrl,
          timeUpdated: new Date(),
        },
        { new: true },
      );

      if (!updatedMerch) {
        return res.status(404).json({ message: "Merch item not found" });
      }

      res.status(200).json({
        message: "Merch item successfully updated",
        merch: updatedMerch,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating merch item", error });
    }
  },
];

/**
 * Delete merch item
 */
export const deleteMerch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!req.user) return res.status(404).json({ message: "User not found" });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const firebaseUid = req.user.firebaseUid;
    const organization = await StudentOrganizationModel.findOne({ firebaseUid });

    if (!organization) {
      return res.status(404).json({ message: "Student organization not found" });
    }

    const merch = await MerchModel.findById(id);
    if (!merch) {
      return res.status(404).json({ message: "Merch item not found" });
    }

    // Verify the merch belongs to the user's organization
    if (merch.studentOrganizationId.toString() !== organization._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to delete this merch item" });
    }

    const deletedMerch = await MerchModel.findByIdAndDelete(id);
    if (!deletedMerch) {
      return res.status(404).json({ message: "Merch item not found" });
    }

    res.status(200).json({
      message: "Merch item successfully deleted",
      merch: deletedMerch,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting merch item", error });
  }
};

