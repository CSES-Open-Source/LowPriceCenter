import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Product from "src/components/Product";
import { get, post } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function SavedProducts() {
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchSavedProducts = async () => {
    if (!user?.uid) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const userResponse = await get(`/api/users/${user.uid}`);
      const userData = await userResponse.json();
      const savedProductIds = userData.savedProducts || [];
      const productPromises = savedProductIds.map((id: string) =>
        get(`/api/products/${id}`).then((res) => res.json()),
      );
      const savedProducts = await Promise.all(productPromises);
      setProducts(savedProducts);
    } catch (err) {
      setError("Failed to load saved products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProducts();
  }, [user]);

  const handleProductUnsave = async (productId: string) => {
    try {
      await post(`/api/users/${user?.uid}/saved-products`, { productId });
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (err) {
      console.error("Failed to unsave product:", err);
      fetchSavedProducts();
    }
  };

  return (
    <>
      <Helmet>
        <title>Saved Products - Low-Price Center</title>
      </Helmet>
      <main className="w-full flex justify-center items-center mt-12 mb-20">
        <div className="max-w-[80%] w-full">
          <div id="grid-header" className="flex justify-between flex-wrap mb-2 px-3">
            <p className="text-lg sm:text-3xl font-jetbrains font-medium">Saved Products</p>
          </div>

          {loading && (
            <p className="max-w-[80%] w-full px-3 pt-3 text-gray-600">
              Loading your saved items...
            </p>
          )}

          {error && <p className="max-w-[80%] w-full px-3 pt-3 text-red-800">{error}</p>}

          {!error && !loading && products.length === 0 && (
            <p className="max-w-[80%] font-inter text-lg w-full px-3 pt-3">
              You haven't saved any products yet.
            </p>
          )}

          <div
            id="grid"
            className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4"
          >
            {products.map((product) => (
              <div key={product._id} className="px-3 py-3">
                <Link to={`/products/${product._id}`} state={{ from: "saved" as const }}>
                  <Product
                    productId={product._id}
                    productName={product.name}
                    productPrice={product.price}
                    productImages={
                      product.images && product.images.length > 0
                        ? product.images
                        : ["/productImages/product-placeholder.webp"]
                    }
                    isSaved={true}
                    onSaveToggle={(productId, newSavedStatus) => {
                      if (!newSavedStatus) {
                        handleProductUnsave(productId);
                      }
                    }}
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
