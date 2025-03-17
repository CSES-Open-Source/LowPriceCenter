import { FirebaseApp, initializeApp } from "firebase/app";
import { GoogleAuthProvider, User, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { MouseEventHandler, ReactNode, createContext, useEffect, useState } from "react";
import { get, post } from "src/api/requests";

/**
 * Context used by FirebaseProvider to provide app and user to pages
 */
const FirebaseContext = createContext<{
  app: FirebaseApp | undefined;
  user: User | null;
  loading: boolean;
  openGoogleAuthentication: MouseEventHandler<HTMLButtonElement>;
  signOutFromFirebase: MouseEventHandler<HTMLButtonElement>;
}>({
  app: undefined,
  user: null,
  loading: true,
  openGoogleAuthentication: () => {},
  signOutFromFirebase: () => {},
});

/**
 * Config information for Firebase.
 * May be moved to environmental variables later.
 */
export const firebaseConfig = {
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
  const [loading, setLoading] = useState<boolean>(true);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  /*sign in*/
  async function openGoogleAuthentication() {
    await signInWithPopup(auth, provider).catch((error) => {
      console.error(error);
    });
  }

  /*sign out*/
  async function signOutFromFirebase() {
    await signOut(auth);
    window.location.href = "/";
  }

  /**
   * Tracks when the user logs in and out to change
   * the state of the user.
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) setUser(null);
      else {
        await get(`/api/users/${u.uid}`)
          .then(() => {
            setUser(u);
          })
          .catch(async (e) => {
            if (e.message == '404 Not Found: {"message":"User not found"}') {
              await post(`/api/users`, { firebaseUid: u.uid })
                .then(() => {
                  setUser(u);
                })
                .catch((e) => {
                  signOutFromFirebase();
                  console.error(e);
                });
            } else {
              signOutFromFirebase();
            }
          });
      }
      setLoading(false);
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

export { FirebaseContext };
