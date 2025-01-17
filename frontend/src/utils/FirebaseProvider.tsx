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
  apiKey: "AIzaSyBssbaMlxIJHYI7G7zOriU0VaWGnGrQv5M",
  authDomain: "low-price-center.firebaseapp.com",
  projectId: "low-price-center",
  storageBucket: "low-price-center.firebasestorage.app",
  messagingSenderId: "163704233704",
  appId: "1:163704233704:web:6ee0dc540f6f25d6ceb35d",
  measurementId: "G-RV7RV9W17W",
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
