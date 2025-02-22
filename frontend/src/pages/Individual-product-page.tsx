import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "src/api/requests";

export function IndividualProductPage() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    image: string;
    userEmail: string;
    description: string;
  }>();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await get(`/api/products/${id}`);
      setProduct(await res.json());
    };
    fetchProduct();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${product?.name} - Low-Price Center`}</title>
      </Helmet>
      <main className="w-[80%] max-w-screen-2xl mx-auto m-12">
        <button
          className="text-lg mb-4 font-inter hover:underline"
          onClick={() => navigate("/products")}
        >
          &larr; Return to Marketplace
        </button>
        <div className="flex flex-wrap flex-col md:flex-row mb-6 gap-12">
          {/* Image Section */}
          <section className="w-full flex-1 flex justify-center md:h-auto">
            <div className="w-auto h-auto relative border-8 border-ucsd-blue">
              <img
                src={product?.image ? product?.image : "/productImages/product-placeholder.webp"}
                alt="Product"
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          </section>
          
          {/* Info Section */}
          <section className="max-w-[100%] md:max-w-[50%] flex-1 flex flex-col">
            <h1 className="pt-2 font-jetbrains text-black font-bold text-4xl break-words">
              {product?.name}
            </h1>

            <hr className="my-6 w-full mx-auto h-0 border-[1px] border-solid border-gray-300" />

            <h2 className="font-inter text-[#35393C] text-base md:text-xl font-normal pb-6">
              USD ${product?.price.toFixed(2)}
            </h2>
            {product?.description && (
              <div className="bg-[#F5F0E6] p-5 mb-6">
                <p className="font-inter text-black text-base md:text-xl font-normal break-words">
                  {product.description}
                </p>
              </div>
            )}
            <div className="mt-0">
              <p className="font-inter text-black text-base md:text-xl font-light">
                Interested? Contact them here:
              </p>
              <p className="font-inter text-black text-base md:text-xl font-medium break-words">
                <a href={`mailto:${product?.userEmail}`}>{product?.userEmail}</a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
