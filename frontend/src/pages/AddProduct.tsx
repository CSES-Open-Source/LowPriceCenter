import { FormEvent, useRef, useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { post } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { tags } from "../utils/constants.tsx";

export function AddProduct() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productImages = useRef<HTMLInputElement>(null);
  const [productTags, setProductTags] = useState<Array<string>>([]);

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

  // handle dropdown display
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.hidden = true;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    e.preventDefault();
    try {
      if (productName.current && productPrice.current && productDescription.current && user) {
        let images;
        if (productImages.current && productImages.current.files) {
          images = productImages.current.files[0];
        }

        const body = new FormData();
        body.append("name", productName.current.value);
        body.append("price", productPrice.current.value);
        body.append("description", productDescription.current.value);
        productTags.forEach((tag) => {
          body.append("tags[]", tag);
        });
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

        {/* Product Tags */}
        <div className="mb-5">
          <label htmlFor="productTags" className="block mb-2 font-medium font-inter text-black">
            Tags
          </label>
          <div
            id="productTags"
            className="flex flex-row max-w-full flex-wrap gap-2 border border-gray-300 text-black text-sm rounded-md w-full p-2.5 min-h-10 hover:cursor-pointer"
            onClick={() => {
              if (dropdownRef.current) dropdownRef.current.hidden = false;
            }}
            ref={buttonRef}
          >
            {productTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 p-1 px-2 w-fit bg-slate-200 rounded-2xl"
              >
                <span className="text-sm font-medium">{tag}</span>
                <button
                  className="flex items-center justify-center p-1 h-5 w-5 bg-slate-300 text-md rounded-full hover:bg-blue-400 hover:text-white transition-colors duration-200"
                  onClick={() => {
                    setProductTags(productTags.filter((t) => t !== tag));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {/* Product Tags Dropdown */}
          {productTags.length !== tags.length && (
            <div
              ref={dropdownRef}
              className="z-10 mt-2 min-w-64 origin-top-right rounded-md ring-1 shadow-lg ring-black/5 focus:outline-hidden"
            >
              <div className="py-1 max-h-35 overflow-y-auto">
                {tags.map((tag) => {
                  if (!productTags.includes(tag)) {
                    return (
                      <p
                        onClick={() => {
                          setProductTags([...productTags, tag]);
                        }}
                        key={tag}
                        className="px-4 py-2 text-sm text-gray-700 hover:cursor-pointer"
                      >
                        {tag}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="mb-5">
          <label htmlFor="productImages" className="block mb-2 font-medium font-inter text-black">
            Images
          </label>

          {newPreviews.length > 0 && (
            <div className="text-center mb-2">
              <div className="inline-flex flex-wrap justify-center gap-2 ">
                {newPreviews.map((src, idx) => (
                  <div key={idx} className="relative m-1 w-24 h-24">
                    <img src={src} className="w-full h-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            name="images"
            id="productImages"
            type="file"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            ref={productImages}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
          />
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
