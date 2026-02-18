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

      if (searchQuery && searchQuery.trim().length > 0) {
        const res = await get(
          `/api/products/search/${searchQuery}${queryString ? `?${queryString}` : ""}`
        );
        if (res.ok) {
          setProducts(await res.json());
        } else {
          setError("Unable to search products. Try again later.");
        }
        return;
      }

      const res = await get(`/api/products${queryString ? `?${queryString}` : ""}`);
      if (res.ok) {
        setProducts(await res.json());
      } else {
        setError("Unable to display products. Try again later.");
      }
    } catch (err) {
      setError("Unable to display products. Try again later.");
      console.error(err);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters, searchQuery]);
  useEffect(() => { fetchSavedProducts(); }, [user]);

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>

      <main className="w-full flex justify-center mt-12 mb-20">
        <div className="w-full max-w-[1300px] px-4">

          {/* Outer page header: Marketplace title + Add Product */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-3xl font-jetbrains font-medium text-ucsd-darkblue">
              Marketplace
            </p>
            <button
              className="bg-ucsd-blue text-white font-inter font-semibold px-5 py-2 rounded-xl shadow-md hover:brightness-90 transition"
              onClick={() => (window.location.href = "/add-product")}
            >
              Add Product
            </button>
          </div>

          {/* ── White card ── */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

            {/* ── TOP BANNER ROW ──
                Left:  "Low Price Center" heading blended into white
                Right: Search bar + sort controls stacked
            */}
            <div className="flex items-start justify-between px-8 pt-7 pb-4">

              {/* Low Price Center — "Low" in ucsd-blue, "Price Center" in ucsd-gold, blended white bg */}
              <div className="font-jetbrains font-bold leading-tight">
                <span className="text-4xl text-ucsd-blue">Low </span>
                <span className="text-4xl text-ucsd-gold">Price Center</span>
              </div>

              {/* Search bar + sort stacked on the right */}
              <div className="flex flex-col items-end gap-2 w-[420px] shrink-0">
                {/* Search bar */}
                <div className="w-full">
                  <SearchBar setProducts={setSearchQuery} setError={setError} />
                </div>

                {/* Sort row — right-aligned, underneath search */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-inter text-gray-500 whitespace-nowrap">Sort:</span>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-[6px] text-sm font-inter bg-white
                               focus:ring-2 focus:ring-ucsd-blue focus:border-ucsd-blue outline-none cursor-pointer"
                    value={filters.sortBy || "timeCreated"}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value as "price" | "timeCreated" })
                    }
                  >
                    <option value="timeCreated">Featured</option>
                    <option value="price">Price</option>
                  </select>

                  <select
                    className="border border-gray-200 rounded-lg px-3 py-[6px] text-sm font-inter bg-white
                               focus:ring-2 focus:ring-ucsd-blue focus:border-ucsd-blue outline-none cursor-pointer"
                    value={filters.order || "desc"}
                    onChange={(e) =>
                      setFilters({ ...filters, order: e.target.value as "asc" | "desc" })
                    }
                  >
                    <option value="desc">
                      {filters.sortBy === "price" ? "High to Low" : "Newest First"}
                    </option>
                    <option value="asc">
                      {filters.sortBy === "price" ? "Low to High" : "Oldest First"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Thin gold divider under the top banner */}
            <div className="mx-8 border-t border-gray-100" />

            {/* ── BOTTOM SECTION: Sidebar | Products ── */}
            <div className="flex">

              {/* LEFT SIDEBAR — fixed width, gold right border */}
              <div className="w-[220px] shrink-0 px-6 py-6">
                <FilterSort filters={filters} setFilters={setFilters} />
              </div>

              {/* RIGHT: Product grid */}
              <div className="flex-1 min-w-0 px-8 py-6">
                {error && (
                  <p className="text-red-500 text-sm font-inter mb-4">{error}</p>
                )}
                {!error && products?.length === 0 && (
                  <p className="font-inter text-gray-400">No products available</p>
                )}

                <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Product
                      key={product._id}
                      productId={product._id}
                      productName={product.name}
                      productPrice={product.price}
                      productImages={product.images || []}
                      isSaved={savedProducts.includes(product._id)}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </>
  );
}