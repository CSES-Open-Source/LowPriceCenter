import { useEffect, useRef, useState } from "react";
import { get } from "src/api/requests";
import { FaFilter } from "react-icons/fa6";
import { tags } from "../utils/constants.tsx";

interface Props {
  setProducts: (products: []) => void;
  setError: (error: string) => void;
}

export default function SearchBar({ setProducts, setError }: Props) {
  const [query, setQuery] = useState<string | null>(null);
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  useEffect(() => {
    /*
     * if query and tags are null, get all products
     * otherwise get products that match the query/tags
     */
    const search = async () => {
      try {
        if ((query && query.trim().length > 0) || tagFilters.length > 0) {
          const selectedTags = tagFilters.length > 0 ? tagFilters.join(",") : "";
          let keyword = "";
          if (query) {
            keyword = query.trim().length > 0 ? query.trim() : "";
          }

          await get(`/api/products/search?keyword=${keyword}&tags=${selectedTags}`).then((res) => {
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
  }, [query, tagFilters]);

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
              if (dropdownRef.current) dropdownRef.current.hidden = !dropdownRef.current?.hidden;
            }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[#00629B] text-[1.2rem] cursor-pointer"
          />
        </div>

        <div
          ref={dropdownRef}
          className="absolute right-0 top-full z-10 mt-2 mr-1 w-56 rounded-md ring-1 shadow-lg ring-black/5 focus:outline-hidden"
        >
          <div className="py-3 max-h-35 overflow-y-auto bg-white rounded-md">
            <span className="font-semibold font-inter text-base px-4">Category</span>
            {tags.map((tag, index) => (
              <div key={index} className="px-4 flex flex-row gap-2">
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
                <label className="font-inter"> {tag}</label>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
