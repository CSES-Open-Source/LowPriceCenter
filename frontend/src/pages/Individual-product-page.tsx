import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faCalendar, faTag, faCheckCircle, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { get, post } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import EmblaCarousel from "src/components/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

export function IndividualProductPage() {
  const navigate = useNavigate();
  const { user } = useContext(FirebaseContext);
  const { id } = useParams();
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    year: number;
    category: string;
    condition: string;
    location: string;
    images: string[];
    userEmail: string;
    description: string;
  }>();
  const [error, setError] = useState<string>();
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const OPTIONS: EmblaOptionsType = {
    loop: false,
    align: "start",
    skipSnaps: false,
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const COOLDOWN = 60 * 24 * 1000 * 60;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const location = useLocation() as {
    state?: { from?: "saved" | "marketplace" };
  };

  const from = location.state?.from ?? "marketplace";
  const backPath = from === "saved" ? "/saved-products" : "/products";

  useEffect(() => {
    const fetchProduct = async () => {
      await get(`/api/products/${id}`)
        .then(async (res) => setProduct(await res.json()))
        .catch(() => setError("Product not found"));
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const findEditPermission = async () => {
      const uid = user?.uid;
      if (uid)
        await get(`/api/users/${uid}`).then(async (res) => {
          const ownedByUser = await res.json().then((data) => {
            return data.productList.includes(id);
          });
          setHasPermissions(ownedByUser);
        });
    };
    findEditPermission();
  }, []);

  useEffect(() => {
    const key = `interest-cooldown-${id}`;
    const stored = localStorage.getItem(key);
    if (!stored) return;

    const end = parseInt(stored, 10);
    if (Date.now() < end) {
      setCooldownEnd(end);
      const timer = setTimeout(() => {
        setCooldownEnd(null);
        localStorage.removeItem(key);
      }, end - Date.now());
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem(key);
    }
  }, [id]);
  const handleSendInterestEmail = async () => {
    if (cooldownEnd && Date.now() < cooldownEnd) {
      setMessage("Please wait before sending another interest email.");
      return;
    }
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await post("/api/interestEmail", { consumerId: user?.uid, productId: id });
      const result = await response.json();
      if (!response.ok) {
        setMessage(`Error: ${result.message}`);
        return;
      }

      setMessage("Interest email sent successfully!");
      const end = Date.now() + COOLDOWN;
      setCooldownEnd(end);
      const key = `interest-cooldown-${id}`;
      localStorage.setItem(key, end.toString());
      setTimeout(() => {
        setCooldownEnd(null);
        localStorage.removeItem(key);
      }, COOLDOWN);
    } catch {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isCooling = Boolean(cooldownEnd && Date.now() < cooldownEnd);
  // const secondsLeft = isCooling ? Math.ceil((cooldownEnd! - Date.now()) / 1000) : 0;
  const msLeft = isCooling ? cooldownEnd! - Date.now() : 0;
  const totalMinutes = Math.ceil(msLeft / (1000 * 60)); // convert ms → minutes
  const hoursLeft = Math.floor(totalMinutes / 60);
  const minutesLeft = totalMinutes % 60;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isCooling) return;
    const iv = setInterval(() => setTick((t) => t + 1), 60_000); // 60 000 ms = 1 min
    return () => clearInterval(iv);
  }, [isCooling]);
  let buttonLabel = "Interested?";
  if (message) {
    buttonLabel = message;
  } else if (isCooling && isHovered) {
    buttonLabel = `Please wait ${hoursLeft}:${minutesLeft.toString().padStart(2, "0")} hours`;
  } else if (isCooling && !isHovered) {
    buttonLabel = "Interest email sent successfully!";
  } else if (!isCooling && isHovered) {
    buttonLabel = "Click to send interest email";
  }

  const toggleSave = async () => {
    if (!user?.uid) {
      navigate("/login");
      return;
    }

    try {
      setIsSaved((prev) => !prev);
      const response = await post(`/api/users/${user.uid}/saved-products`, { productId: id });
      if (!response.ok) {
        setIsSaved((prev) => !prev);
        throw new Error("Failed to update saved products");
      }
      const userRes = await get(`/api/users/${user.uid}`);
      const userData = await userRes.json();
      setIsSaved(userData.savedProducts.includes(id));
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${product?.name} - Low-Price Center`}</title>
      </Helmet>
      <main className="w-[80%] max-w-screen-2xl mx-auto m-12">
        <div className="flex justify-end">
          {hasPermissions && (
            <button
              className="text-lg mb-4 font-inter hover:underline"
              onClick={() => navigate(`/edit-product/${id}`)}
            >
              Edit Product <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>
        {/* Error message if product not found */}
        {error && <p className="max-w-[80%] w-full px-3 text-red-800">{error}</p>}
        {/* Display product */}
        {!error && (
          <div className="flex flex-wrap flex-col md:flex-row mb-6 gap-12">
            {/* Image Section */}
            <section className="w-full flex-1 flex flex-col items-center space-y-12 md:h-auto">
              <div className="bg-[#00629B] p-4 rounded-xl w-full max-w-[40rem]">
                <div className="max-h-[24rem] h-[24rem] w-full relative">
                  <img
                    src={
                      product?.images && product.images.length > 0
                        ? product.images[currentIndex]
                        : "/productImages/product-placeholder.webp"
                    }
                    alt={`Image ${currentIndex + 1} of ${product?.name}`}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={toggleSave}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <FontAwesomeIcon
                      icon={isSaved ? faHeartSolid : faHeartRegular}
                      size="lg"
                      className={isSaved ? "text-red-500" : "text-gray-700"}
                    />
                  </button>
                </div>
              </div>
              {product?.images && product.images.length > 1 && (
                <EmblaCarousel
                  slides={product.images}
                  options={OPTIONS}
                  onSelect={(idx) => setCurrentIndex(idx)}
                />
              )}
              <button
                className="mt-8 text-black font-inter text-lg px-6 py-3 rounded-lg shadow-md hover:brightness-95 transition self-start"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #FFCD00 0%, #ffd94d 100%), url('/bg-light-white-trident.png')",
                  backgroundBlendMode: "overlay, normal",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0 0, -37px -1px",
                  backgroundSize: "100% 100%, 249px",
                }}
                onClick={() => navigate(backPath)}
              >
                &larr; Return to {from === "saved" ? "Saved Products" : "Marketplace"}
              </button>
            </section>

            {/* Info Section */}
            <section className="max-w-[100%] md:max-w-[50%] flex-1 flex flex-col">
              <h1 className="pt-2 font-jetbrains text-black font-bold text-4xl break-words mb-3">
                {product?.name}
              </h1>
              <div className="h-px w-full bg-gray-200 mb-4" />

              {/* Price - Prominent Display */}
              <div className="mb-6">
                <h2 className="font-jetbrains text-[#00629B] text-3xl md:text-4xl font-bold">
                  ${product?.price?.toFixed(2)}
                </h2>
                <p className="font-inter text-gray-500 text-sm mt-1">USD</p>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[96px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={faCalendar} className="text-[#00629B] text-sm" />
                    <span className="font-inter text-gray-500 text-[11px] uppercase tracking-wide">Year</span>
                  </div>
                  <p className="font-inter text-black text-base font-semibold">{product?.year}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[96px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={faTag} className="text-[#00629B] text-sm" />
                    <span className="font-inter text-gray-500 text-[11px] uppercase tracking-wide">Category</span>
                  </div>
                  <p className="font-inter text-black text-base font-semibold">{product?.category}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[96px] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#00629B] text-sm" />
                    <span className="font-inter text-gray-500 text-[11px] uppercase tracking-wide">Condition</span>
                  </div>
                  <p className="font-inter text-black text-base font-semibold">{product?.condition}</p>
                </div>

              </div>

              {/* Description */}
              {product?.description && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                  <h3 className="font-inter text-gray-700 text-sm uppercase tracking-wide mb-3 font-semibold">
                    Description
                  </h3>
                  <p className="font-inter text-black text-base md:text-lg leading-relaxed break-words whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Contact Seller Box */}
              <div className="w-full mb-6">
                <div className="bg-gradient-to-br from-[#F5F0E6] to-[#F9F7F3] border border-gray-200 rounded-lg shadow-sm p-5 text-black font-inter">
                  <p className="text-sm font-semibold uppercase tracking-wide mb-3">
                    Contact Info
                  </p>
                  <p className="text-base leading-relaxed">
                    <span className="font-semibold">Email:</span> {product?.userEmail ?? "placeholder"}
                  </p>
                  <p className="text-base leading-relaxed">
                    <span className="font-semibold">Phone:</span> placeholder
                  </p>
                </div>
              </div>

              {!hasPermissions && (
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button
                    onClick={!isCooling ? handleSendInterestEmail : undefined}
                    className={`
                      font-inter text-[#00629B]
                      text-base md:text-xl font-light mt-6
                      bg-white border border-[#00629B]
                      px-4 py-2 rounded-lg
                      transition-colors duration-200 ease-in-out
                      ${!isCooling ? "hover:bg-blue-100" : ""}
                      ${isCooling ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                  >
                    {buttonLabel}
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
