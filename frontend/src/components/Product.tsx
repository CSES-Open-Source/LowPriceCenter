interface Props {
  productImage: string;
  productName: string;
  productPrice: number;
}

function Product({ productImage, productName, productPrice }: Props) {
  return (
    <a href="/">
      <div className="max-w-[16rem] w-[16rem] bg-[#F8F8F8] shadow-xl">
        <div className="max-h-[16rem] h-[16rem] overflow-hidden">
          <img className="w-full h-full object-cover" src={productImage} alt="" />
        </div>
        <div className="p-2">
          <p className="font-semibold">{productName}</p>
          <p className="font-extralight">${productPrice.toFixed(2)}</p>
        </div>
      </div>
    </a>
  );
}

export default Product;
