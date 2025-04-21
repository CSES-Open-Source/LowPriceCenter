import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "src/utils/FirebaseConfig";

export function getToken() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  return auth.currentUser?.getIdToken();
}
