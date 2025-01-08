function Product() {
  return (
    <div className="max-w-[16rem] bg-white shadow-xl">
      <div className="h-30 overflow-hidden">
        <img className="w-full" src="product-placeholder.webp" alt="product image placeholder" />
      </div>
      <div className="p-2">
        <p className="font-semibold">Product Name</p>
        <p className="font-extralight">$15.00</p>
      </div>
    </div>
  );
}

export default Product;
