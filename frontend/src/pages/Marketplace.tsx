import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import Product from "src/components/Product";
import SearchBar from "src/components/SearchBar";
import PaginationBar from "src/components/Pagination";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { get, post } from "src/api/requests";

export function Marketplace() {
  const [products, setProducts] = useState<
    Array<{
      _id: string;
      name: string;
      price: number;
      images: string[];
    }>
  >([]);
  const [error, setError] = useState<string>("");
  const { user } = useContext(FirebaseContext);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);

  const fetchSavedProducts = async () => {
    if (!user?.uid) return;
    try {
      const res = await get(`/api/users/${user.uid}`);
      const userData = await res.json();
      setSavedProducts(userData.savedProducts || []);
    } catch (err) {
      console.error("Failed to fetch saved products:", err);
    }
  };

  const handleSaveToggle = async (productId: string, newSavedStatus: boolean) => {
    try {
      setSavedProducts((prev) =>
        newSavedStatus ? [...prev, productId] : prev.filter((id) => id !== productId),
      );
      await post(`/api/users/${user?.uid}/saved-products`, { productId });
      await fetchSavedProducts();
    } catch (err) {
      console.error("Save operation failed:", err);
      setSavedProducts((prev) =>
        newSavedStatus ? prev.filter((id) => id !== productId) : [...prev, productId],
      );
    }
  };

  useEffect(() => {
    fetchSavedProducts();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <main className="w-full flex flex-col justify-center items-center mt-12 mb-20">
        <div className="max-w-[80%] w-full">
          <div id="grid-header" className="flex justify-between flex-wrap mb-2 px-3">
            <p className="text-lg sm:text-3xl font-jetbrains font-medium">Marketplace</p>
            <button
              className="bg-[#00629B] text-white text-[0.6rem] font-inter font-semibold px-1 py-2 sm:text-base sm:px-4 shadow-lg hover:brightness-90 transition-all"
              onClick={() => (window.location.href = "/add-product")}
            >
              Add Product
            </button>
          </div>
          <SearchBar setProducts={setProducts} setError={setError} />
          {error && <p className="max-w-[80%] w-full px-3 pt-3 text-red-800">{error}</p>}
          {!error && products?.length === 0 && (
            <p className="max-w-[80%] font-inter text-lg w-full px-3 pt-3">No products available</p>
          )}
          <div
            id="grid"
            className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4"
          >
            {products.map((product) => (
              <div key={product._id} className="px-3 py-3">
                <Product
                  productId={product._id}
                  productName={product.name}
                  productPrice={product.price}
                  productImages={product.images ? product.images : []}
                  isSaved={savedProducts.includes(product._id)}
                  onSaveToggle={handleSaveToggle}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <PaginationBar />
        </div>
      </main>
    </>
  );
}
