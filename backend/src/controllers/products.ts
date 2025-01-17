import { Request, Response } from "express";
import ProductModel from "src/models/product";
const mongoose = require("mongoose");
/**
 * get all the products in database
 */
export const getProducts = async (req: Request, res: Response) => {
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
export const getProductById = async (req: Request, res: Response) => {
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
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, userEmail } = req.body;

    if (!name || !price || !userEmail) {
      return res.status(400).json({ message: "Name, price, and userEmail are required." });
    }

    const newProduct = new ProductModel({
      name,
      price,
      description,
      userEmail,
      timeCreated: new Date(),
      timeUpdated: new Date(),
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};
/**
 * delete product from database thru id
 */
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product successfully deleted", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
/**
 * patch product in database thru id and updated parameters in req
 */
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
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
