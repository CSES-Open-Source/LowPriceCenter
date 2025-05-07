interface Props {
  productImages: string[];
  productId: string;
  productName: string;
  productPrice: number;
}

function Product({ productId, productImages, productName, productPrice }: Props) {
  const displayImage =
    productImages && productImages.length > 0
      ? productImages[0]
      : "/productImages/product-placeholder.webp";

  return (
    <div className="w-full bg-[#F8F8F8] shadow-lg rounded-lg hover:brightness-[96%] transition-all overflow-clip">
      <a href={`/products/${productId}`}>
        <div className="relative max-h-[16rem] h-[16rem] overflow-hidden">
          <img src={displayImage} alt={`Image`} className="w-full h-full object-contain" />
        </div>
        <div className="p-2">
          <p className="font-semibold font-inter truncate max-w-44 md:max-w-96" title={productName}>
            {productName}
          </p>
          <p
            className="font-light font-inter truncate max-w-44 md:max-w-96"
            title={productPrice.toFixed(2)}
          >
            ${productPrice.toFixed(2)}
          </p>
        </div>
      </a>
    </div>
  );
}

export default Product;
