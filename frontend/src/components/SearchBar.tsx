import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  setProducts: (query: string) => void;
  setError: (error: string) => void;
}

export default function SearchBar({ setProducts, setError: _setError }: Props) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("query") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    setProducts(value);
  };

  const handleClear = () => {
    setQuery("");
    setProducts("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <div className="relative w-full my-2">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search for a product..."
        className="w-full bg-[#F8F8F8] shadow-md p-3 px-6 pr-12 rounded-3xl"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 text-lg"
        >
          ×
        </button>
      )}
    </div>
  );
}
