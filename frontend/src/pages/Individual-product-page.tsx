import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { post } from "src/api/requests";
export function IndividualProductPage() {
  const navigate = useNavigate();
  const { user } = useContext(FirebaseContext);
  let { id } = useParams();
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    image: string;
    userEmail: string;
    description: string;
  }>();
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<String>();
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const COOLDOWN = 60 * 24 * 1000 * 60;
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);
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
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);

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
  return (
    <>
      <Helmet>
        <title>{`${product?.name} - Low-Price Center`}</title>
      </Helmet>
      <main className="w-[80%] max-w-screen-2xl mx-auto m-12">
        <div className="flex justify-between">
          <button
            className="text-lg mb-4 font-inter hover:underline"
            onClick={() => navigate("/products")}
          >
            &larr; Return to Marketplace
          </button>

          {hasPermissions && (
            <button
              className="text-lg mb-4 font-inter hover:underline"
              onClick={() => navigate(`/edit-product/${id}`)}
            >
              Edit Product <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>
        {error && <p className="max-w-[80%] w-full px-3 text-red-800">{error}</p>}
        {!error && (
          <div className="flex flex-wrap flex-col md:flex-row mb-6 gap-12">
            <section className="w-full flex-1 flex justify-center md:h-auto">
              <div className="max-h-[32rem] h-[32rem] max-w-[32rem] w-[32rem] relative border-8 border-ucsd-blue">
                <img
                  src={product?.image ? product?.image : "/productImages/product-placeholder.webp"}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            <section className="max-w-[100%] md:max-w-[50%] flex-1 flex flex-col">
              <h1 className="pt-2 font-jetbrains text-black font-bold text-4xl break-words">
                {product?.name}
              </h1>

              <hr className="my-6 w-full mx-auto h-0 border-[1px] border-solid border-gray-300" />

              <h2 className="font-inter text-[#35393C] text-base md:text-xl font-normal pb-6">
                USD ${product?.price?.toFixed(2)}
              </h2>
              {product?.description && (
                <div className="bg-[#F5F0E6] p-5">
                  <p className="font-inter text-black text-base md:text-xl font-normal break-words">
                    {product.description}
                  </p>
                </div>
              )}
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
