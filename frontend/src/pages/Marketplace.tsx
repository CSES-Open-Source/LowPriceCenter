import { Key, useState } from "react";
import { Helmet } from "react-helmet-async";
import Product from "src/components/Product";
import SearchBar from "src/components/SearchBar";

export function Marketplace() {
  const [products, setProducts] = useState<[]>();
  const [error, setError] = useState<string>("");

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
          <SearchBar setProducts={setProducts} setError={setError} />
          {/* Error message if products cannot be displayed */}
          {error && <p className="max-w-[80%] w-full px-3 pt-3 text-red-800">{error}</p>}
          {/* if no products are available */}
          {!error && products?.length === 0 && (
            <p className="max-w-[80%] font-inter text-lg w-full px-3 pt-3">No products available</p>
          )}
          {/* Grid of products */}
          <div
            id="grid"
            className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4"
          >
            {products &&
              products.map(
                (
                  product: { _id: string; name: string; price: number; images: string[] },
                  index: Key | null | undefined,
                ) => (
                  <div key={index} className="px-3 py-3">
                    <Product
                      productId={product._id}
                      productName={product.name}
                      productPrice={product.price}
                      productImages={
                        product.images && product.images.length > 0
                          ? product.images
                          : ["/productImages/product-placeholder.webp"]
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
