/**
 * Initializes mongoose and express.
 */

import "module-alias/register";
import mongoose from "mongoose";
import app from "src/app";
import env from "src/util/validateEnv";
import socketServer from "src/socket";
import socketlog from "src/util/socketlogger";

const PORT = env.PORT;
const SOCKET_PORT = env.SOCKET_PORT;
const MONGODB_URI = env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Mongoose connected!");
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}.`);
    });
  })
  .catch(console.error);

socketServer.listen(SOCKET_PORT, () => {
  socketlog(`Server listening on ${SOCKET_PORT}`);
});
