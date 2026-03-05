import { useContext, useEffect, useRef, useState } from "react";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function Navbar() {
  const { user, signOutFromFirebase, openGoogleAuthentication } = useContext(FirebaseContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => setMobileMenuOpen((o) => !o);

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

  // Shared circular icon button style
  const iconBtn =
    "w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-ucsd-blue hover:border-ucsd-blue transition";

  return (
    <>
      <nav className="bg-white border-b border-gray-100 w-full h-12 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">

        {/* ── Brand ── */}
        <button
          className="font-jetbrains font-bold text-lg shrink-0"
          onClick={() => (window.location.href = "/products")}
        >
          <span className="text-ucsd-blue">Low </span>
          <span className="text-ucsd-gold">Price Center</span>
        </button>

        {/* ── Desktop centre nav links ── */}
        <ul className="hidden md:flex items-center gap-8 font-inter text-sm font-medium text-gray-600">
          <li>
            <button
              onClick={() => (window.location.href = "/products")}
              className="text-ucsd-blue font-semibold border-b-2 border-ucsd-blue pb-0.5 transition-colors"
            >
              Shop
            </button>
          </li>
          <li>
            <button
              onClick={() => (window.location.href = "/add-product")}
              className="hover:text-ucsd-blue transition-colors"
            >
              Sell
            </button>
          </li>
          <li>
            <button
              onClick={() => (window.location.href = "/student-organizations")}
              className="hover:text-ucsd-blue transition-colors"
            >
              Student Organizations
            </button>
          </li>
        </ul>

        {/* ── Desktop right icons ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Saved / Heart */}
          <button
            onClick={() => (window.location.href = "/saved-products")}
            title="Saved"
            className={iconBtn}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Cart / Products */}
          <button
            onClick={() => (window.location.href = "/products")}
            title="Products"
            className={iconBtn}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>

          {/* User avatar / Sign in */}
          {user ? (
            <button
              onClick={signOutFromFirebase}
              title="Sign Out"
              className="w-9 h-9 rounded-full bg-ucsd-blue text-white flex items-center justify-center font-jetbrains font-bold text-sm hover:brightness-90 transition"
            >
              {user.displayName?.[0]?.toUpperCase() ?? "U"}
            </button>
          ) : (
            <button
              onClick={openGoogleAuthentication}
              className="font-inter text-sm font-semibold text-ucsd-blue hover:underline px-1"
            >
              Sign In
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