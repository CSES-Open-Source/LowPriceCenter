import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { get, post, patch, DELETE } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StudentOrganization {
  _id: string;
  organizationName: string;
  profilePicture: string;
  bio: string;
  location: string;
  contactInfo: {
    email: string;
    instagram: string;
    website: string;
    other: string;
  };
  merchLocation: string;
  firebaseUid: string;
}

interface MerchItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  studentOrganizationId: string;
}


export function StudentOrgProfile() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

  const { user } = useContext(FirebaseContext);
  const [organization, setOrganization] = useState<StudentOrganization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizationNameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const otherContactRef = useRef<HTMLInputElement>(null);
  const merchLocationRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);

  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);

  // Merch management state
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [isAddingMerch, setIsAddingMerch] = useState(false);
  const [editingMerchId, setEditingMerchId] = useState<string | null>(null);
  const [merchError, setMerchError] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);

  const merchNameRef = useRef<HTMLInputElement>(null);
  const merchPriceRef = useRef<HTMLInputElement>(null);
  const merchDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const merchImageRef = useRef<HTMLInputElement>(null);
  const [merchImagePreview, setMerchImagePreview] = useState<string>("");
  const [newMerchImage, setNewMerchImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await get(`/api/student-organizations/firebase/${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          setOrganization(data);
          setProfilePicturePreview(data.profilePicture || "");
        } else if (res.status === 404) {
          // Organization doesn't exist yet, that's okay
          setOrganization(null);
        } else {
          setError("Failed to load organization profile");
        }
      } catch (err) {
        // Organization doesn't exist, that's okay
        setOrganization(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [user]);

  useEffect(() => {
    const fetchMerch = async () => {
      if (!organization) {
        setMerchItems([]);
        return;
      }

      try {
        const res = await get("/api/merch/my-organization");
        if (res.ok) {
          const data = await res.json();
          setMerchItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch merch items:", err);
      }
    };

    fetchMerch();
  }, [organization]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5 MB");
      return;
    }

    setFileError(null);
    setNewProfilePicture(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      if (!organizationNameRef.current?.value || !user?.uid) {
        setError("Organization name is required");
        setIsSubmitting(false);
        return;
      }

      const body = new FormData();
      body.append("organizationName", organizationNameRef.current.value);
      body.append("bio", bioRef.current?.value || "");
      body.append("location", locationRef.current?.value || "");

      const contactInfo = {
        email: emailRef.current?.value || "",
        instagram: instagramRef.current?.value || "",
        website: websiteRef.current?.value || "",
        other: otherContactRef.current?.value || "",
      };
      body.append("contactInfo", JSON.stringify(contactInfo));
      body.append("merchLocation", merchLocationRef.current?.value || "");

      if (newProfilePicture) {
        body.append("profilePicture", newProfilePicture);
      }

      const res = await post("/api/student-organizations", body);
      if (res.ok) {
        const data = await res.json();
        setOrganization(data);
        setIsEditing(false);
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to create organization profile");
      }
    } catch (err) {
      setError("Failed to create organization profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      if (!organizationNameRef.current?.value || !user?.uid) {
        setError("Organization name is required");
        setIsSubmitting(false);
        return;
      }

      const body = new FormData();
      body.append("organizationName", organizationNameRef.current.value);
      body.append("bio", bioRef.current?.value || "");
      body.append("location", locationRef.current?.value || "");

      const contactInfo = {
        email: emailRef.current?.value || "",
        instagram: instagramRef.current?.value || "",
        website: websiteRef.current?.value || "",
        other: otherContactRef.current?.value || "",
      };
      body.append("contactInfo", JSON.stringify(contactInfo));
      body.append("merchLocation", merchLocationRef.current?.value || "");

      if (newProfilePicture) {
        body.append("profilePicture", newProfilePicture);
      } else if (organization?.profilePicture) {
        body.append("existingProfilePicture", organization.profilePicture);
      }

      const res = await patch("/api/student-organizations", body);
      if (res.ok) {
        const data = await res.json();
        setOrganization(data.organization);
        setIsEditing(false);
        setError("");
        setNewProfilePicture(null);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update organization profile");
      }
    } catch (err) {
      setError("Failed to update organization profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewProfilePicture(null);
    setProfilePicturePreview(organization?.profilePicture || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewProfilePicture(null);
    setProfilePicturePreview(organization?.profilePicture || "");
    setFileError(null);
  };

  // Merch management functions
  const handleMerchImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      setMerchError("File size must be less than 5 MB");
      return;
    }

    setMerchError("");
    setNewMerchImage(file);
    setMerchImagePreview(URL.createObjectURL(file));
  };

  const handleAddMerch = async (e: FormEvent) => {
    e.preventDefault();
    setMerchError("");

    try {
      if (!merchNameRef.current?.value || !merchPriceRef.current?.value) {
        setMerchError("Name and price are required");
        return;
      }

      const body = new FormData();
      body.append("name", merchNameRef.current.value);
      body.append("price", merchPriceRef.current.value);
      body.append("description", merchDescriptionRef.current?.value || "");

      if (newMerchImage) {
        body.append("image", newMerchImage);
      }

      const res = await post("/api/merch", body);
      if (res.ok) {
        const data = await res.json();
        setMerchItems([...merchItems, data]);
        setIsAddingMerch(false);
        setNewMerchImage(null);
        setMerchImagePreview("");
        if (merchNameRef.current) merchNameRef.current.value = "";
        if (merchPriceRef.current) merchPriceRef.current.value = "";
        if (merchDescriptionRef.current) merchDescriptionRef.current.value = "";
        if (merchImageRef.current) merchImageRef.current.value = "";
      } else {
        const errorData = await res.json();
        setMerchError(errorData.message || "Failed to add merch item");
      }
    } catch (err) {
      setMerchError("Failed to add merch item. Please try again.");
    }
  };

  const handleUpdateMerch = async (e: FormEvent, merchId: string) => {
    e.preventDefault();
    setMerchError("");

    try {
      const merch = merchItems.find((m) => m._id === merchId);
      if (!merch) return;

      const body = new FormData();
      body.append("name", merchNameRef.current?.value || merch.name);
      body.append("price", merchPriceRef.current?.value || merch.price.toString());
      body.append("description", merchDescriptionRef.current?.value || merch.description);

      if (newMerchImage) {
        body.append("image", newMerchImage);
      } else {
        body.append("existingImage", merch.image);
      }

      const res = await patch(`/api/merch/${merchId}`, body);
      if (res.ok) {
        const data = await res.json();
        setMerchItems(merchItems.map((m) => (m._id === merchId ? data.merch : m)));
        setEditingMerchId(null);
        setNewMerchImage(null);
        setMerchImagePreview("");
      } else {
        const errorData = await res.json();
        setMerchError(errorData.message || "Failed to update merch item");
      }
    } catch (err) {
      setMerchError("Failed to update merch item. Please try again.");
    }
  };

  const handleDeleteMerch = async (merchId: string) => {
    if (!confirm("Are you sure you want to delete this merch item?")) return;

    try {
      const res = await DELETE(`/api/merch/${merchId}`);
      if (res.ok) {
        setMerchItems(merchItems.filter((m) => m._id !== merchId));
      } else {
        setMerchError("Failed to delete merch item");
      }
    } catch (err) {
      setMerchError("Failed to delete merch item. Please try again.");
    }
  };

  const startEditingMerch = (merch: MerchItem) => {
    setEditingMerchId(merch._id);
    setNewMerchImage(null);
    setMerchImagePreview(merch.image);
    if (merchNameRef.current) merchNameRef.current.value = merch.name;
    if (merchPriceRef.current) merchPriceRef.current.value = merch.price.toString();
    if (merchDescriptionRef.current) merchDescriptionRef.current.value = merch.description;
  };

  const cancelMerchEdit = () => {
    setEditingMerchId(null);
    setIsAddingMerch(false);
    setNewMerchImage(null);
    setMerchImagePreview("");
    setMerchError("");
  };

  // Star Rating Component
  const StarRating = ({ rating = 0 }: { rating?: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={star <= rating ? faStarSolid : faStar}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            size="sm"
          />
        ))}
        <span className="ml-1 text-gray-600 font-inter">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Student Organization Profile - Low-Price Center</title>
        </Helmet>
        <div className="w-full mt-12 mb-6">
          <p className="text-center font-inter">Loading...</p>
        </div>
      </>
    );
  }

  const isCreating = !organization;

  // Render create/edit form in modal
  if (isCreating || isEditing || showEditModal) {
    return (
      <>
        <Helmet>
          <title>
            {isCreating ? "Create" : "Edit"} - Student Organization Profile
          </title>
        </Helmet>
        <div className="w-full mt-12 mb-20">
          <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl text-center font-jetbrains font-medium mb-6">
              {isCreating ? "Create Student Organization Profile" : "Edit Profile"}
            </h1>

            <form
              onSubmit={isCreating ? handleCreate : handleUpdate}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {/* Profile Picture */}
              <div className="mb-6">
                <label className="block mb-2 font-medium font-inter text-black">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {profilePicturePreview && (
                    <img
                      src={profilePicturePreview}
                      alt="Profile preview"
                      className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleProfilePictureChange}
                      ref={profilePictureRef}
                      className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                    />
                    {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}
                  </div>
                </div>
              </div>

              {/* Organization Name */}
              <div className="mb-5">
                <label htmlFor="organizationName" className="block mb-2 font-medium font-inter text-black">
                  Organization Name *
                </label>
                <input
                  id="organizationName"
                  type="text"
                  ref={organizationNameRef}
                  defaultValue={organization?.organizationName || ""}
                  className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                  placeholder="Organization Name"
                  required
                />
              </div>

              {/* Bio */}
              <div className="mb-5">
                <label htmlFor="bio" className="block mb-2 font-medium font-inter text-black">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={5}
                  ref={bioRef}
                  defaultValue={organization?.bio || ""}
                  className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                  placeholder="Tell us about your organization..."
                />
              </div>

              {/* Location */}
              <div className="mb-5">
                <label htmlFor="location" className="block mb-2 font-medium font-inter text-black">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  ref={locationRef}
                  defaultValue={organization?.location || ""}
                  className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                  placeholder="e.g., UCSD Campus"
                />
              </div>

              {/* Contact Information */}
              <div className="mb-5">
                <label className="block mb-2 font-medium font-inter text-black">Contact Information</label>
                <div className="space-y-3">
                  <input
                    type="email"
                    ref={emailRef}
                    defaultValue={organization?.contactInfo?.email || ""}
                    className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    ref={instagramRef}
                    defaultValue={organization?.contactInfo?.instagram || ""}
                    className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                    placeholder="Instagram handle"
                  />
                  <input
                    type="url"
                    ref={websiteRef}
                    defaultValue={organization?.contactInfo?.website || ""}
                    className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                    placeholder="Website URL"
                  />
                  <input
                    type="text"
                    ref={otherContactRef}
                    defaultValue={organization?.contactInfo?.other || ""}
                    className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                    placeholder="Other contact information"
                  />
                </div>
              </div>

              {/* Merch Location */}
              <div className="mb-5">
                <label htmlFor="merchLocation" className="block mb-2 font-medium font-inter text-black">
                  Merch Location
                </label>
                <input
                  id="merchLocation"
                  type="text"
                  ref={merchLocationRef}
                  defaultValue={organization?.merchLocation || ""}
                  className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                  placeholder="e.g., Library Walk, Price Center"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Where can students find your merch? (e.g., Library Walk, Price Center)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3 mt-6">
                {!isCreating && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowEditModal(false);
                      handleCancel();
                    }}
                    className="bg-gray-500 text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all ml-auto"
                >
                  {isSubmitting ? "Saving..." : isCreating ? "Create Profile" : "Save Changes"}
                </button>
              </div>

              {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}
            </form>
          </div>
        </div>
      </>
    );
  }

  // Main profile view
  return (
    <>
      <Helmet>
        <title>{organization?.organizationName || "Student Organization"} - Low-Price Center</title>
      </Helmet>
      <div className="w-full mt-12 mb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Profile Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start gap-6 mb-4">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                {organization?.profilePicture ? (
                  <img
                    src={organization.profilePicture}
                    alt={organization.organizationName}
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-inter">?</span>
                  </div>
                )}
              </div>

              {/* Organization Name and Rating */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-inter mb-2">
                  {organization?.organizationName || "Organization Name"}
                </h1>
                <StarRating rating={0} />
              </div>

              {/* Edit Button */}
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowEditModal(true);
                }}
                className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
              >
                Edit Profile
              </button>
            </div>

          </div>

          {/* Content Section - Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-jetbrains font-medium mb-6">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Product Cards */}
                  {merchItems.map((merch) => (
                    <div
                      key={merch._id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative group"
                    >
                      <div className="aspect-square bg-gray-200 overflow-hidden">
                        {merch.image ? (
                          <img
                            src={merch.image}
                            alt={merch.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-inter font-semibold text-base mb-1 truncate">{merch.name}</p>
                        <p className="font-inter font-bold text-[#00629B] text-lg">
                          ${merch.price.toFixed(2)}
                        </p>
                      </div>
                      {/* Edit/Delete buttons on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={() => startEditingMerch(merch)}
                          className="bg-[#00629B] text-white p-2 rounded-full shadow-lg hover:brightness-90 transition-all"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteMerch(merch._id)}
                          className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:brightness-90 transition-all"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Product Button */}
                  <button
                    onClick={() => setIsAddingMerch(true)}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-4xl text-gray-400 font-light">+</span>
                      </div>
                      <p className="text-gray-500 font-inter text-sm">Add Product</p>
                    </div>
                  </button>
                </div>

                {/* Add Merch Form Modal */}
                {isAddingMerch && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-jetbrains font-medium">Add New Product</h2>
                        <button
                          onClick={cancelMerchEdit}
                          className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleAddMerch} className="space-y-4">
                        <div>
                          <label className="block mb-2 font-medium font-inter text-black">Name *</label>
                          <input
                            type="text"
                            ref={merchNameRef}
                            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                            placeholder="Product name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium font-inter text-black">Price *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            ref={merchPriceRef}
                            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium font-inter text-black">Description</label>
                          <textarea
                            ref={merchDescriptionRef}
                            rows={3}
                            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                            placeholder="Describe your product..."
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium font-inter text-black">Image</label>
                          {merchImagePreview && (
                            <img
                              src={merchImagePreview}
                              alt="Product preview"
                              className="w-32 h-32 object-cover rounded-md mb-2 border-2 border-gray-300"
                            />
                          )}
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleMerchImageChange}
                            ref={merchImageRef}
                            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={cancelMerchEdit}
                            className="bg-gray-500 text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
                          >
                            Add Product
                          </button>
                        </div>
                      </form>
                      {merchError && <p className="text-sm text-red-600 mt-4">{merchError}</p>}
                    </div>
                  </div>
                )}

                {/* Edit Merch Modal */}
                {editingMerchId && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-jetbrains font-medium">Edit Product</h2>
                        <button
                          onClick={cancelMerchEdit}
                          className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      {merchItems
                        .filter((m) => m._id === editingMerchId)
                        .map((merch) => (
                          <form
                            key={merch._id}
                            onSubmit={(e) => handleUpdateMerch(e, merch._id)}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block mb-2 font-medium font-inter text-black">Name *</label>
                              <input
                                type="text"
                                ref={merchNameRef}
                                defaultValue={merch.name}
                                className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium font-inter text-black">Price *</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                ref={merchPriceRef}
                                defaultValue={merch.price}
                                className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium font-inter text-black">
                                Description
                              </label>
                              <textarea
                                ref={merchDescriptionRef}
                                rows={3}
                                defaultValue={merch.description}
                                className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium font-inter text-black">Image</label>
                              {merchImagePreview && (
                                <img
                                  src={merchImagePreview}
                                  alt="Preview"
                                  className="w-32 h-32 object-cover rounded-md mb-2 border border-gray-300"
                                />
                              )}
                              <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleMerchImageChange}
                                className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5"
                              />
                            </div>
                            <div className="flex gap-3 pt-4">
                              <button
                                type="button"
                                onClick={cancelMerchEdit}
                                className="bg-gray-500 text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
                              >
                                Save Changes
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMerch(merch._id)}
                                className="bg-red-600 text-white font-semibold font-inter py-2 px-4 shadow-lg hover:brightness-90 transition-all"
                              >
                                Delete
                              </button>
                            </div>
                          </form>
                        ))}
                      {merchError && <p className="text-sm text-red-600 mt-4">{merchError}</p>}
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </>
  );
}

