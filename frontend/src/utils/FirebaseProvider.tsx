import type { FirebaseApp } from "firebase/app";
import type { User } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import type { MouseEventHandler, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { get, post } from "/src/api/requests";
import { app, auth } from "/src/utils/Firebase";

export const FirebaseContext = createContext<{
  app: FirebaseApp;
  user: User | null;
  loading: boolean;
  openGoogleAuthentication: MouseEventHandler<HTMLButtonElement>;
  signOutFromFirebase: MouseEventHandler<HTMLButtonElement>;
}>({
  app,
  user: null,
  loading: true,
  openGoogleAuthentication: () => {},
  signOutFromFirebase: () => {},
});

export default function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();

  async function openGoogleAuthentication() {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Popup sign-in error:", e);
    }
  }

  async function signOutFromFirebase() {
    await signOut(auth);
    window.location.href = "/";
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      try {
        if (!u) {
          setUser(null);
          return;
        }

        try {
          await get(`/api/users/${u.uid}`);
          setUser(u);
        } catch (e: any) {
          if (e?.message === '404 Not Found: {"message":"User not found"}') {
            await post(`/api/users`, { firebaseUid: u.uid });
            setUser(u);
          } else {
            await signOutFromFirebase();
          }
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ app, user, loading, openGoogleAuthentication, signOutFromFirebase }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
