import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function Navbar() {
  const { user, signOutFromFirebase, openGoogleAuthentication } = useContext(FirebaseContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen((o) => !o);
  const iconBtn =
    "w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-ucsd-blue hover:border-ucsd-blue transition";

  const handleIconClick = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      openGoogleAuthentication();
    }
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
      if (window.matchMedia("(min-width: 768px)").matches) setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const tabStyling = "text-gray-400 hover:text-gray-800";
  const selectedTabStyling = "text-ucsd-blue";

  return (
    <>
      <nav className="font-rubik shadow-md shadow-ucsd-blue bg-white c left-0 right-0 min-w-0 mx-12 rounded-b-lg h-12 max-h-12 px-6 py-10 flex items-center justify-between fixed top-0 z-50">
        {/* Desktop View */}
        <button
          className="text-lg font-semibold"
          onClick={() => (window.location.href = "/products")}
        >
          <span className="text-3xl text-ucsd-blue">Low </span>
          <span className="text-3xl text-ucsd-gold">Price Center</span>
        </button>
        <div className="hidden md:flex flex-row gap-6 items-center justify-center">
          {[
            { label: "Shop", path: "/products" },
            { label: "Sell", path: "/add-product" },
            { label: "Student Organizations", path: "/student-organizations" },
          ].map((val) => (
            <button
              key={val.label}
              className={`font-inter text-sm ${window.location.pathname === val.path ? selectedTabStyling : tabStyling} transition-colors`}
              onClick={() => handleIconClick(val.path)}
            >
              {val.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => handleIconClick("/saved-products")}
            title="Saved"
            aria-label="Saved products"
            className={iconBtn}
          >
            <FontAwesomeIcon icon={faHeart} className="text-[16px]" />
          </button>

          <button
            onClick={() => handleIconClick("/messages")}
            title="Messages"
            aria-label="Messages"
            className={iconBtn}
          >
            <FontAwesomeIcon icon={faComment} className="text-[16px]" />
          </button>

          {user ? (
            <div
              className="relative ml-2"
              onMouseEnter={() => setIsProfileDropdownOpen(true)}
              onMouseLeave={() => setIsProfileDropdownOpen(false)}
            >
              <button
                title="Profile"
                className="w-9 h-9 rounded-full bg-ucsd-blue text-white flex items-center justify-center font-jetbrains font-bold text-sm hover:brightness-90 transition"
              >
                {user.displayName?.[0]?.toUpperCase() ?? "U"}
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full w-40 bg-white text-black shadow-lg rounded-lg py-2 z-[60]">
                  <a
                    href="/profile"
                    className="block w-full text-left px-4 py-2 text-sm font-inter hover:bg-gray-100 transition-colors"
                  >
                    My Profile
                  </a>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={signOutFromFirebase}
                    className="w-full text-left px-4 py-2 text-sm font-inter hover:bg-red-50 text-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openGoogleAuthentication}
              className="ml-2 font-inter text-sm font-semibold text-ucsd-blue hover:underline px-1"
            >
              Log In
            </button>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <div className="md:hidden relative">
          <button
            ref={buttonRef}
            className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition text-gray-600"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon className="text-xl" icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>

          <ul
            ref={menuRef}
            className={`absolute top-11 right-0 bg-white border border-gray-100 shadow-lg rounded-xl w-52 p-3 text-sm font-inter font-medium text-gray-700
              transition-all duration-200 ${isMobileMenuOpen ? "block" : "hidden"}`}
          >
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/marketplace")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-ucsd-blue font-semibold transition"
              >
                Shop
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/add-product")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Sell
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/student-organizations")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Student Organizations
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/saved-products")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Saved
              </button>
            </li>
            <li className="mb-1">
              <button
                onClick={() => (window.location.href = "/products")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Products
              </button>
            </li>
            <li className="border-t border-gray-100 mt-1 pt-1">
              {user ? (
                <button
                  onClick={signOutFromFirebase}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition text-red-500"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={openGoogleAuthentication}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition text-ucsd-blue font-semibold"
                >
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 cursor-default"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
