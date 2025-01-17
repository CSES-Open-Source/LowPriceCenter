import { FormEvent, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "src/components";
import { post } from "src/api/requests";

export function AddProduct() {
  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productImages = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (productName.current && productPrice.current && productDescription.current) {
      post("/api/products", {
        name: productName.current.value,
        price: productPrice.current.value,
        description: productDescription.current.value,
        userEmail: "cseslowpricecenter@gmail.com", //need to get current user's email
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <Navbar />
      <div className="w-full mt-12 mb-6">
        <p className="text-3xl text-center font-mono font-medium">Add Product</p>
      </div>
      <form className="max-w-sm mx-auto p-4" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-5">
          <label htmlFor="productName" className="block mb-2 font-medium text-black">
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            ref={productName}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="Product Name"
            required
          />
        </div>
        {/* Product Price */}
        <div className="mb-5">
          <label htmlFor="productPrice" className="block mb-2 font-medium text-black">
            Product Price
          </label>
          <input
            id="productPrice"
            type="number"
            ref={productPrice}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="$0.00"
            required
          />
        </div>
        {/* Product Description */}
        <div className="mb-5">
          <label htmlFor="productDescription" className="block mb-2 font-medium text-black">
            Product Description
          </label>
          <textarea
            id="productDescription"
            rows={10}
            ref={productDescription}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="Tell us more about this product..."
            required
          />
        </div>
        {/* Product Images */}
        <div className="mb-5">
          <label htmlFor="productImages" className="block mb-2 font-medium text-black">
            Product Images
          </label>
          <input
            id="productImages"
            type="file"
            accept="image/png, image/jpeg"
            multiple
            ref={productImages}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#00629B] text-white font-semibold py-2 px-4 shadow-lg"
          >
            Submit
          </button>
        </div>
        {/* {productImages.current && productImages.current.files && (
          <div>
            <p>image preview</p>
            <img
              src={URL.createObjectURL(productImages.current.files[0])}
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )} */}
      </form>
    </>
  );
}
