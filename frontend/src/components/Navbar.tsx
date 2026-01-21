import { faBars, faCartShopping, faUser, faXmark, faHeart, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function Navbar() {
  const { user, signOutFromFirebase, openGoogleAuthentication } = useContext(FirebaseContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for the desktop profile dropdown
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="bg-ucsd-blue text-white w-full h-12 max-h-12 p-2 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <button
          className="font-jetbrains text-xl pl-2"
          onClick={() => (window.location.href = "/products")}
        >
          Low-Price Center
        </button>

        {/* Desktop View */}
        <ul className="hidden md:flex items-center space-x-4 text-xl h-full">
          <li>
            <button
              hidden={user === null}
              onClick={() => (window.location.href = "/products")}
              className="font-inter px-4 py-1 flex items-center hover:bg-ucsd-darkblue transition-colors rounded"
            >
              <FontAwesomeIcon className="text-lg pr-2" icon={faCartShopping} />
              Products
            </button>
          </li>
          <li>
            <button
              hidden={user === null}
              onClick={() => (window.location.href = "/saved-products")}
              className="font-inter px-4 py-1 flex items-center hover:bg-ucsd-darkblue transition-colors rounded"
            >
              <FontAwesomeIcon className="text-lg pr-2" icon={faHeart} />
              Saved
            </button>
          </li>
          
          <li className="relative h-full flex items-center">
            {user ? (
              <div 
                className="relative group"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <button
                  className="font-inter px-4 py-1 flex items-center bg-transparent rounded hover:bg-ucsd-darkblue transition-colors"
                >
                  <FontAwesomeIcon className="text-lg pr-2" icon={faUser} />
                  {/* Shows actual name from Google/Firebase, or fallback */}
                  {user.displayName || "Profile"}
                  <FontAwesomeIcon className="pl-2 text-xs" icon={faChevronDown} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full w-40 bg-white text-black shadow-xl rounded-b-md py-2 z-[60]">
                    <button 
                      onClick={() => (window.location.href = "/profile")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      My Profile
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button 
                      onClick={signOutFromFirebase}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openGoogleAuthentication}
                className="font-inter px-4 py-1 flex items-center bg-transparent rounded hover:bg-ucsd-darkblue transition-colors"
              >
                <FontAwesomeIcon className="text-lg pr-2" icon={faUser} />
                Sign In
              </button>
            )}
          </li>
        </ul>

        {/* Mobile View Toggle */}
        <div className="md:hidden relative">
          <button
            ref={buttonRef}
            className="px-2.5 pt-1 hover:bg-ucsd-darkblue transition-colors rounded"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon className="text-2xl" icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content ... (existing logic remains) */}
    </>
  );
}