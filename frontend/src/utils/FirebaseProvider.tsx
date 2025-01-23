import { FirebaseApp, initializeApp } from "firebase/app";
import { GoogleAuthProvider, User, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { MouseEventHandler, ReactNode, createContext, useEffect, useState } from "react";

/**
 * Context used by FirebaseProvider to provide app and user to pages
 */
const FirebaseContext = createContext<{
  app: FirebaseApp | undefined;
  user: User | null;
  openGoogleAuthentication: MouseEventHandler<HTMLButtonElement>;
  signOutFromFirebase: MouseEventHandler<HTMLButtonElement>;
}>({
  app: undefined,
  user: null,
  openGoogleAuthentication: () => {},
  signOutFromFirebase: () => {},
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
  const provider = new GoogleAuthProvider();

  async function openGoogleAuthentication() {
    await signInWithPopup(auth, provider).catch((error) => {
      console.error(error);
    });
    window.location.href = "/marketplace";
  }

  async function signOutFromFirebase() {
    await signOut(auth);
    window.location.href = "/";
  }

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

  return (
    <FirebaseContext.Provider value={{ app, user, openGoogleAuthentication, signOutFromFirebase }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export { FirebaseContext };
