import { useEffect, useState } from "react";
import { get } from "/src/api/requests";

interface Props {
  setProducts: (products: []) => void;
  setError: (error: string) => void;
}

export default function SearchBar({ setProducts, setError }: Props) {
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    /*
     * if query is null, get all products
     * otherwise get products that match the query
     */
    const search = async () => {
      try {
        if (query && query.trim().length > 0) {
          await get(`/api/products/search/${query}`).then((res) => {
            if (res.ok) {
              res.json().then((data) => {
                setProducts(data);
              });
            }
          });
        } else {
          await get(`/api/products/`).then((res) => {
            if (res.ok) {
              res.json().then((data) => {
                setProducts(data);
              });
            }
          });
        }
      } catch (err) {
        setError("Unable to display products. Try again later.");
        console.error(err);
      }
    };
    search();
  }, [query]);

  return (
    <input
      type="text"
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for a product..."
      className="w-full bg-[#F8F8F8] shadow-md p-3 px-6 mx-auto my-2 rounded-3xl"
    />
  );
}
