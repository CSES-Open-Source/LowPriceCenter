import express from "express";
import {
  getUsers,
  getUserById,
  addUser,
  deleteUserById,
  updateUserById,
  uploadAvatar,
  uploadCover,
} from "src/controllers/users";
import { toggleSavedProduct } from "src/controllers/savedProducts";

const router = express.Router();

router.get("/", getUsers);
router.get("/:firebaseUid", getUserById);

router.post("/", addUser);
router.post("/:userId/saved-products", toggleSavedProduct);

router.post("/avatar", uploadAvatar);
router.post("/cover", uploadCover);

router.delete("/:id", deleteUserById);
router.patch("/:id", updateUserById);

export default router;
