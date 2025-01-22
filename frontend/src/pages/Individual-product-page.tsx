import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const placeholderData = [
  {
    productName: "Mattress",
    productPrice: 500,
    productImage: "productImages/mattress.png",
    sellerEmail: "ucsd@example.com",
    productInfo: "A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.A comfortable mattress with memory foam for a good night's sleep.",
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
      <main className="w-[80%] max-w-screen-2xl mx-auto m-12">
        <button
          className="text-lg mb-4 font-inter hover:underline"
          onClick={() => navigate("/marketplace")}
        >
          &larr; Return to Marketplace
        </button>
        <div className="flex flex-wrap flex-col md:flex-row mb-6 gap-10">
          {/* Image Section */}
          <section className="bg-ucsd-blue max-w-full w-full max-h-[606px] flex-1 flex items-center justify-center md:h-auto">
            <div className="w-full max-w-lg aspect-square bg-ucsd-blue">
              <img
                src={product.productImage}
                alt="Product"
                className="w-full h-full object-contain"
              />
            </div>
          </section>

          {/* Info Section */}
          <section className="max-w-full flex-1 flex flex-col">
            <h1 className="pt-2 font-jetbrains text-black font-bold text-4xl">
              {product.productName}
            </h1>

            <hr className="my-6 w-full mx-auto h-0 border-[1px] border-solid border-gray-300" />
            
            <h2 className="font-inter text-black-gray text-xl font-normal pb-6">
              USD ${product.productPrice.toFixed(2)}
            </h2>
            {product.productInfo && (
              <div className="bg-[#F5F0E6] p-5 mb-6">
                <p className="font-inter text-black text-xl font-normal">
                  {product.productInfo}
                </p>
              </div>
            )}
            <div className="mt-0">
              <p className="font-inter text-black text-xl font-light">
                Interested? Contact them here:
              </p>
              <p className="font-inter text-black text-xl font-medium">
                {product.sellerEmail}
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
