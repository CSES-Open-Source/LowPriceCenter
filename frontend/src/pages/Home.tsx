import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const provider = new GoogleAuthProvider();

const buttonStyles =
  "bg-slate-800 text-white py-2 px-3 rounded-md mt-2 hover:bg-slate-900 transition-colors";

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
      <div className="m-8">
        <h1 className="text-2xl font-bold">
          Welcome{user ? " " + user?.displayName + " " : " "}to Low-Price Center!
        </h1>
        {user ? (
          <button className={buttonStyles} onClick={signOutFromFirebase}>
            Sign out
          </button>
        ) : (
          <button className={buttonStyles} onClick={openGoogleAuthentication}>
            Sign in
          </button>
        )}
      </div>
    </>
  );
}
