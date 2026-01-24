import UserModel, { User } from "src/models/user";
import admin from "firebase-admin";

export async function validateToken(token: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const uid = decodedToken.uid;

    const user = await UserModel.findOne<User>({ firebaseUid: uid });

    return user;
  } catch (error) {
    console.error("Token validation failed:", error);
    return null;
  }
}
