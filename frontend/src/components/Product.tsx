interface Props {
  productImage: string;
  productName: string;
  productPrice: number;
}

function Product({ productImage, productName, productPrice }: Props) {
  return (
    <div className="w-full bg-[#F8F8F8] shadow-xl">
      <a href="/">
        <div className="max-h-[16rem] h-[16rem] overflow-hidden">
          <img className="w-full h-full object-cover" src={productImage} alt="" />
        </div>
        <div className="p-2">
          <p className="font-semibold font-inter">{productName}</p>
          <p className="font-light font-inter ">${productPrice.toFixed(2)}</p>
        </div>
      </a>
    </div>
  );
}

export default Product;
