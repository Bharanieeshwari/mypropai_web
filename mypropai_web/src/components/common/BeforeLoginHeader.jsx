import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Icons
import { Menu, X } from "lucide-react"; // hamburger & close icons
import header_profile from "../../assets/home/icons/header-profile.svg";
import header_notifications from "../../assets/home/icons/header-notifications.svg";
import header_heart from "../../assets/home/icons/header-heart.svg";

const BeforeLoginHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/buyer", label: "Buyer" },
    { path: "/seller", label: "Seller" },
    { path: "/about-us", label: "About Us" },
    { path: "/login", label: "Sign In / Sign Up" },
  ];

  return (
    <header className="p-4 bg-gradient-to-r from-[#1A2090E6] to-[#614498E6]">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="ml-4 ">
          <a href="/">
            <img src="/images/logo.png" alt="Logo" className="h-10" />
          </a>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center ">
          {menuItems.map(({ path, label }) => (
           <NavLink
  key={path}
  to={path}
  className={({ isActive }) =>
    label === "Sign In / Sign Up"
      ? "text-white rounded-[33px] border-2 border-[#FFD300] pt-[6px] px-[15px] pb-[8px]"
      : `text-white font-medium hover:text-yellow-400 transition ${
          isActive ? "border-b-2 border-yellow-400 pb-1" : ""
        }`
  }
>
  {label}
</NavLink>

          ))}

      
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white mr-4"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
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

          {/* Icons */}
          <div className="flex items-center space-x-6 pt-4 border-t border-gray-500">
            <img
              src={header_heart}
              alt="Favorites"
              className="h-6 w-6 cursor-pointer"
            />
            <img
              src={header_notifications}
              alt="Notifications"
              className="h-6 w-6 cursor-pointer"
            />
            <img
              src={header_profile}
              alt="Profile"
              className="h-6 w-6 cursor-pointer"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default BeforeLoginHeader;
