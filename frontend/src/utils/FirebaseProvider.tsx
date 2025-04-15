import { FirebaseApp, initializeApp } from "firebase/app";
import { GoogleAuthProvider, User, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { MouseEventHandler, ReactNode, createContext, useEffect, useState } from "react";
import { get, post } from "src/api/requests";

import { firebaseConfig } from "src/utils/FirebaseConfig";

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
            if (e.message === '404 Not Found: {"message":"User not found"}') {
              await post(`/api/users`, { firebaseUid: u.uid })
                .then(() => {
                  setUser(u);
                })
                .catch((e2) => {
                  signOutFromFirebase();
                  console.error(e2);
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
