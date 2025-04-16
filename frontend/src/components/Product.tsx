import { useState } from "react";

interface Props {
  productImages: string[];
  productName: string;
  productPrice: number;
}

function Product({ productImages, productName, productPrice }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (event: React.MouseEvent) => {
    event.preventDefault();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? productImages.length - 1 : prevIndex - 1));
  };

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    setCurrentIndex((prevIndex) => (prevIndex === productImages.length - 1 ? 0 : prevIndex + 1));
  };

  const displayImage =
    productImages && productImages.length > 0
      ? productImages[currentIndex]
      : "/productImages/product-placeholder.webp";

  return (
    <div className="w-full bg-[#F8F8F8] shadow-xl">
      <a href="/">
        <div className="relative max-h-[16rem] h-[16rem] overflow-hidden">
          <img
            src={displayImage}
            alt={`Image ${currentIndex + 1} of ${productName}`}
            className="w-full h-48 object-cover rounded"
          />
          {productImages.length > 1 && (
            <>
              <button className="absolute top-1/2 left-0 px-2 py-1 text-sm" onClick={handlePrev}>
                ‹
              </button>
              <button className="absolute top-1/2 right-0 px-2 py-1 text-sm" onClick={handleNext}>
                ›
              </button>
            </>
          )}
        </div>
        <div className="p-2">
          <p className="font-semibold">{productName}</p>
          <p className="font-extralight">${productPrice.toFixed(2)}</p>
        </div>
      </a>
    </div>
  );
}

export default Product;
