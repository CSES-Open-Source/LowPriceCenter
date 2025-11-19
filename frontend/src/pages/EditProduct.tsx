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
    isMarkedSold: boolean;
  }>();

  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productImages = useRef<HTMLInputElement>(null);

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
      if (productName.current && productPrice.current && productDescription.current && user) {
        const body = new FormData();
        body.append("name", productName.current.value);
        body.append("price", productPrice.current.value);
        body.append("description", productDescription.current.value);
        body.append("userEmail", user.email || "");
        body.append("isMarkedSold", String(product?.isMarkedSold));

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
      <div className="w-full mt-12 mb-6">
        <p className="text-3xl text-center font-jetbrains font-medium">Edit Product</p>
      </div>
      <form className="max-w-sm mx-auto p-4" onSubmit={handleEdit}>
        <div className="mb-5">
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
            defaultValue={product?.price}
            ref={productPrice}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            placeholder="$0.00"
            required
          />
        </div>

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
            defaultValue={product?.description}
            ref={productDescription}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
            placeholder="Tell us more about this product..."
          />
        </div>

        <div className="mb-5">
          <label htmlFor="productImages" className="block mb-2 font-medium font-inter text-black">
            Images
          </label>

          {(newPreviews.length > 0 || existingImages.length > 0) && (
            <div className="inline-flex flex-wrap justify-start gap-2">
              {existingImages.map((url) => (
                <div key={url} className="relative m-1 w-24 h-24">
                  <img src={url} className="w-full h-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeExisting(url)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              ))}

              {newPreviews.map((src, idx) => (
                <div key={src} className="relative m-1 w-24 h-24">
                  <img src={src} className="w-full h-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeNew(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
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
            onClick={() => navigate(`/products/${id}`)}
            className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-[#DC3545] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
            >
              Delete
            </button>
            <button
              type="submit"
              className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
            >
              Done
            </button>
          </div>
        </div>

        {fileError && <p className="m-2 mt-4 text-sm text-red-800 text-center">{fileError}</p>}

        {error && (
          <p className="m-2 mt-4 text-sm text-red-800 text-center">
            Error editing product. Try again.
          </p>
        )}
      </form>
    </>
  );
}
