import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


const placeholderData = [
    {
      productName: "Mattress",
      productPrice: 500,
      productImage: "productImages/mattress.png",
      sellerEmail: "ucsd@example.com",
      productInfo: "A comfortable mattress with memory foam for a good night's sleep.",
    },
];

export function IndividualProductPage() {
  const navigate = useNavigate();
  const product = placeholderData[0];

  return (
    <>
      <Helmet>
        <title>{product.productName} - Low-Price Center</title>
      </Helmet>
      <main className="w-[80%] max-w-screen-2xl mx-auto mt-12">
        <button
          className="text-lg mb-4 font-inter hover:underline"
          onClick={() => navigate("/marketplace")}
        >
          <FontAwesomeIcon className="pr-2" icon={faArrowLeft} aria-label="Left-Arrow"/>
          Return to Marketplace
        </button>
        <div className="flex flex-wrap flex-col md:flex-row mb-6 gap-10">
          {/* Image Section */}
            <div className="bg-ucsd-blue max-w-full w-full h-[606px] flex-1 flex items-center justify-center md:h-auto">
              <div className="w-full max-w-lg aspect-square bg-ucsd-blue">
                <img
                  src={product.productImage}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

          {/* Info Section */}
          <div className="max-w-full h-[606px] flex-1 flex flex-col">
            <div className="pt-4">
              <h1 className="font-jetbrains text-black font-bold text-4xl pb-1">
                {product.productName}
              </h1>
            </div>

            <hr className="my-6 w-full mx-auto border-t-4 border-gray-200" />

            <div className="flex flex-col flex-grow">
              <h2 className="font-jetbrains text-black-gray font-bold text-2xl pb-6">
                USD ${product.productPrice.toFixed(2)}
              </h2>
              <div className="bg-[#F5F0E6] p-5 flex-grow overflow-y-auto max-h-[200px] md:max-h-[250px] lg:max-h-[300px]">
                <p className="font-inter text-black">
                    {product.productInfo}
                </p>
              </div>
              <div className="mt-auto">
                <p className="font-inter text-black text-lg">
                  Interested? Contact them here:
                </p>
                <p className="font-inter text-black text-lg font-bold">
                  {product.sellerEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
