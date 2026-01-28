import { useState } from "react";

interface Props {
  setProducts: (query: string) => void;
  setError: (error: string) => void;
}

export default function SearchBar({ setProducts, setError }: Props) {
  const [query, setQuery] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    setProducts(value);
  };

  return (
    <input
      type="text"
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search for a product..."
      className="w-full bg-[#F8F8F8] shadow-md p-3 px-6 mx-auto my-2 rounded-3xl"
    />
  );
}
