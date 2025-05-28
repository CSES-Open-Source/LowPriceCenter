import { useEffect, useRef, useState } from "react";
import { get } from "src/api/requests";
import { FaFilter } from "react-icons/fa6";
import { tags } from "../utils/constants.tsx";
import { orderMethods } from "../utils/constants.tsx";

interface Props {
  setProducts: (products: []) => void;
  setError: (error: string) => void;
}

export default function SearchBar({ setProducts, setError }: Props) {
  const [dropdownHidden, setDropdownHidden] = useState<boolean>(true);
  const [query, setQuery] = useState<string | null>(null);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<string>();
  const [orderBy, setOrderBy] = useState<string>("Most Recent");

  useEffect(() => {
    /*
     * if query and tags and price are null, get all products
     * otherwise get products that match the query/tags/price
     */
    const search = async () => {
      try {
        if (
          (query && query.trim().length > 0) ||
          tagFilters.length > 0 ||
          priceMax ||
          orderBy !== "Most Recent"
        ) {
          const selectedTags = tagFilters.length > 0 ? tagFilters.join(",") : "";
          let keyword = "";
          if (query) {
            keyword = query.trim().length > 0 ? query.trim() : "";
          }
          let price = "";
          if (priceMax) price = String(priceMax);

          await get(
            `/api/products/search?keyword=${keyword}&tags=${selectedTags}&price=${price}&order=${orderMethods[orderBy]}`,
          ).then((res) => {
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
  }, [query, tagFilters, priceMax, orderBy]);

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
        setDropdownHidden(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative w-full my-2">
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          className="w-full bg-[#F8F8F8] shadow-md p-3 pr-12 pl-6 rounded-3xl"
        />
        <div ref={buttonRef}>
          <FaFilter
            onClick={() => {
              setDropdownHidden((prev) => !prev);
            }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[#00629B] text-[1.2rem] cursor-pointer"
          />
        </div>

        <div
          ref={dropdownRef}
          hidden={dropdownHidden}
          className="absolute right-0 top-full z-20 mt-2 mr-1 w-56 px-3 bg-white rounded-md ring-1 shadow-lg ring-black/5 focus:outline-hidden"
        >
          <div className="py-3 max-h-35 overflow-y-auto bg-white rounded-md">
            <p className="font-semibold font-inter text-base">Category</p>
            {tags.map((tag, index) => (
              <div key={index} className="flex flex-row gap-2">
                <input
                  type="checkbox"
                  id={tag}
                  name={tag}
                  value={tag}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTagFilters([...tagFilters, tag]);
                    } else {
                      setTagFilters(tagFilters.filter((t) => t !== tag));
                    }
                  }}
                />
                <label htmlFor={tag} className="font-inter">
                  {tag}
                </label>
                <br />
              </div>
            ))}
            <div className="my-3 border-[0.5px] border-ucsd-blue rounded-2xl" />
            <p className="font-semibold font-inter text-base">Price</p>
            <input
              id="default-range"
              type="range"
              min={0}
              max={1000}
              step={10}
              value={priceMax}
              defaultValue={0}
              onChange={(event) => {
                setPriceMax(event.target.value);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg mb-3 appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00629B 0%, #00629B ${((Number(priceMax) ?? 0) / 1000) * 100}%, #e5e7eb ${((Number(priceMax) ?? 0) / 1000) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex flex-row items-center gap-2 max-w-50">
              <p className="text-sm">$0 - </p>
              <input
                type="number"
                min={0}
                max={1000}
                value={priceMax}
                step={0.01}
                onChange={(event) => setPriceMax(event.target.value)}
                className="w-1/3 p-1 border border-gray-300 text-black text-sm rounded-md"
              />
            </div>
            <div className="my-3 mt-4 border-[0.5px] border-ucsd-blue rounded-2xl" />
            <p className="font-semibold font-inter text-base">Sort By</p>
            <div>
              {Object.keys(orderMethods).map((method, index) => (
                <div key={index} className="flex flex-row gap-2">
                  <input
                    type="radio"
                    id={method}
                    name="orderBy"
                    value={method}
                    checked={orderBy === method}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOrderBy(method);
                      }
                    }}
                  />
                  <label htmlFor={method} className="font-inter">
                    {" "}
                    {method}
                  </label>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
