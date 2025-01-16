import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  deleteProductById,
  updateProductById,
} from "src/controllers/products";
import mongoose = require("mongoose");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", addProduct);
router.delete("/:id", deleteProductById);
router.patch("/:id", updateProductById);
export default router;
