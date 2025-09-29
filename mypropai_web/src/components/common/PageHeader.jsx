import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import header_profile from "../../assets/home/icons/header-profile.svg";
import header_notifications from "../../assets/home/icons/header-notifications.svg";
import header_heart from "../../assets/home/icons/header-heart.svg";
import page_submenu from "../../assets/home/icons/page_submenu.svg";
import my_location from "../../assets/home/icons/my_location-icon.svg";
import mic from "../../assets/home/icons/mic-icon.svg";

const PageHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("user_token");

  const handleLogout = () => {
    localStorage.removeItem("login_user_data");
    localStorage.removeItem("user_token");
    navigate("/login");
  };

  const renderProfileDropdown = () => (
    <div className="absolute sm:right-0 left-0 mt-3 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50 ml-[-100px]">
      <p className="px-4 py-2 font-semibold">My Profile</p>
      <NavLink to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100">
        Edit Profile
      </NavLink>
      <NavLink to="/my-listing" className="block px-4 py-2 hover:bg-gray-100">
        My Listing
      </NavLink>
      <NavLink to="/my-activity" className="block px-4 py-2 hover:bg-gray-100">
        My Activity
      </NavLink>
      <NavLink
        to="/subscription-plans"
        className="block px-4 py-2 hover:bg-gray-100"
      >
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
  );

  // Menu with submenus
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Buyer", path: "/buyer" },
    { label: "Seller", path: "/seller" },
    { label: "About Us", path: "/about-us" },
  ];

  // close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-gradient-to-r from-[#1A2090E6] to-[#614498E6] w-full px-4 py-6">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-8">
        {/* Logo */}
        <div>
          <a href="/">
            <img src="/images/logo.png" alt="Logo" className="h-8 md:h-10" />
          </a>
        </div>

        {/* Search Bar (only md and larger) */}
        <div className="hidden md:flex flex-1 min-w-0 items-center bg-white rounded-full px-1 shadow-sm w-full ">
          <select className="bg-transparent border-none outline-none text-gray-700 font-medium pr-2 text-sm sm:text-base ml-2">
            <option>Buy</option>
            <option>Rent</option>
          </select>
          <input
            type="text"
            placeholder="Search location"
            className="flex-1 min-w-0 outline-none p-[15px] text-gray-700 text-sm sm:text-base"
          />
          <img src={my_location} alt="" className="h-5 w-5 sm:h-6 sm:w-6" />
          <img src={mic} alt="" className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
          <button className="bg-yellow-400 text-black font-semibold  sm:px-3 p-[10px] ml-2 rounded-full text-sm sm:text-base">
            Search
          </button>
        </div>

        {/* Mobile: Profile + Burger Menu (always both) */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Profile Icon (always show if logged in, else sign in link) */}
          {isLoggedIn ? (
            <div className="relative">
              <img
                src={header_profile}
                alt="Profile"
                className="cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && renderProfileDropdown()}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="text-white rounded-[33px] border-2 border-[#FFD300] px-4 py-2"
            >
              Sign In / Sign Up
            </NavLink>
          )}

          {/* Burger Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white flex items-center"
          >
            <span className="mr-1">Menu</span>
            <img src={page_submenu} alt="" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef} // 👈 attach ref
          className={`fixed top-0 right-0 h-full w-64 bg-[#1A2090E6] text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="px-6 py-6 space-y-4">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block font-medium hover:text-yellow-400 transition ${isActive
                        ? "border-b-2 border-yellow-400 pb-1 inline-block"
                        : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <span className="block font-medium">{item.label}</span>
                )}

                {/* Submenu */}
                {item.submenu && (
                  <div className="pl-4 mt-2 space-y-2">
                    {item.submenu.map((sub) => (
                      <NavLink
                        key={sub.label}
                        to={sub.path}
                        onClick={() => setMenuOpen(false)}
                        className="block font-normal hover:text-yellow-400 transition"
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Icons */}
            <div className="flex items-center space-x-6 pt-6 border-t border-gray-500">
              <NavLink to="/wishlist">
                <img src={header_heart} alt="Favorites" className=" cursor-pointer" />
              </NavLink>
              <NavLink to="/notifications">
                <img src={header_notifications} alt="Notifications" className=" cursor-pointer" />
              </NavLink>

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PageHeader;
