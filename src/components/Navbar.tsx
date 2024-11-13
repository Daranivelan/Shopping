import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../utils/Routes";
import { logout } from "../core/services/AuthService";
import { AuthContext } from "../store/AuthContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return (
    <nav className="bg-yellow-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">E-Shop</h1>
          </div>

          {/* Main Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to={routes.home}
              className="text-black hover:underline font-semibold"
            >
              Home
            </Link>

            <Link
              to={routes.cart}
              className="text-black hover:underline font-semibold"
            >
              Cart
            </Link>
            {user && (
              <Link
                to={routes.history}
                className="text-black hover:underline font-semibold"
              >
                History
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-black text-yellow-500 font-semibold p-1 px-2 rounded-md hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link
                to={routes.login}
                className="bg-black text-yellow-500 font-semibold p-1 px-2 rounded-md hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    !isOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"
                  }
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to={routes.home}
              className="block text-black hover:text-gray-700 font-semibold"
            >
              Home
            </Link>
            <Link
              to={routes.cart}
              className="block text-black hover:text-gray-700 font-semibold"
            >
              Cart
            </Link>
            <Link
              to={routes.history}
              className="block text-black hover:text-gray-700 font-semibold"
            >
              History
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-black text-yellow-500 font-semibold p-1 px-2 rounded-md hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link
                to={routes.login}
                className="bg-black text-yellow-500 font-semibold p-1 px-2 rounded-md hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
