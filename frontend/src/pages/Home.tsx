import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { FirebaseContext } from "src/utils/FirebaseProvider";

const buttonStyles =
  "bg-slate-800 text-white py-3 px-4 rounded-md mt-2 hover:bg-slate-900 transition-colors w-full sm:w-fit flex flex-row gap-3 justify-center";

export function Home() {
  const { user, openGoogleAuthentication, signOutFromFirebase } = useContext(FirebaseContext);

  if (user) {
    return <Navigate to="/marketplace" />;
  }

  return (
    <>
      <Helmet>
        <title>Low-Price Center</title>
      </Helmet>
      <main className="w-full flex flex-col sm:flex-row justify-center items-center mt-16 mb-16 gap-4 sm:gap-6 px-4 sm:px-8 [@media(max-height:400px)]:min-h-screen">
        <section className="w-full max-w-[90%] sm:max-w-[35%] h-[auto] sm:h-[60vh] flex flex-col justify-center text-center sm:text-left">
          <h1 className="font-inter font-normal text-3xl leading-[40px] md:text-4xl lg:text-[50px] lg:leading-[65px] mb-7">
            Welcome to
            <br />
            <span className="font-bold">Low-Price Center</span>
          </h1>
          <div className="bg-[#F5F0E6] w-fit max-w-[90%] flex justify-center items-center mb-7 mx-auto sm:mx-0 p-1">
            <p className="font-inter font-normal text-sm sm:text-base lg:text-xl p-5">
              An online marketplace made <strong>by</strong> and <strong>for</strong> UCSD students
              to buy and sell goods.
            </p>
          </div>
          {user ? (
            <button className={buttonStyles} onClick={signOutFromFirebase}>
              Sign out
            </button>
          ) : (
            <button className={buttonStyles} onClick={openGoogleAuthentication}>
              <img src="/googlebutton.svg" className="w-6 h-6 mr-1" />
              Sign in with Google
            </button>
          )}
        </section>
        <section className="w-full max-w-[90%] sm:max-w-[40%] h-[auto] sm:h-[60vh] mt-4 sm:mt-0">
          <img
            src="./ucsd-pricecenter.png"
            alt="UCSD Price Center"
            className="w-full h-full object-cover shadow-[8px_8px_0px_rgba(165,165,165,0.6)]"
          />
        </section>
      </main>
    </>
  );
}
