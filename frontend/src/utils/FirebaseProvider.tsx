import { FirebaseApp, initializeApp } from "firebase/app";
import { User, getAuth } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";

/**
 * Context used by FirebaseProvider to provide app and user to pages
 */
const FirebaseContext = createContext<{ app: FirebaseApp | undefined; user: User | null }>({
  app: undefined,
  user: null,
});

/**
 * Config information for Firebase.
 * May be moved to environmental variables later.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCJsTam2s3h-lSMmv9rD2A2UoVkKDHwlJM",
  authDomain: "lowpricecenter-960e9.firebaseapp.com",
  projectId: "lowpricecenter-960e9",
  storageBucket: "lowpricecenter-960e9.firebasestorage.app",
  messagingSenderId: "410570144308",
  appId: "1:410570144308:web:9b46ed663503f8bcc26861",
};

/**
 * Wraps children in FirebaseContext.Provider to give all
 * children access to sustained Firebase app and user
 * data.
 */
export default function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  /**
   * Tracks when the user logs in and out to change
   * the state of the user.
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  return <FirebaseContext.Provider value={{ app, user }}>{children}</FirebaseContext.Provider>;
}

export { FirebaseContext };
