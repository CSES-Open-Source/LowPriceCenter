import { Helmet } from "react-helmet-async";
import { Navbar } from "src/components";
import Product from "src/components/Product";

const placeholderData: [string, number, string][] = [
  ["24oz Water Bottle", 15.0, "productImages/water-bottle.png"],
  ["Shower Caddy", 16.0, "productImages/shower-caddy.jpeg"],
  ["Mattress", 169.75, "productImages/mattress.png"],
  ["Vintage Lamp", 30.0, "productImages/vintage-lamp.jpeg"],
  ["Vintage Lamp", 30.0, "productImages/vintage-lamp.jpeg"],
  ["Mattress", 169.75, "productImages/mattress.png"],
  ["24oz Water Bottle", 15.0, "productImages/water-bottle.png"],
  ["Shower Caddy", 16.0, "productImages/shower-caddy.jpeg"],
  ["24oz Water Bottle", 15.0, "productImages/water-bottle.png"],
  ["Shower Caddy", 16.0, "productImages/shower-caddy.jpeg"],
];

export function Marketplace() {
  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <Navbar />
      <main className="w-screen flex justify-center items-center mt-12 mb-20">
        <div className="max-w-[80%]">
          <div className="flex justify-between mb-4">
            <p className="text-3xl font-mono font-medium">Marketplace</p>
            <button className="bg-[#00629B] text-white font-semibold py-2 px-4 shadow-lg">
              Add Product
            </button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {placeholderData.map((product, index) => (
              <div key={index}>
                <Product
                  productName={product[0]}
                  productPrice={product[1]}
                  productImage={product[2]}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
