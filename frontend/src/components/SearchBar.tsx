import { useRef } from "react";

export default function SearchBar() {
  const query = useRef<HTMLInputElement>(null);
  return (
    <input
      type="text"
      ref={query}
      placeholder="Search for a product..."
      className="w-full bg-[#F8F8F8] shadow-md p-3 px-6 mx-auto my-2 rounded-3xl"
    />
  );
}
