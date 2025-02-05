import admin from "firebase-admin";
import env from "src/util/validateEnv";

const decodedServiceAccountJson = Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString(
  "utf-8",
);
const serviceAccount = JSON.parse(decodedServiceAccountJson);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "low-price-center.firebasestorage.app",
});

export const bucket = admin.storage().bucket();
