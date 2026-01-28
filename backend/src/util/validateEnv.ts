/**
 * Parses .env parameters and ensures they are of required types. If any .env parameters are
 * missing, the server will not start and an error will be thrown.
 */

import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  PORT: port(),
  MONGODB_URI: str(),
  FIREBASE_PRIVATE_KEY_BASE64: str(),
  FIREBASE_PROJECT_ID: str(),
  SOCKET_PORT: port(),
});
