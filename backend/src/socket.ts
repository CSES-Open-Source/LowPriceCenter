import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import socketlog from "src/util/socketlogger";
import { validateToken } from "src/validators/socketAuthValidation";
import { onSendMessage, onJoinConversation } from "src/controllers/socket";

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// auth protection bc we're good little coders :)
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    socketlog("Error: No token provided");
    return next(new Error("No token provided"));
  }

  try {
    const user = await validateToken(token);
    if (!user) return next(new Error("User not found"));

    socket.data.user = user;
    next();
  } catch (err) {
    socketlog("Error: Authentication error");
    next(new Error("Authentication Error"));
  }
});

io.on("connection", (socket) => {
  socketlog("Socket connected: ", socket.data.user.displayName, " id: ", socket.id);
  socket.join(`user:${socket.data.user.firebaseUid}`);
  socket.onAny((eventName, payload) => {
    socketlog(
      `User: ${socket.data.user.displayName}; Event: ${eventName}; Payload: ${JSON.stringify(
        payload,
      )}`,
    );
  });

  // event handling
  socket.on("conversation:join", onJoinConversation(socket));
  socket.on("message:send", onSendMessage(socket));
});

export default httpServer;
