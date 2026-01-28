import { faBars, faCartShopping, faUser, faXmark, faHeart, faUsers, faStore, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { FirebaseContext } from "src/utils/FirebaseProvider";

export function Navbar() {
  const { user, signOutFromFirebase, openGoogleAuthentication } = useContext(FirebaseContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStudentOrgDropdownOpen, setStudentOrgDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setStudentOrgDropdownOpen(false);
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
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="bg-ucsd-blue text-white w-full h-12 max-h-12 p-2 flex items-center justify-between sticky top-0 z-50">
        {/* Desktop View */}
        <button
          className="font-jetbrains text-xl pl-2"
          onClick={() => (window.location.href = "/products")}
        >
          Low-Price Center
        </button>
        <ul className="hidden md:flex items-center space-x-4 text-xl">
          <li>
            <button
              hidden={user === null}
              onClick={() => (window.location.href = "/products")}
              className="font-inter px-4 py-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
            >
              <FontAwesomeIcon
                className="text-lg pr-2"
                icon={faCartShopping}
                aria-label="Shopping Cart"
              />
              Products
            </button>
          </li>
          <li>
            <button
              hidden={user === null}
              onClick={() => (window.location.href = "/saved-products")}
              className="font-inter px-4 py-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
            >
              <FontAwesomeIcon
                className="text-lg pr-2"
                icon={faHeart}
                aria-label="Heart Icon"
              />
              Saved
            </button>
          </li>
          <li className="relative" ref={dropdownRef}>
            <button
              hidden={user === null}
              onClick={() => setStudentOrgDropdownOpen(!isStudentOrgDropdownOpen)}
              className="font-inter px-4 py-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors flex items-center"
            >
              <FontAwesomeIcon
                className="text-lg pr-2"
                icon={faUsers}
                aria-label="Student Organizations"
              />
              Student Organizations
              <FontAwesomeIcon
                className="text-sm pl-2"
                icon={faChevronDown}
                aria-label="Dropdown"
              />
            </button>
            {isStudentOrgDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-ucsd-blue text-white rounded-lg shadow-lg min-w-[200px] z-50">
                <button
                  onClick={() => {
                    window.location.href = "/student-org-profile";
                    setStudentOrgDropdownOpen(false);
                  }}
                  className="font-inter w-full text-left px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors flex items-center"
                >
                  <FontAwesomeIcon
                    className="text-lg pr-2"
                    icon={faUsers}
                    aria-label="My Organization"
                  />
                  My Organization
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/student-organizations";
                    setStudentOrgDropdownOpen(false);
                  }}
                  className="font-inter w-full text-left px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors flex items-center"
                >
                  <FontAwesomeIcon
                    className="text-lg pr-2"
                    icon={faStore}
                    aria-label="Browse Organizations"
                  />
                  Browse Organizations
                </button>
              </div>
            )}
          </li>
          <li>
            {user ? (
              <button
                onClick={signOutFromFirebase}
                className="font-inter px-4 py-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
              >
                <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={openGoogleAuthentication}
                className="font-inter px-4 py-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
              >
                <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
                Sign In
              </button>
            )}
          </li>
        </ul>

        {/* Mobile View */}
        <div className="md:hidden relative">
          <button
            ref={buttonRef}
            className="px-2.5 pt-1 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon className="text-2xl" icon={isMobileMenuOpen ? faXmark : faBars} />
          </button>
          <ul
            ref={menuRef}
            className={`absolute top-12 right-0.5 bg-ucsd-blue text-white text-lg shadow-lg rounded-lg w-48 p-4 
            transition-transform duration-300 ${isMobileMenuOpen ? "block" : "hidden"}`}
          >
            <li className="mb-2">
              <button
                hidden={user === null}
                onClick={() => (window.location.href = "/products")}
                className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
              >
                <FontAwesomeIcon
                  className="text-lg pr-2"
                  icon={faCartShopping}
                  aria-label="Shopping Cart"
                />
                Products
              </button>
            </li>
            <li className="mb-2">
              <button
                hidden={user === null}
                onClick={() => (window.location.href = "/saved-products")}
                className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
              >
                <FontAwesomeIcon
                  className="text-lg pr-2"
                  icon={faHeart}
                  aria-label="Heart Icon"
                />
                Saved
              </button>
            </li>
            <li className="mb-2">
              <div className="relative">
                <button
                  hidden={user === null}
                  onClick={() => setStudentOrgDropdownOpen(!isStudentOrgDropdownOpen)}
                  className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors flex items-center justify-center"
                >
                  <FontAwesomeIcon
                    className="text-lg pr-2"
                    icon={faUsers}
                    aria-label="Student Organizations"
                  />
                  Student Organizations
                  <FontAwesomeIcon
                    className="text-sm pl-2"
                    icon={faChevronDown}
                    aria-label="Dropdown"
                  />
                </button>
                {isStudentOrgDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-ucsd-blue text-white rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        window.location.href = "/student-org-profile";
                        setStudentOrgDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors flex items-center justify-center"
                    >
                      <FontAwesomeIcon
                        className="text-lg pr-2"
                        icon={faUsers}
                        aria-label="My Organization"
                      />
                      My Organization
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = "/student-organizations";
                        setStudentOrgDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors flex items-center justify-center"
                    >
                      <FontAwesomeIcon
                        className="text-lg pr-2"
                        icon={faStore}
                        aria-label="Browse Organizations"
                      />
                      Browse Organizations
                    </button>
                  </div>
                )}
              </div>
            </li>
            <li>
              {user ? (
                <button
                  onClick={signOutFromFirebase}
                  className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
                >
                  <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={openGoogleAuthentication}
                  className="font-inter w-full text-center px-4 py-2 bg-transparent border-transparent rounded hover:bg-ucsd-darkblue transition-colors"
                >
                  <FontAwesomeIcon className="text-lg pr-2" icon={faUser} aria-label="User Icon" />
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Blur Effect */}
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 cursor-default"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
