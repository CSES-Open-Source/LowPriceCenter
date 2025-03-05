import { FormEvent, useRef, useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { get, post, put } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function EditProduct() {
  let { id } = useParams();

  const [product, setProduct] = useState<{
    name: string;
    price: number;
    image: string;
    userEmail: string;
    description: string;
  }>();

  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productImages = useRef<HTMLInputElement>(null);

  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [error, setError] = useState<boolean>(false);
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      await get(`/api/products/${id}`)
        .then(async (res) => {
          const productData = await res.json();
          setProduct(productData);
          setCurrentImage(productData.image);
        })
        .catch(() => setError(true));
    };
    fetchProduct();
  }, [id]);

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (productName.current && productPrice.current && productDescription.current && user) {
        let image;
        if (productImages.current && productImages.current.files) {
          image = productImages.current.files[0];
        }

        const body = new FormData();
        body.append("name", productName.current.value);
        body.append("price", productPrice.current.value);
        body.append("description", productDescription.current.value);
        if (user.email) body.append("userEmail", user.email);
        if (image) body.append("image", image);

        const res = await put(`/api/products/${id}`, body);

        if (res.ok) {
          setError(false);
          window.location.href = `/product/${id}`;
        } else throw Error();
      } else throw Error();
    } catch (err) {
      setError(true); //displays an error message to the user
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setError(false);
        window.location.href = "/products";
      } else throw Error();
    } catch (err) {
      setError(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Helmet>
        <title>Low-Price Center Marketplace</title>
      </Helmet>
      <div className="w-full mt-12 mb-6">
        <p className="text-3xl text-center font-jetbrains font-medium">Edit Product</p>
      </div>
      <form className="max-w-sm mx-auto p-4" onSubmit={handleEdit}>
        {/* Product Name */}
        <div className="mb-5">
          <label htmlFor="productName" className="block mb-2 font-medium font-inter text-black">
            Name
          </label>
          <input
            id="productName"
            type="text"
            defaultValue={product?.name}
            ref={productName}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="Product Name"
            required
          />
        </div>
        {/* Product Price */}
        <div className="mb-5">
          <label htmlFor="productPrice" className="block mb-2 font-medium font-inter text-black">
            Price
          </label>
          <input
            id="productPrice"
            type="number"
            min={0}
            max={1000000000}
            step={0.01}
            defaultValue={product?.price}
            ref={productPrice}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="$0.00"
            required
          />
        </div>
        {/* Product Description */}
        <div className="mb-5">
          <label
            htmlFor="productDescription"
            className="block mb-2 font-medium font-inter text-black"
          >
            Description
          </label>
          <textarea
            id="productDescription"
            rows={10}
            defaultValue={product?.description}
            ref={productDescription}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
            placeholder="Tell us more about this product..."
          />
        </div>
        {/* Product Image */}
        <div className="mb-5">
          <label htmlFor="productImages" className="block mb-2 font-medium font-inter text-black">
            Image
          </label>
          <input
            id="productImages"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            ref={productImages}
            className="border border-gray-300 text-black text-sm rounded-md w-full p-2.5 y-600"
          />
          {currentImage && (
            <img className="w-full aspect-square mt-2" src={currentImage} alt="Product" />
          )}
        </div>
        <div className="flex justify-between gap-3">
          <button
            onClick={() => navigate(`/products/${id}`)}
            className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-[#DC3545] text-white font-semibold font-inter py-2 px-4 shadow-lg"
            >
              Delete
            </button>
            <button
              type="submit"
              className="bg-[#00629B] text-white font-semibold font-inter py-2 px-4 shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
        {/* error message */}
        {error && (
          <p className="m-2 mt-4 text-sm text-red-800 text-center">
            Error editing product. Try again.
          </p>
        )}
      </form>
    </>
  );
}
