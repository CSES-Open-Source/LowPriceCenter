import { Helmet } from "react-helmet-async";
import GoogleButton from 'react-google-button'

export default function Homepage() {
    return (
      <>
        <Helmet>
          <title>Low-Price Center Homepage</title>
        </Helmet>
        <main className="w-full flex flex-col sm:flex-row justify-center items-center mt-16 mb-16">
          <section className="w-full max-w-[35%] h-[60vh] max-h-[60vh] flex flex-col justify-center">
            <h1 className="font-inter font-normal sm:text-[30px] sm:leading-[40px] md:text-[50px] md:leading-[65px] mb-7">
              Welcome to
              <br/>
              <span className="font-bold">Low-Price Center</span>
            </h1>
            <div className="bg-[#F5F0E6] w-[82%] max-w-[82%] flex justify-center items-center mb-7">
              <p className="font-inter font-normal sm:text-base sm:leading-[18px] md:text-xl md:leading-[24px] p-5">
                An online marketplace made <strong>by</strong> and <strong>for</strong>
                <br/>
                UCSD students to buy and sell goods.
              </p>
            </div>
            <GoogleButton
              onClick={() => { console.log('Google button clicked') }}
            />
          </section>
          <section className="w-full max-w-[45%] h-[60vh] max-h-[60vh]">
            <img src="./ucsd-pricecenter.png"
            alt="UCSD Price Center"
            className="w-full h-full object-cover shadow-[8px_8px_0px_rgba(165,165,165,0.6)]"
            />
          </section>
        </main>
      </>
    )
  }
  