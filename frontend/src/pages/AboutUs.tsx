import { useNavigate } from "react-router-dom";
export function AboutUsPage() {
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
        <div className="font-jetbrains text-center text-[48px] mt-12">About Us</div>
        <div className="text-center mx-auto bg-[#F5F0E6] my-12 p-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </div>
      </div>
      <div className="flex xxl:flex-row xxl:justify-between mx-auto gap-y-12 mb-12 xxl:w-[60%] w-[30%] flex-col">
        <img src="csesLogo.png" alt="cses" />
        <img src="ucsdLogo.png" alt="ucsd" />
      </div>
    </div>
  );
}
