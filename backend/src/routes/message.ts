import express from "express";
import MessageController from "src/controllers/message";
import { authenticateUser } from "src/validators/authUserMiddleware";

const router = express.Router();

router.get("/conversation", authenticateUser, MessageController.getConversationsByUser);
router.get("/:id", authenticateUser, MessageController.getMessagesByConversationId);
router.post("/conversation", authenticateUser, MessageController.createConversation);
router.post("/:id", authenticateUser, MessageController.persistMessage);

export default router;
