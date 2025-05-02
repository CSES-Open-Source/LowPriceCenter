import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { DELETE, get, patch } from "src/api/requests";
import { FirebaseContext } from "src/utils/FirebaseProvider";
import { tags } from "src/utils/constants";

export function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState<{
    name: string;
    price: number;
    image: string;
    userEmail: string;
    description: string;
    tags: string[];
  }>();

  const productName = useRef<HTMLInputElement>(null);
  const productPrice = useRef<HTMLInputElement>(null);
  const productDescription = useRef<HTMLTextAreaElement>(null);
  const productImages = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [productTags, setProductTags] = useState<Array<string>>([]);

  const [error, setError] = useState<boolean>(false);

  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      await get(`/api/products/${id}`)
        .then(async (res) => {
          const productData = await res.json();
          setProduct(productData);
          setProductTags(productData.tags);
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
        productTags.forEach((tag) => {
          body.append("tags[]", tag);
        });
        if (user.email) body.append("userEmail", user.email);
        if (image) body.append("image", image);

        const res = await patch(`/api/products/${id}`, body);

        if (res.ok) {
          setError(false);
          navigate(`/products/${id}`);
        } else throw Error();
      } else throw Error();
    } catch (err) {
      setError(true); //displays an error message to the user
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await DELETE(`/api/products/${id}`);

      if (res.ok) {
        setError(false);
        window.location.href = "/products";
      } else throw Error();
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  // handle dropdown display
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.hidden = true;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

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
        {/* Product Tags */}
        <div className="mb-5">
          <label htmlFor="productTags" className="block mb-2 font-medium font-inter text-black">
            Tags
          </label>
          <div
            id="productTags"
            className="flex flex-row max-w-full flex-wrap gap-2 border border-gray-300 text-black text-sm rounded-md w-full p-2.5 min-h-10 hover:cursor-pointer"
            onClick={() => {
              if (dropdownRef.current) dropdownRef.current.hidden = false;
            }}
            ref={buttonRef}
          >
            {productTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 p-1 px-2 w-fit bg-slate-200 rounded-2xl"
              >
                <span className="text-sm font-medium">{tag}</span>
                <button
                  className="flex items-center justify-center p-1 h-5 w-5 bg-slate-300 text-md rounded-full hover:bg-blue-400 hover:text-white transition-colors duration-200"
                  onClick={() => {
                    setProductTags(productTags.filter((t) => t !== tag));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {/* Product Tags Dropdown */}
          {productTags.length !== tags.length && (
            <div
              ref={dropdownRef}
              className="z-10 mt-2 min-w-64 origin-top-right rounded-md ring-1 shadow-lg ring-black/5 focus:outline-hidden"
            >
              <div className="py-1 max-h-35 overflow-y-auto">
                {tags.map((tag) => {
                  if (!productTags.includes(tag)) {
                    return (
                      <p
                        onClick={() => {
                          setProductTags([...productTags, tag]);
                        }}
                        key={tag}
                        className="px-4 py-2 text-sm text-gray-700 hover:cursor-pointer"
                      >
                        {tag}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
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
