import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
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
  displayName?: string;
  email: string;
  productList: Product[];
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");
  const { user } = useContext(FirebaseContext);
  useEffect(() => {
    const userUid = user?.uid;
    const fetchUser = async () => {
      await get(`/api/users/${userUid}`)
        .then(async (res) => setProfile(await res.json()))
        .catch(() => setError("user not found"));
    };
    fetchUser();
  }, [user]);
  console.log("profile.productList:", profile?.productList);
  return (
    <>
      <Helmet>
        <title>
          {profile ? `${profile.displayName || profile.email}'s Profile` : "Profile"} - Low-Price
          Center
        </title>
      </Helmet>
      <main className="w-full flex justify-center items-center mt-12 mb-20">
        <div className="max-w-[80%] w-full">
          {error && <p className="text-red-800">{error}</p>}
          {!error && (
            <>
              <div className="flex justify-between mb-2 px-3">
                <p className="text-lg sm:text-3xl font-jetbrains font-medium">
                  {profile?.displayName || profile?.email}'s Listings
                </p>
              </div>
              {profile?.productList.length === 0 && (
                <p className="font-inter text-lg px-3 pt-3">No posted products yet.</p>
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
