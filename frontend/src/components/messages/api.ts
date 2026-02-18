type SocketResponse = {
  status: "OK" | "BAD";
  body?: unknown;
  err?: { msg: string };
};

function isOk(res: SocketResponse) {
  return res.status === "OK";
}

export { isOk };
export type { SocketResponse };
