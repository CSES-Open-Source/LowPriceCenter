import { FormEvent, useRef, useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { post } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { CiCircleCheck } from "react-icons/ci";

export function AddProduct() {
  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productImages = useRef<HTMLInputElement>(null);
  const [productAdded, setProductAdded] = useState<boolean>(false);
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
          setProductAdded(true);
          setError(false);
          console.log(res);
        } else throw Error();
      } else throw Error();
    } catch (err) {
      setProductAdded(false);
      setError(true); //displays an error message to the user
    }
  };

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <div className="w-full mt-12 mb-6">
        <p className="text-3xl text-center font-mono font-medium">Add Product</p>
      </div>
      <form className="max-w-sm mx-auto p-4" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-5">
          <label htmlFor="productName" className="block mb-2 font-medium text-black">
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
          <label htmlFor="productPrice" className="block mb-2 font-medium text-black">
            Price
          </label>
          <input
            id="productPrice"
            type="number"
            min={0}
            step={0.01}
            ref={productPrice}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="$0.00"
            required
          />
        </div>
        {/* Product Description */}
        <div className="mb-5">
          <label htmlFor="productDescription" className="block mb-2 font-medium text-black">
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
          <label htmlFor="productImages" className="block mb-2 font-medium text-black">
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
            className="bg-[#00629B] text-white font-semibold py-2 px-4 shadow-lg"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Product added confirmation */}
      <dialog open={productAdded}>
        <div className="backdrop-blur-[2px] flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center mt-20 w-full md:inset-0 h-[calc(100%-1rem)]">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-blue-50 rounded-lg shadow-2xl">
              <div className="flex flex-col items-center gap-3 p-4 md:p-5 border-b">
                <CiCircleCheck className="text-green-600 w-10 h-10" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Your product is now on the marketplace!
                </h3>
                <div className="flex flex-row gap-10 mt-8">
                  <button
                    className="text-[#00629B] font-semibold py-2 px-4 hover:text-blue-900"
                    onClick={() => {
                      setProductAdded(false);
                      window.location.href = "/add-product";
                    }}
                  >
                    Add Another Product
                  </button>
                  <button
                    className="text-[#00629B] font-semibold py-2 px-4  hover:text-blue-900"
                    onClick={() => {
                      setProductAdded(false);
                      window.location.href = "/marketplace";
                    }}
                  >
                    View Marketplace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
