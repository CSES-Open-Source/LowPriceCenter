import { FormEvent, useContext, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { post } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function AddProduct() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productYear = useRef<HTMLSelectElement>(null);
  const productCategory = useRef<HTMLSelectElement>(null);
  const productCondition = useRef<HTMLSelectElement>(null);
  const productImages = useRef<HTMLInputElement>(null);

  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 }, (_, i) => currentYear - i);


  const categories = [
  'Electronics',
  'School Supplies',
  'Dorm Essentials',
  'Furniture',
  'Clothes',
  'Miscellaneous'];

  const conditions = ["New", "Used"];

  const { user } = useContext(FirebaseContext);
  const [error, setError] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const validFiles: File[] = [];
    const previews: string[] = [];

    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length < files.length) {
      setFileError("Files larger than 5 MB were skipped.");
    } else {
      setFileError(null);
    }

    setNewFiles((prev) => [...prev, ...validFiles]);
    setNewPreviews((prev) => [...prev, ...previews]);

    if (productImages.current) productImages.current.value = "";
  };

  const removePreview = (idx: number) => {
    setNewFiles((f) => f.filter((_, i) => i !== idx));
    setNewPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    e.preventDefault();
    try {
      if (productName.current && productPrice.current && productDescription.current && productYear.current && productCategory.current && productCondition.current && user) {
        let images;
        if (productImages.current && productImages.current.files) {
          images = productImages.current.files[0];
        }

        const body = new FormData();
        body.append("name", productName.current.value);
        body.append("price", productPrice.current.value);
        body.append("description", productDescription.current.value);
        body.append("year", productYear.current.value);
        body.append("category", productCategory.current.value);
        body.append("condition", productCondition.current.value);
        if (user.email) body.append("userEmail", user.email);

        if (productImages.current && productImages.current.files) {
          Array.from(productImages.current.files).forEach((file) => {
            body.append("images", file);
          });
        }

        newFiles.forEach((file) => body.append("images", file));

        const res = await post("/api/products", body);
        if (res.ok) {
          setError(false);
          window.location.href = "/products";
        } else throw Error();
      } else throw Error();
    } catch {
      setError(true);
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
        {/* Images */}
        <div className="mb-5">
          <label htmlFor="productImages" className="block mb-2 font-medium font-inter text-black">
            Images
          </label>
          <p className="text-sm text-gray-600 mb-3">Upload up to 10 photos</p>

          {newPreviews.length > 0 && (
            <div className="text-center mb-4">
              <div className="inline-flex flex-wrap justify-center gap-2 ">
                {newPreviews.map((src, idx) => (
                  <div key={idx} className="relative m-1 w-24 h-24">
                    <img src={src} className="w-full h-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1"
                    >
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label
            htmlFor="productImages"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500">PNG or JPG (MAX. 5MB per image)</p>
            </div>
            <input
              name="images"
              id="productImages"
              type="file"
              multiple
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              ref={productImages}
              className="hidden"
            />
          </label>
        </div>
        {/* Name */}
        <div className="mb-5">
          <label htmlFor="productName" className="block mb-2 font-medium font-inter text-black">
            Name
          </label>
          <input
            id="productName"
            type="text"
            ref={productName}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            placeholder="Product Name"
            required
          />
        </div>

        {/* Price */}
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
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            placeholder="$0.00"
            required
          />
        </div>

        {/* Description */}
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
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            placeholder="Tell us more about this product..."
          />
        </div>

        {/* Year */}
        <div className="mb-5">
          <label htmlFor="productYear" className="block mb-2 font-medium font-inter text-black">
            Year
          </label>
          <select
            id="productYear"
            ref={productYear}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            required
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-5">
          <label htmlFor="productCategory" className="block mb-2 font-medium font-inter text-black">
            Category
          </label>
          <select
            id="productCategory"
            ref={productCategory}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="mb-5">
          <label htmlFor="productCondition" className="block mb-2 font-medium font-inter text-black">
            Condition
          </label>
          <select
            id="productCondition"
            ref={productCondition}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            required
          >
            <option value="">Select Condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>


        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(`/products`)}
            className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
          >
            Submit
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-800 text-center mb-4">Error adding product. Try again.</p>
        )}

        {fileError && <p className="text-sm text-red-800 text-center mb-4">{fileError}</p>}
      </form>
    </>
  );
}
