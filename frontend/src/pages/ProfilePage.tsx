import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Product from "src/components/Product";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { get } from "src/api/requests";
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface UserProfile {
  firebaseUid: string;
  displayName?: string;
  email: string;
  productList: Product[];
  profilePic?: string;
  biography?: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");
  const { user } = useContext(FirebaseContext);
  const { id } = useParams();
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      await get(`/api/users/${id}`)
        .then(async (res) => setProfile(await res.json()))
        .catch(() => setError("User not found"));
    };
    if (id) fetchUser();
  }, [id]);

  useEffect(() => {
    if (user?.uid && profile?.firebaseUid) {
      setHasPermissions(user.uid === profile.firebaseUid);
    }
  }, [user, profile]);

  return (
    <>
      <Helmet>
        <title>
          {profile ? `${profile.displayName || profile.email}'s Profile` : "Profile"} - Low-Price
          Center
        </title>
      </Helmet>
      <main className="w-full flex flex-col items-center mt-12 mb-20">
        <div className="max-w-[80%] w-full justify-center">
          {error && <p className="text-red-800">{error}</p>}
          {!error && (
            <>
              <div className="flex justify-between mb-2 px-3">
                <button
                  className="text-lg mb-4 font-inter hover:underline"
                  onClick={() => navigate("/products")}
                >
                  &larr; Return to Marketplace
                </button>
                {hasPermissions && (
                  <button
                    className="text-lg mb-4 font-inter hover:underline"
                    onClick={() => navigate(`/edit-profile`)}
                  >
                    Edit Profile <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                )}
              </div>
              <div className="flex justify-between mb-2 px-3 gap-10">
                <div className="flex-1">
                  <p className="text-2xl sm:text-3xl font-jetbrains font-bold mb-6">
                    {profile?.displayName || profile?.email}
                  </p>
                  {/* Biography */}
                  <div className="bg-[#F5F0E6] p-5 mb-6">
                    <p className="font-inter text-black text-base md:text-xl font-normal break-words">
                      {profile?.biography || "Welcome to my profile!"}
                    </p>
                  </div>
                </div>
                {/* Profile Image */}
                <div>
                  <img
                    src={profile?.profilePic ? profile?.profilePic : "/profile-pic-default.png"}
                    alt="Profile Image"
                    className="w-48 h-48 object-cover rounded-full shadow-md"
                  />
                </div>
              </div>
              <div className="flex justify-between mb-2 px-3">
                <p className="text-lg sm:text-3xl font-jetbrains font-medium">Products</p>
              </div>
              {profile?.productList.length === 0 && (
                <p className="font-inter text-lg px-3 pt-3">No listed products yet.</p>
              )}

              <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4">
                {profile?.productList.map(
                  (product: { _id: string; name: string; price: number; image: string }) => (
                    <div key={product._id} className="px-3 py-3">
                      <Product
                        productId={product._id}
                        productName={product.name}
                        productPrice={product.price}
                        productImage={
                          product.image ? product.image : "/productImages/product-placeholder.webp"
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
