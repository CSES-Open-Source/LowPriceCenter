import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { get } from "src/api/requests";
import Product from "src/components/Product";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function MyListings() {
  const [products, setProducts] = useState<
    Array<{
      _id: string;
      name: string;
      price: number;
      year: number;
      category: string;
      condition: string;
      images: string[];
    }>
  >([]);
  const [error, setError] = useState<string>("");
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    if (!user?.uid) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const userResponse = await get(`/api/users/${user.uid}`);
      const userData = await userResponse.json();
      const productIds: string[] = userData.productList || [];
      const productPromises = productIds.map((id) =>
        get(`/api/products/${id}`).then((res) => res.json()),
      );
      const results = await Promise.allSettled(productPromises);
      const myProducts = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<any>).value);
      setProducts(myProducts);
    } catch (err) {
      setError("Failed to load your listings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>My Listings - Low-Price Center</title>
      </Helmet>
      <main className="w-full flex justify-center items-center mt-24 mb-20">
        <div className="max-w-[80%] w-full">
          <div id="grid-header" className="flex justify-between items-center flex-wrap mb-4 px-3">
            <h1 className="font-jetbrains font-bold text-2xl text-[#182B49]">My Listings</h1>
            <button
              onClick={() => navigate("/add-product")}
              className="font-inter text-sm font-semibold px-6 py-2.5 rounded-lg bg-ucsd-blue text-white hover:brightness-90 transition-all"
            >
              + New Listing
            </button>
          </div>

          {loading && (
            <p className="px-3 pt-3 text-gray-600 font-inter">Loading your listings...</p>
          )}

          {error && <p className="px-3 pt-3 text-red-600 font-inter">{error}</p>}

          {!error && !loading && products.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <p className="font-inter text-gray-600 mb-4">
                You haven't listed any products yet.
              </p>
              <button
                onClick={() => navigate("/add-product")}
                className="font-inter text-sm font-semibold px-6 py-2.5 rounded-lg bg-ucsd-blue text-white hover:brightness-90 transition-all"
              >
                Create Your First Listing
              </button>
            </div>
          )}

          <div
            id="grid"
            className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4"
          >
            {products.map((product) => (
              <div key={product._id} className="px-3 py-3">
                <Link to={`/products/${product._id}`}>
                  <Product
                    productId={product._id}
                    productName={product.name}
                    productPrice={product.price}
                    productYear={product.year}
                    productCategory={product.category}
                    productCondition={product.condition}
                    productImages={
                      product.images && product.images.length > 0
                        ? product.images
                        : ["/productImages/product-placeholder.webp"]
                    }
                    productLocation={""}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
