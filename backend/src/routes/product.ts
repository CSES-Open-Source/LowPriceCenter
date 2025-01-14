/**
 * Product route requests.
 */

import express from "express";
import ProductModel from "src/models/product";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await ProductModel.find();
  res.status(200).json(products);
});

router.post("/", async (req, res) => {
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
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product successfully deleted", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

export default router;
