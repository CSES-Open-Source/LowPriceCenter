import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./FirebaseProvider";

export function getToken() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  return auth.currentUser?.getIdToken();
}
