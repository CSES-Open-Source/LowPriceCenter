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
import multer from "multer";

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

/*
 * search for product by name
 */
export const getProductsByQuery = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const keyword = req.query.keyword;
    let tags: string[] = [];
    if (typeof req.query.tags === "string" && req.query.tags.length > 0) {
      tags = req.query.tags.split(",");
    }

    let query: any = {}
    if (typeof keyword === "string"  && keyword.length > 0){
      query.name = { $regex: keyword || "", $options: "i" }
    }
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    const products = await ProductModel.find(query);
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
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
      const { name, price, description, tags } = req.body;
      if (!req.user) return res.status(404).json({ message: "User not found" });
      const userId = req.user._id;
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
        tags,
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
    if (!req.user) return res.status(404).json({ message: "User not found" });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const userId = req.user._id;
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

// /**
//  * patch product in database thru id and updated parameters in req
//  */
export const updateProductById = [
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id;
      if (!req.user) return res.status(404).json({ message: "User not found" });
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Invalid ID format" });

      console.log("in the terminal2");
      console.log(req.user);

      const userId = req.user._id;
      console.log("in the terminal2.5");
      const user = await UserModel.findById(userId);
      console.log("in the terminal3");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("in the terminal4");

      if (!user.productList.includes(id)) {
        return res.status(400).json({ message: "User does not own this product" });
      }

      console.log("Imageing...");

      let newImage;

      if (req.file) {
        const fileName = `${uuidv4()}-${req.file.originalname}`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        newImage = await getDownloadURL(ref(storage, fileName));
      }

      const updates = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        timeUpdated: new Date(),
        image: newImage,
      };

      console.log("Done...");

      const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, { new: true });

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
  },
];
