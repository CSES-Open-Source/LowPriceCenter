import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const provider = new GoogleAuthProvider();

export function Home() {
  const { app, user } = useContext(FirebaseContext);
  const auth = getAuth(app);

  function openGoogleAuthentication() {
    signInWithPopup(auth, provider).catch((error) => {
      console.error(error);
    });
  }

  function signOutFromFirebase() {
    signOut(auth);
  }

  return (
    <>
      <Helmet>
        <title>Low-Price Center</title>
      </Helmet>
      <h1>Welcome{user ? " " + user?.displayName + " " : " "}to Low-Price Center!</h1>
      {user ? (
        <button onClick={signOutFromFirebase} className="h-16">
          Sign out
        </button>
      ) : (
        <button className="h-10" onClick={openGoogleAuthentication}>
          Sign in
        </button>
      )}
    </>
  );
}
