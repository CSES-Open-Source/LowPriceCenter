import { Key, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { get } from "src/api/requests";
import Product from "src/components/Product";

export function Marketplace() {
  const [products, setProducts] = useState<[]>();
  const [error, setError] = useState<boolean>(false);

  // Handles getting list of products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get("/api/products/");
        const productData = await response.json();
        setProducts(productData);
        setError(false);
      } catch (err) {
        setError(true);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

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
              className="bg-[#00629B] text-white text-[0.6rem] font-inter font-semibold px-1 py-2 sm:text-base sm:px-4 shadow-lg"
              onClick={() => (window.location.href = "/add-product")}
            >
              Add Product
            </button>
          </div>
          {/* Error message if products cannot be displayed */}
          {error && (
            <p className="max-w-[80%] w-full px-3 text-red-800">
              Unable to display products. Try again later.
            </p>
          )}
          {/* Grid of products */}
          <div
            id="grid"
            className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4"
          >
            {products &&
              products.map(
                (
                  product: { name: string; price: number; image: string },
                  index: Key | null | undefined,
                ) => (
                  <div key={index} className="px-3 py-3">
                    <Product
                      productName={product.name}
                      productPrice={product.price}
                      productImage={
                        product.image ? product.image : "/productImages/product-placeholder.webp"
                      }
                    />
                  </div>
                ),
              )}
          </div>
        </div>
      </main>
    </>
  );
}
