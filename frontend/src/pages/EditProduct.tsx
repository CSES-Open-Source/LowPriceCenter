import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { DELETE, get, patch } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function EditProduct() {
  const { id } = useParams();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

  const [product, setProduct] = useState<{
    name: string;
    price: number;
    images: string[];
    userEmail: string;
    description: string;
    year: number;
    category: string;
    condition: string;
  }>();

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

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [error, setError] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  useEffect(() => {
    get(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setExistingImages(data.images);
      })
      .catch(() => setError(true));
  }, [id]);

  const removeExisting = (url: string) => {
    setExistingImages((imgs) => imgs.filter((u) => u !== url));
  };

  const removeNew = (idx: number) => {
    setNewFiles((files) => files.filter((_, i) => i !== idx));
    setNewPreviews((previews) => previews.filter((_, i) => i !== idx));
  };

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
      setFileError("Files larger than 5MB are not allowed.");
    } else {
      setFileError(null);
    }

    setNewFiles(validFiles);
    setNewPreviews(previews);

    if (productImages.current) productImages.current.value = "";
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (
        productName.current &&
        productPrice.current &&
        productDescription.current &&
        productYear.current &&
        productCategory.current &&
        productCondition.current &&
        user
      ) {
        const body = new FormData();
        body.append("name", productName.current.value);
        body.append("price", productPrice.current.value);
        body.append("description", productDescription.current.value);
        body.append("year", productYear.current.value);
        body.append("category", productCategory.current.value);
        body.append("condition", productCondition.current.value);
        body.append("userEmail", user.email || "");

        // append existing image URLs
        existingImages.forEach((url) => body.append("existingImages", url));
        // append new File objects
        newFiles.forEach((file) => body.append("images", file));

        const res = await patch(`/api/products/${id}`, body);

        if (res.ok) {
          setError(false);
          navigate(`/products/${id}`);
        } else throw Error();
      } else throw Error();
    } catch (err) {
      setError(true);
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await DELETE(`/api/products/${id}`);
      if (res.ok) {
        setError(false);
        window.location.href = "/products";
      } else throw Error();
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <div className="w-full mt-12 mb-8">
        <p className="text-3xl text-center font-jetbrains font-medium">Edit Product</p>
      </div>
      <form className="max-w-6xl mx-auto px-4 pb-10" onSubmit={handleEdit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Images */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <label htmlFor="productImages" className="block mb-2 font-medium font-inter text-black">
                Images
              </label>
              <p className="text-sm text-gray-600 mb-4">Upload up to 10 photos</p>

              {(newPreviews.length > 0 || existingImages.length > 0) && (
                <div className="mb-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                    {existingImages.map((url) => (
                      <div key={url} className="relative w-full aspect-square">
                        <img src={url} className="w-full h-full object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeExisting(url)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {newPreviews.map((src, idx) => (
                      <div key={src} className="relative w-full aspect-square">
                        <img src={src} className="w-full h-full object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeNew(idx)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label
                htmlFor="productImages"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
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
              {fileError && <p className="text-sm text-red-800 mt-3">{fileError}</p>}
            </div>

            {/* Description */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <label
                htmlFor="productDescription"
                className="block mb-2 font-medium font-inter text-black"
              >
                Description
              </label>
              <textarea
                id="productDescription"
                rows={12}
                defaultValue={product?.description}
                ref={productDescription}
                className="border border-gray-300 text-black text-sm rounded-md w-full p-3"
                placeholder="Tell us more about this product..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="productName" className="block mb-2 font-medium font-inter text-black">
                    Name
                  </label>
                  <input
                    id="productName"
                    type="text"
                    defaultValue={product?.name}
                    ref={productName}
                    className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                    placeholder="Product Name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productPrice" className="block mb-2 font-medium font-inter text-black">
                    Price
                  </label>
                  <input
                    id="productPrice"
                    type="number"
                    min={0}
                    max={1000000000}
                    step={0.01}
                    defaultValue={product?.price}
                    ref={productPrice}
                    className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                    placeholder="$0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productYear" className="block mb-2 font-medium font-inter text-black">
                    Year
                  </label>
                  <select
                    id="productYear"
                    ref={productYear}
                    key={`year-${product?.year}`}
                    defaultValue={product?.year || ""}
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

                <div>
                  <label htmlFor="productCategory" className="block mb-2 font-medium font-inter text-black">
                    Category
                  </label>
                  <select
                    id="productCategory"
                    ref={productCategory}
                    key={`category-${product?.category}`}
                    defaultValue={product?.category || ""}
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

                <div>
                  <label htmlFor="productCondition" className="block mb-2 font-medium font-inter text-black">
                    Condition
                  </label>
                  <select
                    id="productCondition"
                    ref={productCondition}
                    key={`condition-${product?.condition}`}
                    defaultValue={product?.condition || ""}
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
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/products/${id}`)}
                  className="bg-white text-[#00629B] border border-[#00629B] font-semibold font-inter py-2 px-5 shadow-sm hover:bg-[#00629B] hover:text-white transition-all"
                >
                  Cancel
                </button>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-[#DC3545] text-white font-semibold font-inter py-2 px-5 shadow-lg hover:brightness-90 transition-all"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00629B] text-white font-semibold font-inter py-2 px-6 shadow-lg hover:brightness-90 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-800 text-center mt-4">
                  Error editing product. Try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
