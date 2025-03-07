import { FormEvent, useRef, useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { post } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function AddProduct() {
  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productImages = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const { user } = useContext(FirebaseContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (productName.current && productPrice.current && productDescription.current && user) {
        let image;
        if (productImages.current && productImages.current.files) {
          image = productImages.current.files[0];
        }

        const body = new FormData();
        body.append("name", productName.current.value);
        body.append("price", productPrice.current.value);
        body.append("description", productDescription.current.value);
        if (user.email) body.append("userEmail", user.email);
        if (image) body.append("image", image);

        const res = await post("/api/products", body);

        if (res.ok) {
          setError(false);
          window.location.href = "/products";
        } else throw Error();
      } else throw Error();
    } catch (err) {
      setError(true); //displays an error message to the user
    }
  };

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <div className="w-full mt-12 mb-6">
        <p className="text-3xl text-center font-jetbrains font-medium">Add Product</p>
      </div>
      <form className="max-w-sm mx-auto p-4" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-5">
          <label htmlFor="productName" className="block mb-2 font-medium font-inter text-black">
            Name
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
          <label htmlFor="productPrice" className="block mb-2 font-medium font-inter text-black">
            Price
          </label>
          <input
            id="productPrice"
            type="number"
            min={0}
            max={1000000000}
            step={0.01}
            ref={productPrice}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="$0.00"
            required
          />
        </div>
        {/* Product Description */}
        <div className="mb-5">
          <label
            htmlFor="productDescription"
            className="block mb-2 font-medium font-inter text-black"
          >
            Description
          </label>
          <textarea
            id="productDescription"
            rows={10}
            ref={productDescription}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="Tell us more about this product..."
          />
        </div>
        {/* Product Image */}
        <div className="mb-5">
          <label htmlFor="productImages" className="block mb-2 font-medium font-inter text-black">
            Image
          </label>
          <input
            id="productImages"
            type="file"
            accept="image/png, image/jpeg"
            ref={productImages}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
          />
        </div>
        <div className="flex justify-end gap-3">
          {/* error message */}
          {error && <p className="text-sm text-red-800">Error adding product. Try again.</p>}
          <button
            type="submit"
            className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
