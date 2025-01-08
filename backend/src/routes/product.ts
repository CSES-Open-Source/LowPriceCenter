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

export default router;
