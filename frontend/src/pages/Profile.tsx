import { useState, useContext, useMemo, useRef, useEffect } from "react";
import { FirebaseContext } from "/src/utils/FirebaseProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEnvelope, faCalendarAlt, faPen, faUpload, faCropSimple, faXmark } from "@fortawesome/free-solid-svg-icons";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "/src/utils/Firebase";


export function Profile() {
  const { user } = useContext(FirebaseContext);
  const [imgFailed, setImgFailed] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // FIX 1: Correct dependency array for photo memoization
  const photo = useMemo(() => {
    if (!user) return null;
    return (
      user.photoURL ||
      user.providerData?.find((p) => p?.photoURL)?.photoURL ||
      null
    );
  }, [user]); // Changed from [user.uid] to include full user object

  // FIX 2: Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-inter">Please sign in to view your profile.</p>
      </div>
    );
  }

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setSelectedFile(file);
    
    // Clean up previous preview URL if it exists
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    
    const preview = URL.createObjectURL(file);
    setLocalPreviewUrl(preview);
  };

  const closeModal = () => {
    // Clean up when closing
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl(null);
    setSelectedFile(null);
    
    // FIX 4: Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    setIsAvatarModalOpen(false);
  };

  const handleSaveAvatar = async () => {
    if (!user || !selectedFile) return;
  
    try {
      setIsSaving(true);
  
      const ext = selectedFile.name.split(".").pop() || "jpg";
      const avatarRef = ref(storage, `profilePhotos/${user.uid}/avatar.${ext}`);
  
      await uploadBytes(avatarRef, selectedFile, { contentType: selectedFile.type });
  
      const downloadURL = await getDownloadURL(avatarRef);
  
      await updateProfile(user, { photoURL: downloadURL });
      await user.reload();
  
      setImgFailed(false);
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsAvatarModalOpen(false);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert(String((err as any)?.message ?? err));
    } finally {
      setIsSaving(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg">
        {/* Profile Header/Cover */}
        <div className="h-40 bg-ucsd-blue" />

        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="absolute -top-12 left-6">
            <div className="relative">
              {/* FIX 5: Single avatar rendering - clickable avatar */}
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden group bg-white"
                aria-label="Edit profile picture"
              >
                {/* Image or fallback */}
                {photo && !imgFailed ? (
                  <img
                    src={photo}
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

                {/* Hover overlay */}
                <span className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition" />
              </button>

              {/* Pencil icon */}
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                aria-label="Edit icon"
              >
                <FontAwesomeIcon icon={faPen} className="text-gray-700" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileSelected}
              />
            </div>
          </div>

          {/* Modal */}
          {isAvatarModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                // Close modal if clicking backdrop
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h2 className="font-semibold text-gray-800">Edit profile photo</h2>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    aria-label="Close"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                {/* Original / Preview */}
                <div className="p-6 flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center">
                    {localPreviewUrl ? (
                      <img
                        src={localPreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : photo ? (
                      <img
                        src={photo}
                        alt="Current profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUserCircle} className="text-gray-300 w-20 h-20" />
                    )}
                  </div>

                  <div className="flex flex-col w-full gap-3">
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={openFilePicker}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faUpload} />
                        <span>Update photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert("Next step: open crop editor")}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faCropSimple} />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={!selectedFile || isSaving}
                        onClick={handleSaveAvatar}
                        className={`px-4 py-2 rounded-lg text-white ${
                          selectedFile && !isSaving
                            ? "bg-slate-800 hover:bg-slate-900"
                            : "bg-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="pt-16">
            <h1 className="text-3xl font-bold text-gray-800">
              {user.displayName || "User Name"}
            </h1>
            <div className="mt-4 space-y-3">
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
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Placeholder for future features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-bold text-lg text-ucsd-blue">My Listings</h3>
              <p className="text-sm text-gray-500">Manage the items you are selling.</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-bold text-lg text-ucsd-blue">Saved Items</h3>
              <p className="text-sm text-gray-500">View items you've bookmarked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}