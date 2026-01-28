import { Socket } from "socket.io";
import { User } from "src/models/user";
import socketlog from "src/util/socketlogger";
import ConversationModel from "src/models/conversation";
import MessageModel from "src/models/message";

type SocketResponse = {
  status: "OK" | "BAD";
  body?: unknown;
  err?: { msg: string };
};

type JoinConversationPayload = {
  id: string;
};

type SendMessagePayload = {
  conversationId: string;
  content: string;
};

export const onConnect = async (socket: Socket) => {
  socketlog("Socket connected: ", socket.data.user.displayName);
};

export function onJoinConversation(socket: Socket) {
  return async (payload: JoinConversationPayload, callback: (response: SocketResponse) => void) => {
    if (typeof callback !== "function") return;
    try {
      const user: User = socket.data.user;
      const id = payload.id;
      const conversation = await ConversationModel.findById(id);

      if (!user) throw new Error("Unauthenticated Request");
      if (!conversation) throw new Error("No conversation found");
      if (!conversation.participants.includes(user._id))
        throw new Error("User is not in this conversation");

      const newRoom = `conversation:${id}`;
      if (socket.data.currentConversation) socket.leave(socket.data.currentConversation);
      socket.data.currentConversation = newRoom;
      socket.join(newRoom);

      socketlog(`Current rooms for ${user.displayName}:`, ...socket.rooms);

      // --- Fetch all messages for this conversation ---
      const messages = await MessageModel.find({ conversationId: id }).sort({ createdAt: 1 }); // sort oldest -> newest

      // Send messages to this socket only
      return callback({ status: "OK", body: messages });
    } catch (err) {
      return callback({
        status: "BAD",
        err: { msg: err instanceof Error ? err.message : String(err) },
      });
    }
  };
}

export function onSendMessage(socket: Socket) {
  return async (payload: SendMessagePayload, callback: (r: SocketResponse) => void) => {
    try {
      const sender = socket.data.user;
      if (!sender) throw new Error("Unauthenticated");

      const conversation = await ConversationModel.findById(payload.conversationId);
      if (!conversation) throw new Error("No conversation found");

      if (!conversation.participants.some((id) => id.equals(sender._id))) {
        throw new Error("Not in conversation");
      }

      const message = await MessageModel.create({
        content: payload.content,
        authorUid: sender.firebaseUid,
        conversationId: payload.conversationId,
      });

      conversation.lastMessage = message._id;
      await conversation.save();

      return callback({ status: "OK" });
    } catch (e) {
      console.error(e);
      return callback({
        status: "BAD",
        err: { msg: e instanceof Error ? e.message : "Internal Error" },
      });
    }
  };
}
