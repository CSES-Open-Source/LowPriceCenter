import { Socket } from "socket.io";
import socketlog from "src/util/socketlogger";

export const onConnect = async (socket: Socket) => {
  socketlog("Socket connected: ", socket.data.user.displayName);
};
