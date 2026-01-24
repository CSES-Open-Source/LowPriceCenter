import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import socketlog from "src/util/socketlogger";
import { validateToken } from "src/validators/socketAuthValidation";
import { onConnect } from "./controllers/socket";

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
    return next(new Error("No token provided"));
  }

  try {
    const user = await validateToken(token);
    if (!user) return next(new Error("User not found"));

    socket.data.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication Error"));
  }
});

io.on("connection", onConnect);

export default httpServer;
