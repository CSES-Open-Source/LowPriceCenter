import { useNavigate } from "react-router-dom";
import { useState } from "react";

type FaqItemProps = {
  question: string;
  answer: JSX.Element;
};

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-400 py-6">
      <button
        className="flex justify-between items-center w-full text-lg font-jetbrains"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`${isOpen ? "text-[#00629B]" : "text-black"}`}>{question}</div>
        <img
          src="/downArrow.svg"
          className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && <div className="mt-4 text-sm font-mono">{answer}</div>}
    </div>
  );
}

export function FaqPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col mx-auto w-[60%]">
        <button
          className="text-lg mt-12 font-inter hover:underline self-start"
          onClick={() => navigate("/products")}
        >
          &larr; Return to Marketplace
        </button>
        <div className="font-jetbrains text-center text-[48px] mt-12 mb-8">
          Frequently Asked Questions
        </div>

        <FaqItem
          question="What is Low-Price Center?"
          answer={
            <div>
              <p>We let you buy stuff for cheap at UCSD!</p>
              <p className="mt-2">
                Read more about Low-Price Center{" "}
                <button className="font-bold" onClick={() => navigate("/about-us")}>
                  Here
                </button>
              </p>
            </div>
          }
        />

        <FaqItem
          question="Is Low-Price Center Officially Affiliated with UCSD?"
          answer={
            <p>
              No, Low-Price Center is an independent entity and is not officially affiliated with
              UCSD.
            </p>
          }
        />
        <FaqItem
          question="Is Low-Price Center Officially Affiliated with UCSD?"
          answer={
            <p>
              No, Low-Price Center is an independent entity and is not officially affiliated with
              UCSD.
            </p>
          }
        />
        <FaqItem
          question="Is Low-Price Center Officially Affiliated with UCSD?"
          answer={
            <p>
              No, Low-Price Center is an independent entity and is not officially affiliated with
              UCSD.
            </p>
          }
        />
        <FaqItem
          question="Is Low-Price Center Officially Affiliated with UCSD?"
          answer={
            <p>
              No, Low-Price Center is an independent entity and is not officially affiliated with
              UCSD.
            </p>
          }
        />
        <FaqItem
          question="Is Low-Price Center Officially Affiliated with UCSD?"
          answer={
            <p>
              No, Low-Price Center is an independent entity and is not officially affiliated with
              UCSD.
            </p>
          }
        />
        <FaqItem
          question="How to Buy?"
          answer={
            <p>Visit our marketplace, contact sellers if interested, and then meet to purchase!</p>
          }
        />
      </div>
    </div>
  );
}
