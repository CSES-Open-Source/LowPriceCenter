import { AuthenticatedRequest } from "src/validators/authUserMiddleware";
import { Response } from "express";
import ConversationModel from "src/models/conversation";
import MessageModel from "src/models/message";
import UserModel from "src/models/user";

//util and helpers
type CreateConversationRequest = {
  participantEmails?: [string];
};

const getConversationsByUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    const conversation = await ConversationModel.find({ participants: req.user.firebaseUid })
      .populate("lastMessage")
      .populate("participantsPopulated");
    return res.status(200).json(conversation);
  } catch (e) {
    return res.status(500).json({ message: "Error getting conversation:", e });
  }
};

const createConversation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    console.log(req.body);
    const emails: string[] = (req.body as CreateConversationRequest).participantEmails ?? []; // allow user to make conversation with themself

    // extract userids, given participant email list
    const users = await UserModel.find({ userEmail: { $in: emails } });
    const foundEmails = new Set(users.map((u) => u.userEmail));
    const failedEmails = emails.filter((email) => !foundEmails.has(email));
    if (failedEmails.length > 0)
      return res.status(400).json({
        message: "Failed to create a new conversation. Could not find users with emails: ",
        failedEmails,
      });

    const participants = users.map((u) => u.firebaseUid);
    participants.push(req.user.firebaseUid);
    // END extract userids

    // Check conversation does not yet exist
    const existingConversation = await ConversationModel.findOne({
      participants: participants.sort(),
    });
    if (existingConversation) return res.status(200).json(existingConversation);
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

export default {
  getConversationsByUser,
  createConversation,
  getMessagesByConversationId,
};
