import express from "express";
import {
  getUsers,
  getUserById,
  addUser,
  deleteUserById,
  updateUserById,
  getAllStaff,
  getAllCustomers,
  changeUserRole,
} from "src/controllers/users";
import { toggleSavedProduct } from "src/controllers/savedProducts";
import {
  authenticateUser,
  requireAdmin,
  requireStaff,
  requireOwnershipOrStaff,
} from "src/validators/authUserMiddleware";

const router = express.Router();

// Public routes (no authentication required)
router.post("/", addUser);

// Authenticated user routes
router.get("/", authenticateUser, getUsers);
router.get("/:firebaseUid", authenticateUser, getUserById);
router.post("/:userId/saved-products", authenticateUser, toggleSavedProduct);

// Staff+ routes (staff or admin)
router.patch("/:id", requireStaff, updateUserById);
router.get("/customers", requireStaff, getAllCustomers);

// Admin-only routes
router.get("/staff", requireAdmin, getAllStaff);
router.put("/:firebaseUid/role", requireAdmin, changeUserRole);

// Require ownership or staff or admin priveleges
router.delete("/:id", requireOwnershipOrStaff, deleteUserById);

export default router;
