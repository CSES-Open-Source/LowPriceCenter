import { AuthenticatedRequest } from "src/validators/authUserMiddleware";
import { Response } from "express";
import ConversationModel from "src/models/conversation";
import MessageModel from "src/models/message";
import UserModel from "src/models/user";
import { Types } from "mongoose";

//util and helpers
type CreateConversationRequest = {
  participantEmails?: [string];
};

type PersistMessageRequest = {
  content: string;
};

const getConversationsByUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    const conversation = await ConversationModel.find({ participants: req.user._id }).populate(
      "lastMessage",
    );
    return res.status(200).json(conversation);
  } catch (e) {
    return res.status(500).json({ message: "Error getting conversation:", e });
  }
};

const getMessagesByConversationId = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = await MessageModel.find({ conversationId: req.params.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(messages);
  } catch (e) {
    return res.status(500).json({ message: "Error getting messages: ", e });
  }
};

const createConversation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    const emails = (req.body as CreateConversationRequest).participantEmails ?? []; // allow user to make conversation with themself

    // extract userids, given participant email list
    const users = await UserModel.find({ userEmail: { $in: emails } });
    const foundEmails = new Set(users.map((u) => u.userEmail));
    const failedEmails = emails.filter((email) => !foundEmails.has(email));
    if (failedEmails.length > 0)
      return res.status(400).json({
        message: "Failed to create a new conversation. Could not find users with emails: ",
        failedEmails,
      });

    const participants = users.map((u) => u._id);
    participants.push(req.user._id);
    // END extract userids

    // Check conversation does not yet exist
    const existingConversation = await ConversationModel.findOne({
      participants: participants.sort(),
    });
    if (existingConversation)
      return res
        .status(409)
        .json({ message: `Conversation already exists: ${existingConversation._id}` });
    // END check conversation does not yet exist

    const newConversation = await ConversationModel.create({
      participants,
    });

    if (!newConversation)
      return res.status(400).json({ message: "Failed to create a new conversation" });
    return res.status(200).json(newConversation);
  } catch (error) {
    return res.status(500).json({ message: "Error creating conversation: ", error });
  }
};

const persistMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    const content = (req.body as PersistMessageRequest).content ?? "";
    const conversationId = req.params.id;
    if (!Types.ObjectId.isValid(conversationId))
      return res.status(400).json({ message: "Invalid conversation ID" });
    const conversation = await ConversationModel.findOne({ _id: conversationId });
    if (!conversation) return res.status(404).json({ message: "Conversation does not exist" });

    const newMessage = await MessageModel.create({
      conversationId,
      authorId: req.user._id,
      content,
    });

    if (!newMessage) return res.status(400).json({ message: "Failed to create a a new message" });

    await ConversationModel.updateOne(
      { _id: conversationId },
      { $set: { lastMessage: newMessage._id } },
    );

    return res.status(200).json(newMessage);
  } catch (e) {
    return res.status(500).json({ message: "Error persisting message: ", e });
  }
};

export default {
  getConversationsByUser,
  persistMessage,
  createConversation,
  getMessagesByConversationId,
};
