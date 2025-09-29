import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Menu, X, MapPin, Mic } from "lucide-react";

import header_profile from "../../assets/home/icons/header-profile.svg";
import header_notifications from "../../assets/home/icons/header-notifications.svg";
import header_heart from "../../assets/home/icons/header-heart.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/buyer", label: "Buyer" },
    { path: "/seller", label: "Seller" },
    { path: "/about-us", label: "About Us" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("user_token") || Cookies.get("user_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    Cookies.remove("user_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-[#1A2090E6] to-[#614498E6] w-full p-4 relative">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="ml-4 md:ml-0">
          <NavLink to="/">
            <img src="/images/logo.png" alt="Logo" className="h-10" />
          </NavLink>
        </div>

        {/* Search Bar */}
        {!isLoggedIn && (
          <div className="flex flex-1 mx-4 md:mx-10 items-center bg-white rounded-full h-10 px-4 shadow-sm">
            <select className="bg-transparent border-none outline-none text-gray-700 font-medium pr-2">
              <option>Buy</option>
              <option>Rent</option>
            </select>
            <input
              type="text"
              placeholder="Search location"
              className="flex-1 outline-none px-2 text-gray-700"
            />
            <MapPin className="text-gray-400 mr-2" size={18} />
            <Mic className="text-gray-400 mr-2" size={18} />
            <button className="bg-yellow-400 text-black font-semibold px-4 py-1 rounded-full">
              Search
            </button>
          </div>
        )}

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {menuItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `text-white font-medium hover:text-yellow-400 transition ${
                  isActive ? "border-b-2 border-yellow-400 pb-1" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Login / Profile */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-6 relative">
              <img src={header_heart} alt="Favorites" className="cursor-pointer" />
              <img
                src={header_notifications}
                alt="Notifications"
                className="cursor-pointer border-r-2 border-[#FFD300] pr-4"
              />
              <div className="relative">
                <img
                  src={header_profile}
                  alt="Profile"
                  className="cursor-pointer"
                  onClick={() => setProfileOpen(!profileOpen)}
                />
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                    <p className="px-4 py-2 font-semibold">My Profile</p>
                    <NavLink to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100">
                      Edit Profile
                    </NavLink>
                    <NavLink to="/my-listing" className="block px-4 py-2 hover:bg-gray-100">
                      My Listing
                    </NavLink>
                    <NavLink to="/activity" className="block px-4 py-2 hover:bg-gray-100">
                      My Activity
                    </NavLink>
                    <NavLink to="/subscription-plans" className="block px-4 py-2 hover:bg-gray-100">
                      Subscription Plans
                    </NavLink>
                    <NavLink to="/help-center" className="block px-4 py-2 hover:bg-gray-100">
                      Help Center
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="text-black bg-yellow-400 rounded-full px-4 py-1 font-medium"
            >
              Sign In / Sign Up
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white ml-4"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A2090E6] text-white mt-2 px-6 py-4 space-y-4 rounded-xl shadow-lg">
          {menuItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block font-medium hover:text-yellow-400 transition ${
                  isActive ? "border-b-2 border-yellow-400 pb-1 inline-block" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className="block bg-yellow-400 text-black font-medium px-4 py-1 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Sign In / Sign Up
            </NavLink>
          ) : (
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-500">
              <img src={header_heart} alt="Favorites" className="h-6 w-6 cursor-pointer" />
              <img
                src={header_notifications}
                alt="Notifications"
                className="h-6 w-6 cursor-pointer"
              />
              <img
                src={header_profile}
                alt="Profile"
                className="h-6 w-6 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
