import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { DELETE, get, patch } from "src/api/requests";
import PickupLocationField from "src/components/PickupLocationField";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { hasGoogleMapsApiKey } from "src/utils/googleMaps";
import type { PickupLocation } from "src/utils/pickupLocation";

export function EditProduct() {
  const { id } = useParams();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit
  const MAX_IMAGE_DIMENSION = 1600;
  const JPEG_QUALITY = 0.82;

  const [product, setProduct] = useState<{
    name: string;
    price: number;
    images: string[];
    userEmail: string;
    description: string;
    year: number;
    category: string;
    condition: string;
    pickupLocation?: PickupLocation;
  }>();
  const [pickupLocation, setPickupLocation] = useState<PickupLocation | null>(null);
  const [pickupLocationError, setPickupLocationError] = useState<string | null>(null);
  const [hasPendingPickupSelection, setHasPendingPickupSelection] = useState(false);

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
  const [isOptimizingImages, setIsOptimizingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  useEffect(() => {
    get(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setExistingImages(data.images);
        if (data.pickupLocation) setPickupLocation(data.pickupLocation);
      })
      .catch(() => setError(true));
  }, [id]);

  const removeExistingAt = (index: number) => {
    setExistingImages((imgs) => imgs.filter((_, i) => i !== index));
  };

  const removeNew = (idx: number) => {
    setNewPreviews((previews) => {
      const url = previews[idx];
      if (url) URL.revokeObjectURL(url);
      return previews.filter((_, i) => i !== idx);
    });
    setNewFiles((files) => files.filter((_, i) => i !== idx));
  };

  const compressImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return { file, previewUrl: URL.createObjectURL(file) };
    }

    if (file.size <= 900 * 1024) {
      return { file, previewUrl: URL.createObjectURL(file) };
    }

    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const targetW = Math.max(1, Math.round(bitmap.width * scale));
    const targetH = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return { file, previewUrl: URL.createObjectURL(file) };
    }

    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );

    if (!blob) {
      return { file, previewUrl: URL.createObjectURL(file) };
    }

    const optimized = new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });

    const finalFile = optimized.size < file.size ? optimized : file;
    return { file: finalFile, previewUrl: URL.createObjectURL(finalFile) };
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const currentCount = existingImages.length + newFiles.length;
    const remainingSlots = Math.max(0, 10 - currentCount);
    const incoming = files.slice(0, remainingSlots);

    const oversized = incoming.filter((f) => f.size > MAX_FILE_SIZE);
    const valid = incoming.filter((f) => f.size <= MAX_FILE_SIZE);

    if (oversized.length > 0) {
      setFileError("Files larger than 5MB are not allowed.");
    } else {
      setFileError(null);
    }

    setIsOptimizingImages(true);
    try {
      const results = await Promise.all(valid.map(compressImage));
      setNewFiles((prev) => [...prev, ...results.map((r) => r.file)]);
      setNewPreviews((prev) => [...prev, ...results.map((r) => r.previewUrl)]);
    } finally {
      setIsOptimizingImages(false);
    }

    if (productImages.current) productImages.current.value = "";
  };

  const handleEdit = async (e: FormEvent) => {
    if (isSubmitting || isOptimizingImages) return;
    setIsSubmitting(true);
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
        if (hasGoogleMapsApiKey && hasPendingPickupSelection) {
          setPickupLocationError("Select a Google suggestion or clear the pickup address field.");
          return;
        }

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

        if (pickupLocation) {
          body.append("pickupAddress", pickupLocation.address);
          body.append("pickupPlaceId", pickupLocation.placeId);
          body.append("pickupLat", pickupLocation.lat.toString());
          body.append("pickupLng", pickupLocation.lng.toString());
        }

        const res = await patch(`/api/products/${id}`, body);

        if (res.ok) {
          setError(false);
          navigate(`/products/${id}`);
        } else throw Error();
      } else throw Error();
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
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

  const inputClass = "border border-gray-200 text-black text-sm rounded-lg w-full p-2.5 focus:ring-2 focus:ring-ucsd-blue focus:border-ucsd-blue outline-none";
  const labelClass = "block mb-2 font-semibold font-inter text-[#182B49]";

  const allPreviews = [
    ...existingImages.map((url, i) => ({ src: url, kind: "existing" as const, idx: i })),
    ...newPreviews.map((url, i) => ({ src: url, kind: "new" as const, idx: i })),
  ];

  return (
    <>
      <Helmet>
        <title>Edit - Low Price Center</title>
      </Helmet>
      <main className="w-[80%] max-w-screen-2xl mx-auto mt-20 mb-6">
        <h1 className="font-jetbrains font-bold text-2xl text-[#182B49] mb-4">Edit Listing</h1>

        <form onSubmit={handleEdit}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">

              {/* Left — Images */}
              <section className="w-full md:w-[40%] p-6 bg-[#F8F8F8] border-r border-gray-100">
                <label className={labelClass}>Images</label>
                <p className="text-sm text-gray-500 mb-3">Up to 10 photos (max 5MB each)</p>

                {allPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {allPreviews.map((p) => (
                      <div key={`${p.kind}-${p.idx}`} className="relative w-24 h-24">
                        <img src={p.src} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => p.kind === "existing" ? removeExistingAt(p.idx) : removeNew(p.idx)}
                          aria-label="Remove image"
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label
                  htmlFor="productImages"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Upload product images</span>
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="mb-1 text-sm text-gray-500 font-semibold">Click to upload</p>
                  <p className="text-xs text-gray-400">PNG or JPG (MAX. 5MB per image)</p>
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
                {fileError && <p className="text-sm text-red-600 mt-2">{fileError}</p>}
                {isOptimizingImages && <p className="text-xs text-gray-500 mt-2">Optimizing photos…</p>}
              </section>

              {/* Right — Details */}
              <section className="w-full md:w-[60%] p-6">
                <div className="mb-5">
                  <label htmlFor="productName" className={labelClass}>Name</label>
                  <input id="productName" type="text" defaultValue={product?.name} ref={productName} className={inputClass} placeholder="Product Name" required />
                </div>

                <div className="mb-5">
                  <label htmlFor="productPrice" className={labelClass}>Price</label>
                  <input id="productPrice" type="number" min={0} step="any" defaultValue={product?.price} ref={productPrice} className={inputClass + " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"} placeholder="0.00" required />
                </div>

                <div className="mb-5">
                  <label htmlFor="productDescription" className={labelClass}>Description</label>
                  <textarea id="productDescription" rows={3} defaultValue={product?.description} ref={productDescription} className={inputClass} placeholder="Tell us more about this product..." />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div>
                    <label htmlFor="productYear" className={labelClass}>Year</label>
                    <select id="productYear" ref={productYear} key={`year-${product?.year}`} defaultValue={product?.year || ""} className={inputClass} required>
                      <option value="">Select</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="productCategory" className={labelClass}>Category</label>
                    <select id="productCategory" ref={productCategory} key={`category-${product?.category}`} defaultValue={product?.category || ""} className={inputClass} required>
                      <option value="">Select</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="productCondition" className={labelClass}>Condition</label>
                    <select id="productCondition" ref={productCondition} key={`condition-${product?.condition}`} defaultValue={product?.condition || ""} className={inputClass} required>
                      <option value="">Select</option>
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <PickupLocationField
                  value={pickupLocation}
                  error={pickupLocationError}
                  onChange={(nextValue) => {
                    setPickupLocation(nextValue);
                    setPickupLocationError(null);
                  }}
                  onSelectionStatusChange={(hasPendingSelection) => {
                    setHasPendingPickupSelection(hasPendingSelection);
                    if (!hasPendingSelection) {
                      setPickupLocationError(null);
                    }
                  }}
                />

                <div className="h-px w-full bg-gray-100 my-6" />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/products/${id}`)}
                    className="font-inter text-sm font-semibold px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="font-inter text-sm font-semibold px-6 py-2.5 rounded-lg bg-red-500 text-white hover:brightness-90 transition-all"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    disabled={isOptimizingImages || isSubmitting}
                    className="font-inter text-sm font-semibold px-6 py-2.5 rounded-lg bg-ucsd-blue text-white hover:brightness-90 transition-all disabled:opacity-50"
                  >
                    {isOptimizingImages ? "Preparing..." : isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center mt-4">Error editing product. Try again.</p>
                )}
              </section>

            </div>
          </div>
        </form>
      </main>
    </>
  );
}