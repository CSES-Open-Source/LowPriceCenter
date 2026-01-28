import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { post } from "src/api/requests";

interface Props {
  productId: string;
  productImages: string[];
  productName: string;
  productPrice: number;
  productYear: number;
  productCategory: string;
  productCondition: string;
  productLocation: string;
  isSaved?: boolean;
  onSaveToggle?: (productId: string, newSavedStatus: boolean) => void;
}

function Product({
  productId,
  productImages,
  productName,
  productPrice,
  isSaved: initialIsSaved = false,
}: Props) {
  const { user } = useContext(FirebaseContext);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isHovered, setIsHovered] = useState(false);
  const images =
    productImages.length > 0 ? productImages : ["/productImages/product-placeholder.webp"];

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.uid) return;

    try {
      setIsSaved((prev) => !prev);
      await post(`/api/users/${user.uid}/saved-products`, { productId });
    } catch (error) {
      setIsSaved((prev) => !prev);
      console.error("Error saving product:", error);
    }
  };

  return (
    <div
      className="w-full bg-[#F8F8F8] shadow-lg rounded-lg hover:brightness-[96%] transition-all overflow-clip relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={`/products/${productId}`} className="block">
        <div className="max-h-[16rem] h-[16rem] overflow-hidden relative">
          <img className="w-full h-full object-cover" src={images[0]} alt={productName} />
          {(isHovered || isSaved) && user?.uid && (
            <button
              onClick={toggleSave}
              className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
            >
              <FontAwesomeIcon
                icon={isSaved ? faHeartSolid : faHeartRegular}
                size="sm"
                className={isSaved ? "text-red-500" : "text-gray-700"}
              />
            </button>
          )}
        </div>
        <div className="p-2">
          <p className="font-semibold font-inter truncate max-w-44 md:max-w-96" title={productName}>
            {productName}
          </p>
          <p className="font-light font-inter truncate max-w-44 md:max-w-96">
            ${productPrice.toFixed(2)}
          </p>
        </div>
      </a>
    </div>
  );
}

export default Product;
