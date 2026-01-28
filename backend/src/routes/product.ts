import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  deleteProductById,
  updateProductById,
  getProductsByName,
} from "src/controllers/products";
import { authenticateUser } from "src/validators/authUserMiddleware";
const router = express.Router();

router.get("/", authenticateUser, getProducts);
router.get("/search/:query", authenticateUser, getProductsByName);
router.get("/:id", authenticateUser, getProductById);
router.post("/", authenticateUser, addProduct);
router.delete("/:id", authenticateUser, deleteProductById);
router.patch("/:id", authenticateUser, updateProductById);

export default router;
