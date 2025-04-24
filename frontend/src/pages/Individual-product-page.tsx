import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function IndividualProductPage() {
  const navigate = useNavigate();
  const { user } = useContext(FirebaseContext);
  const { id } = useParams();
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    image: string;
    userEmail: string;
    description: string;
    tags: string[];
  }>();
  const [error, setError] = useState<string>();
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      await get(`/api/products/${id}`)
        .then(async (res) => setProduct(await res.json()))
        .catch(() => setError("Product not found"));
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const findEditPermission = async () => {
      const uid = user?.uid;
      if (uid)
        await get(`/api/users/${uid}`).then(async (res) => {
          const ownedByUser = await res.json().then((data) => {
            return data.productList.includes(id);
          });
          setHasPermissions(ownedByUser);
        });
    };
    findEditPermission();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${product?.name} - Low-Price Center`}</title>
      </Helmet>
      <main className="w-[80%] max-w-screen-2xl mx-auto m-12">
        <div className="flex justify-between">
          <button
            className="text-lg mb-4 font-inter hover:underline"
            onClick={() => navigate("/products")}
          >
            &larr; Return to Marketplace
          </button>

          {hasPermissions && (
            <button
              className="text-lg mb-4 font-inter hover:underline"
              onClick={() => navigate(`/edit-product/${id}`)}
            >
              Edit Product <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>
        {/* Error message if product not found */}
        {error && <p className="max-w-[80%] w-full px-3 text-red-800">{error}</p>}
        {/* Display product */}
        {!error && (
          <div className="flex flex-wrap flex-col md:flex-row mb-6 gap-12">
            {/* Image Section */}
            <section className="w-full flex-1 flex justify-center md:h-auto">
              <div className="max-h-[32rem] h-[32rem] max-w-[32rem] w-[32rem] relative border-8 border-ucsd-blue">
                <img
                  src={product?.image ? product?.image : "/productImages/product-placeholder.webp"}
                  alt="Product"
                  className="w-full h-full object-cover"
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
                USD ${product?.price?.toFixed(2)}
              </h2>
              {product?.description && (
                <div className="bg-[#F5F0E6] p-5 mb-6">
                  <p className="font-inter text-black text-base md:text-xl font-normal break-words">
                    {product.description}
                  </p>
                </div>
              )}
              {product?.tags && (
                <div className="flex flex-row flex-wrap gap-2 py-4">
                  {product.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 p-1 px-2 w-fit bg-slate-200 rounded-2xl"
                    >
                      <span className="text-sm font-medium">{tag}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-0">
                <p className="font-inter text-black text-base md:text-xl font-light">
                  Interested? Contact them here:
                </p>
                <p className="font-inter text-black hover:text-ucsd-darkblue text-base md:text-xl font-medium break-words transition-colors">
                  <a href={`mailto:${product?.userEmail}`}>{product?.userEmail}</a>
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
