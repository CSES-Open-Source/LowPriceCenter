import express from "express";
import {
  getStudentOrganizations,
  getStudentOrganizationById,
  getStudentOrganizationByFirebaseUid,
  createStudentOrganization,
  updateStudentOrganization,
  deleteStudentOrganization,
} from "src/controllers/studentOrganizations";
import { authenticateUser } from "src/validators/authUserMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getStudentOrganizations);
router.get("/:id", authenticateUser, getStudentOrganizationById);
router.get("/firebase/:firebaseUid", authenticateUser, getStudentOrganizationByFirebaseUid);
router.post("/", authenticateUser, createStudentOrganization);
router.patch("/", authenticateUser, updateStudentOrganization);
router.delete("/", authenticateUser, deleteStudentOrganization);

export default router;

