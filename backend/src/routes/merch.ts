import express from "express";
import {
  getAllMerch,
  getMerchById,
  getMerchByOrganization,
  getMyOrganizationMerch,
  addMerch,
  updateMerch,
  deleteMerch,
} from "src/controllers/merch";
import { authenticateUser } from "src/validators/authUserMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getAllMerch);
router.get("/my-organization", authenticateUser, getMyOrganizationMerch);
router.get("/organization/:organizationId", authenticateUser, getMerchByOrganization);
router.get("/:id", authenticateUser, getMerchById);
router.post("/", authenticateUser, addMerch);
router.patch("/:id", authenticateUser, updateMerch);
router.delete("/:id", authenticateUser, deleteMerch);

export default router;

