export default function socketlog(...msg: string[]) {
  console.log("[SOCKET.IO LOG]\t", ...msg);
}
