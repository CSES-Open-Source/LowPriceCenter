import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const buttonStyles =
  "bg-slate-800 text-white py-2 px-3 rounded-md mt-2 hover:bg-slate-900 transition-colors";

export function Home() {
  const { user, openGoogleAuthentication } = useContext(FirebaseContext);

  if (user) {
    return <Navigate to="/marketplace" />;
  }

  return (
    <>
      <Helmet>
        <title>Low-Price Center</title>
      </Helmet>
      <div className="m-8">
        <h1 className="text-2xl font-bold">Welcome to Low-Price Center!</h1>
        <button className={buttonStyles} onClick={openGoogleAuthentication}>
          Sign in
        </button>
      </div>
    </>
  );
}
