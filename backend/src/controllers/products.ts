import { Response } from "express";
import ProductModel from "src/models/product";
import UserModel from "src/models/user";
import { AuthenticatedRequest } from "src/validators/authUserMiddleware";
import mongoose from "mongoose";
import { bucket } from "src/config/firebase"; // Import Firebase bucket
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // For unique filenames
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "src/config/firebaseConfig";

const upload = multer({ storage: multer.memoryStorage() });

/**
 * get all the products in database
 */
export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};
/**
 * get individual product thru product id
 */
export const getProductById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error getting product", error });
  }
};
/**
 * add product to database thru name, price, description, and userEmail
 */
export const addProduct = [
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, price, description } = req.body;
      const userId = req.user.id;
      const userEmail = req.user.userEmail;
      if (!name || !price || !userEmail) {
        return res.status(400).json({ message: "Name, price, and userEmail are required." });
      }

      let image = "";
      if (req.file) {
        const fileName = `${uuidv4()}-${req.file.originalname}`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        image = await getDownloadURL(ref(storage, fileName));
      }

      const newProduct = new ProductModel({
        name,
        price,
        description,
        userEmail,
        image,
        timeCreated: new Date(),
        timeUpdated: new Date(),
      });

      const savedProduct = await newProduct.save();
      await UserModel.findByIdAndUpdate(userId, {
        $push: { productList: savedProduct._id },
      });
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
    }
  },
];
/**
 * delete product from database thru id
 */
export const deleteProductById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.productList.includes(id)) {
      return res.status(400).json({ message: "User does not own this product" });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    await UserModel.findByIdAndUpdate(userId, { $pull: { productList: id } });
    res.status(200).json({ message: "Product successfully deleted", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
/**
 * patch product in database thru id and updated parameters in req
 */
export const updateProductById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const updates = req.body;
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.productList.includes(id)) {
      return res.status(400).json({ message: "User does not own this product" });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { ...updates, timeUpdated: new Date() },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product successfully updated",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error patching product", error });
  }
};
