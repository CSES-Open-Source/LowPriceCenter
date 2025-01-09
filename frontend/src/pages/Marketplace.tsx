import { Helmet } from "react-helmet-async";
import { Navbar } from "src/components";
import Product from "src/components/Product";

export function Marketplace() {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
            {arr.map((item) => (
              <div key={item}>
                <Product />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
