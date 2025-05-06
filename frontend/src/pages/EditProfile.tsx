import { useState, useRef, useContext, useEffect, FormEvent } from "react";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { useNavigate } from "react-router-dom";
import { get, patch } from "src/api/requests";
import { Helmet } from "react-helmet-async";

interface UserProfile {
  uid: string;
  displayName?: string;
  profilePic?: string;
  biography?: string;
}

export function EditProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const profileDisplayName = useRef<HTMLInputElement>(null);
  const profileBiography = useRef<HTMLTextAreaElement>(null);
  const profilePicture = useRef<HTMLInputElement>(null);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | null>(null);

  const [error, setError] = useState<boolean>(false);

  const { user } = useContext(FirebaseContext);
  // const { id } = useParams();
  const uid = user?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      try {
        const res = await get(`/api/users/${uid}`);
        const profileData = await res.json();
        setProfile(profileData);
        setCurrentProfilePic(profileData.profilePic);
      } catch {
        setError(true);
      }
    };
    fetchUser();
  }, [uid]);

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (profileDisplayName.current && profileBiography.current && user) {
        let profilePic;
        if (profilePicture.current && profilePicture.current.files) {
          profilePic = profilePicture.current.files[0];
        }

        const body = new FormData();
        body.append("displayName", profileDisplayName.current.value);
        body.append("biography", profileBiography.current.value);
        if (profilePic) body.append("profilePic", profilePic);

        const res = await patch(`/api/users/${uid}`, body);

        if (!res.ok) {
          throw new Error("Patch failed");
        }

        setError(false);
        navigate(`/user-profile/${uid}`);
      } else throw Error();
    } catch (err) {
      setError(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <div className="w-full mt-12 mb-6">
        <p className="text-3xl text-center font-jetbrains font-medium">Edit Profile</p>
      </div>
      <form className="max-w-sm mx-auto p-4" onSubmit={handleEdit}>
        {/* Profile Display Name */}
        <div className="mb-5">
          <label htmlFor="displayName" className="block mb-2 font-medium font-inter text-black">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            defaultValue={profile?.displayName}
            ref={profileDisplayName}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="Display Name"
            required
          />
        </div>
        {/* Biography */}
        <div className="mb-5">
          <label htmlFor="biography" className="block mb-2 font-medium font-inter text-black">
            Biography
          </label>
          <textarea
            id="biography"
            rows={10}
            defaultValue={profile?.biography}
            ref={profileBiography}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="Add your biography..."
          />
        </div>
        {/* Profile Picture */}
        <div className="mb-5">
          <label htmlFor="profilePic" className="block mb-2 font-medium font-inter text-black">
            Profile Picture
          </label>
          <input
            id="profilePic"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            ref={profilePicture}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
          />
          {currentProfilePic && (
            <img className="w-full object-contain mt-2" src={currentProfilePic} alt="Profile" />
          )}
        </div>
        <div className="flex justify-between gap-3">
          <button
            onClick={() => navigate(`/user-profile/${uid}`)}
            className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
        {/* error message */}
        {error && (
          <p className="m-2 mt-4 text-sm text-red-800 text-center">
            Error editing profile. Try again.
          </p>
        )}
      </form>
    </>
  );
}
