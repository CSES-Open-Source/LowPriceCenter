import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import Product from "src/components/Product";
import SearchBar from "src/components/SearchBar";
import FilterSort from "src/components/FilterSort";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { get, post } from "src/api/requests";

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  condition?: "New" | "Used" | "";
  tags?: string[];
  sortBy?: "price" | "timeCreated";
  order?: "asc" | "desc";
}

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
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "timeCreated",
    order: "desc",
    tags: [],
  });

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

  const fetchProducts = async () => {
    try {
      setError("");

      // If there's a search query, use search endpoint
      if (searchQuery && searchQuery.trim().length > 0) {
        const res = await get(`/api/products/search/${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setError("Unable to search products. Try again later.");
        }
        return;
      }

      // Otherwise, use filter/sort endpoint
      const params = new URLSearchParams();

      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
      if (filters.condition) params.append("condition", filters.condition);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag) => params.append("tags", tag));
      }
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.order) params.append("order", filters.order);

      const queryString = params.toString();
      const res = await get(`/api/products${queryString ? `?${queryString}` : ""}`);
      
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setError("Unable to display products. Try again later.");
      }
    } catch (err) {
      setError("Unable to display products. Try again later.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchSavedProducts();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <main className="w-full flex justify-center items-center mt-12 mb-20">
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
          <SearchBar setProducts={setSearchQuery} setError={setError} />
          
          <FilterSort filters={filters} setFilters={setFilters} />

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
      </main>
    </>
  );
}
