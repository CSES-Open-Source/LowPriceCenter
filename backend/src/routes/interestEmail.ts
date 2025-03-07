import express from "express";
import { handleInterestEmail } from "src/controllers/interestEmail";
const router = express.Router();
router.post("/", handleInterestEmail);
export default router;
