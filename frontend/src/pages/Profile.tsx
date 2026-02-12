import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "/src/utils/FirebaseProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faEnvelope,
  faCalendarAlt,
  faPen,
  faUpload,
  faCropSimple,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { updateProfile } from "firebase/auth";
import { post, get } from "/src/api/requests";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  userEmail: string;
  timeCreated: string;
  timeUpdated: string;
}

export function Profile() {
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  // -----------------------
  // Avatar
  // -----------------------
  const [imgFailed, setImgFailed] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // -----------------------
  // Cover
  // -----------------------
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [isSavingCover, setIsSavingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  // -----------------------
  // Bio (frontend-only for now)
  // -----------------------
  const [bio, setBio] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");

  // -----------------------
  // Products
  // -----------------------
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // -----------------------
  // Sync displayed avatar URL
  // -----------------------
  useEffect(() => {
    if (!user) return;

    const url =
      user.photoURL ||
      user.providerData?.find((p) => p?.photoURL)?.photoURL ||
      null;

    setPhotoUrl(url);
  }, [user]);

  // -----------------------
  // Cleanup blob previews
  // -----------------------
  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  // -----------------------
  // Fetch user's products
  // -----------------------
  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user?.email) return;

      try {
        setLoadingProducts(true);
        const response = await get("/api/products");
        const allProducts: Product[] = await response.json();

        const userProducts = allProducts.filter((p) => p.userEmail === user.email);
        setMyProducts(userProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    void fetchMyProducts();
  }, [user?.email]);

  // -----------------------
  // Auth guard
  // -----------------------
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-inter">Please sign in to view your profile.</p>
      </div>
    );
  }

  // -----------------------
  // Avatar handlers
  // -----------------------
  const openFilePicker = () => fileInputRef.current?.click();

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setAvatarError(null);

    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(URL.createObjectURL(file));
  };

  const closeAvatarModal = () => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);

    setLocalPreviewUrl(null);
    setSelectedFile(null);
    setAvatarError(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsAvatarModalOpen(false);
  };

  const handleSaveAvatar = async () => {
    if (!user || !selectedFile) return;

    try {
      setIsSavingAvatar(true);
      setAvatarError(null);

      const formData = new FormData();
      formData.append("userId", user.uid);
      if (user.email) formData.append("userEmail", user.email);
      formData.append("avatar", selectedFile);

      const response = await post("/api/users/avatar", formData);

      if (!response.ok) {
        let msg = "Failed to upload avatar";
        try {
          const errJson = await response.json();
          msg = errJson?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data = await response.json();
      const avatarUrl: string | undefined = data?.avatarUrl;
      if (!avatarUrl) throw new Error("Upload succeeded but no avatarUrl returned");

      // update UI immediately (cache-buster)
      setPhotoUrl(`${avatarUrl}?t=${Date.now()}`);
      setImgFailed(false);

      // optional: persist to firebase auth profile
      await updateProfile(user, { photoURL: avatarUrl });
      await user.reload();

      closeAvatarModal();
    } catch (err) {
      console.error("Avatar upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload avatar";
      setAvatarError(msg);
    } finally {
      setIsSavingAvatar(false);
    }
  };

  // -----------------------
  // Cover handlers
  // -----------------------
  const openCoverPicker = () => coverInputRef.current?.click();

  const onCoverSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 5MB.");
      return;
    }

    setCoverFile(file);
    setCoverError(null);

    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const closeCoverModal = () => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);

    setCoverPreviewUrl(null);
    setCoverFile(null);
    setCoverError(null);

    if (coverInputRef.current) coverInputRef.current.value = "";
    setIsCoverModalOpen(false);
  };

  // NOTE: requires backend route POST /api/users/cover that returns { coverUrl }
  const handleSaveCover = async () => {
    if (!user || !coverFile) return;

    try {
      setIsSavingCover(true);
      setCoverError(null);

      const formData = new FormData();
      formData.append("userId", user.uid);
      formData.append("cover", coverFile);


      const res = await post("/api/users/cover", formData);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to upload cover");

      const newCoverUrl = data.coverUrl as string;
      if (!newCoverUrl) throw new Error("Upload succeeded but no coverUrl returned");

      setCoverUrl(`${newCoverUrl}?t=${Date.now()}`);
      closeCoverModal();
    } catch (e) {
      setCoverError(e instanceof Error ? e.message : "Failed to upload cover");
    } finally {
      setIsSavingCover(false);
    }
  };

  // -----------------------
  // Bio handlers (frontend-only)
  // -----------------------
  const startEditBio = () => {
    setBioDraft(bio);
    setIsEditingBio(true);
  };

  const cancelEditBio = () => {
    setBioDraft(bio);
    setIsEditingBio(false);
  };

  const saveBio = async () => {
    // TODO: persist to backend later
    setBio(bioDraft.trim());
    setIsEditingBio(false);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg">
        {/* ==========================
            Header / Cover
           ========================== */}
        <div className="relative h-56 bg-ucsd-blue overflow-hidden">
          {coverUrl && (
            <img
              src={coverUrl}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute top-4 right-4">
            <button
              type="button"
              onClick={() => setIsCoverModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-white/90 hover:bg-white text-sm font-medium shadow"
            >
              Edit header photo
            </button>
          </div>
        </div>

        <div className="relative px-6 pb-6">
          {/* ==========================
              Centered Avatar
             ========================== */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden group bg-white"
                aria-label="Edit profile picture"
              >
                {photoUrl && !imgFailed ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserCircle} className="w-20 h-20 text-gray-300" />
                  </div>
                )}

                <span className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition" />
              </button>

              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                aria-label="Edit icon"
              >
                <FontAwesomeIcon icon={faPen} className="text-gray-700" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileSelected}
              />
            </div>
          </div>

          {/* Hidden cover input */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onCoverSelected}
          />

          {/* ==========================
              User Info + Bio (centered)
             ========================== */}
          <div className="pt-16 text-center">
            <h1 className="text-3xl font-bold text-gray-800">{user.displayName || "User Name"}</h1>

            <div className="mt-4 space-y-3 flex flex-col items-center">
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 mr-3" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-5 mr-3" />
                <span>
                  Member since{" "}
                  {new Date(user.metadata.creationTime ?? "").toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="flex items-start justify-between gap-4 text-left">
                <div className="flex-1">
                  {isEditingBio ? (
                    <>
                      <textarea
                        value={bioDraft}
                        onChange={(e) => setBioDraft(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm"
                        placeholder="Write a short bio..."
                      />
                      <div className="mt-2 flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={cancelEditBio}
                          className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveBio}
                          className="px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className={`text-sm ${bio ? "text-gray-700" : "text-gray-400"}`}>
                      {bio || "Add a short bio so people know what you sell or what you're looking for."}
                    </p>
                  )}
                </div>

                {!isEditingBio && (
                  <button
                    type="button"
                    onClick={startEditBio}
                    className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm whitespace-nowrap"
                  >
                    Edit bio
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ==========================
              Avatar Modal
             ========================== */}
          {isAvatarModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeAvatarModal();
              }}
            >
              <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h2 className="font-semibold text-gray-800">Edit profile photo</h2>
                  <button
                    type="button"
                    onClick={closeAvatarModal}
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    aria-label="Close"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                <div className="p-6 flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center">
                    {localPreviewUrl ? (
                      <img src={localPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Current profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setImgFailed(true)}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUserCircle} className="text-gray-300 w-20 h-20" />
                    )}
                  </div>

                  {avatarError && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">{avatarError}</p>
                    </div>
                  )}

                  <div className="flex flex-col w-full gap-3">
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={openFilePicker}
                        disabled={isSavingAvatar}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faUpload} />
                        <span>Update photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert("Next step: open crop editor")}
                        disabled={isSavingAvatar || !localPreviewUrl}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faCropSimple} />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={closeAvatarModal}
                        disabled={isSavingAvatar}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={!selectedFile || isSavingAvatar}
                        onClick={handleSaveAvatar}
                        className={`px-4 py-2 rounded-lg text-white ${
                          selectedFile && !isSavingAvatar
                            ? "bg-slate-800 hover:bg-slate-900"
                            : "bg-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {isSavingAvatar ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================
              Cover Modal
             ========================== */}
          {isCoverModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeCoverModal();
              }}
            >
              <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h2 className="font-semibold text-gray-800">Edit header photo</h2>
                  <button
                    type="button"
                    onClick={closeCoverModal}
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    aria-label="Close"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="w-full h-40 rounded-lg border bg-gray-50 overflow-hidden flex items-center justify-center">
                    {coverPreviewUrl ? (
                      <img src={coverPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : coverUrl ? (
                      <img src={coverUrl} alt="Current cover" className="w-full h-full object-cover" />
                    ) : (
                      <p className="text-sm text-gray-500">No header photo yet</p>
                    )}
                  </div>

                  {coverError && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">{coverError}</p>
                    </div>
                  )}

                  <div className="flex justify-between gap-2">
                    <button
                      type="button"
                      onClick={openCoverPicker}
                      disabled={isSavingCover}
                      className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Choose photo
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={closeCoverModal}
                        disabled={isSavingCover}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!coverFile || isSavingCover}
                        onClick={handleSaveCover}
                        className={`px-4 py-2 rounded-lg text-white ${
                          coverFile && !isSavingCover ? "bg-slate-800 hover:bg-slate-900" : "bg-slate-400"
                        }`}
                      >
                        {isSavingCover ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <hr className="my-8 border-gray-200" />

          {/* ==========================
              My Listings
             ========================== */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">My Listings</h3>
              <button
                onClick={() => navigate("/add-product")}
                className="px-4 py-2 bg-ucsd-blue text-white rounded-md hover:brightness-90 transition-all"
              >
                Add New Product
              </button>
            </div>

            {loadingProducts ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading your products...</p>
              </div>
            ) : myProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">You haven't listed any products yet.</p>
                <button
                  onClick={() => navigate("/add-product")}
                  className="px-6 py-2 bg-ucsd-blue text-white rounded-md hover:brightness-90 transition-all"
                >
                  List Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 truncate mb-1">{product.name}</h4>
                      <p className="text-ucsd-blue font-bold text-lg mb-2">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="my-8 border-gray-200" />
        </div>
      </div>
    </div>
  );
}
