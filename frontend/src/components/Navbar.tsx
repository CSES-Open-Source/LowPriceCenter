import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faUser, faBars, faXmark }  from "@fortawesome/free-solid-svg-icons"

export function Navbar() {

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      )
      { setMobileMenuOpen(false); }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-ucsd-blue text-white p-2 flex items-center justify-between sticky top-0 z-50 max-h-12">

        {/* Desktop View */}
        <button className="text-xl pl-2">
          Low-Price Center
        </button>
        <ul className="hidden md:flex items-center space-x-4 text-xl">
          <li>
            <button className="px-4 py-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue">
              <FontAwesomeIcon className="text-lg pr-2" icon={faCartShopping} aria-label="Shopping Cart" />
              Products
            </button>
          </li>
          <li>
            <button className="px-4 py-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue">
              <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
              Sign In
            </button>
          </li>
        </ul>

        {/* Mobile View */}
        <div className="md:hidden relative">
          <button
            ref={buttonRef}
            className="px-2.5 pt-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon className="text-2xl" icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>
          <ul
            ref={menuRef}
            className={`absolute top-12 right-0.5 bg-ucsd-blue text-white text-lg shadow-lg rounded-lg w-48 p-4 
            transition-transform duration-300 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          >
            <li className="mb-2">
              <button className="w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue">
                <FontAwesomeIcon className="text-lg pr-2" icon={faCartShopping} aria-label="Shopping Cart" />
                Products
              </button>
            </li>
            <li>
              <button className="w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue">
                <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
                Sign In
              </button>
            </li>
          </ul>
        </div>
        
      </nav>

      {/* Dropdown Menu Blur Effect */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
