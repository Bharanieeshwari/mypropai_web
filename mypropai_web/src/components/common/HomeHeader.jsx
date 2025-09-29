import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getAllCategories, getAllPropertyType } from "@/lib/property";

// Assets
import header_profile from "../../assets/home/icons/header-profile.svg";
import header_notifications from "../../assets/home/icons/header-notifications.svg";
import header_heart from "../../assets/home/icons/header-heart.svg";
import headerBanner from "../../assets/home/images/header-banner.png";
import arrow from "../../assets/home/icons/arrow-icon.svg";
import search from "../../assets/home/icons/search-icon.svg";
import mic from "../../assets/home/icons/mic-icon.svg";
import my_location from "../../assets/home/icons/my_location-icon.svg";

const menuItems = [
  { path: "/", label: "Home" },
  { path: "/buyer", label: "Buyer" },
  { path: "/seller", label: "Seller" },
  { path: "/about-us", label: "About Us" },
];

const HomeHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("user_token");

  // Fetch categories and property types dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getAllCategories();
        const propertyTypesData = await getAllPropertyType();

        setCategories(categoriesData?.categories || []);
        setPropertyTypes(propertyTypesData?.property_types || []);

        // Pre-select first property type
        if (propertyTypesData?.property_types?.length) {
          setSelectedPropertyType(propertyTypesData.property_types[0].value);
        }

        // Pre-select first category
        if (categoriesData?.categories?.length) {
          setSelectedCategory(categoriesData.categories[0].value);
        }
      } catch (error) {
        console.error("Error fetching categories or property types:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("login_user_data");
    localStorage.removeItem("user_token");
    navigate("/login");
  };

  const renderProfileDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
      <p className="px-4 py-2 font-semibold">My Profile</p>
      <NavLink to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100">Edit Profile</NavLink>
      <NavLink to="/my-listing" className="block px-4 py-2 hover:bg-gray-100">My Listing</NavLink>
      <NavLink to="/my-activity" className="block px-4 py-2 hover:bg-gray-100">My Activity</NavLink>
      <NavLink to="/subscription-plans" className="block px-4 py-2 hover:bg-gray-100">Subscription Plans</NavLink>
      <NavLink to="/help-center" className="block px-4 py-2 hover:bg-gray-100">Help Center</NavLink>
      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Log Out</button>
    </div>
  );

const handleSearch = () => {
  if (!selectedCategory || !selectedPropertyType || !searchLocation) {
    alert("Please select category, property type, and enter location");
    return;
  }

  navigate("/property-listing", {
    state: {
      category: selectedCategory,
      propertyType: selectedPropertyType,
      location: searchLocation,
    },
  });
};


  return (
    <div className="w-full">
      <div
        className="relative w-full"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(26, 32, 144, 0.9) 0%, rgba(97, 68, 152, 0.9) 100%), url(${headerBanner})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <header className="max-w-[1440px] mx-auto flex justify-between items-center px-4 py-4 md:py-6">
          <NavLink to="/">
            <img src="/images/logo.png" alt="Logo" className="h-8 md:h-10" />
          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            {menuItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-white font-medium hover:text-yellow-400 transition ${isActive ? "border-b-2 border-yellow-400 pb-1" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <div className="flex items-center ml-6 space-x-6 relative">
                <NavLink to="/wishlist">
                  <img src={header_heart} alt="Favorites" className="cursor-pointer" />
                </NavLink>
                <img src={header_notifications} alt="Notifications" className="cursor-pointer border-r-2 border-[#FFD300] pr-4" />
                <div className="relative">
                  <img
                    src={header_profile}
                    alt="Profile"
                    className="cursor-pointer"
                    onClick={() => setProfileOpen(!profileOpen)}
                  />
                  {profileOpen && renderProfileDropdown()}
                </div>
              </div>
            ) : (
              <NavLink to="/login" className="text-white rounded-[33px] border-2 border-[#FFD300] px-4 py-2">
                Sign In / Sign Up
              </NavLink>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1A2090E6] text-white px-4 py-4 space-y-4">
            {menuItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block font-medium hover:text-yellow-400 transition ${isActive ? "border-b-2 border-yellow-400 pb-1" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center space-x-6 pt-4 border-t border-gray-500">
                <img src={header_heart} alt="Favorites" className="h-6 w-6 cursor-pointer" />
                <img src={header_notifications} alt="Notifications" className="h-6 w-6 cursor-pointer" />
                <img src={header_profile} alt="Profile" className="h-6 w-6 cursor-pointer" />
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block font-medium hover:text-yellow-400 transition"
              >
                Sign In / Sign Up
              </NavLink>
            )}
          </div>
        )}

        {/* Banner Content */}
        <section className="max-w-[1440px] mx-auto text-center px-4 md:px-0 py-10 md:py-20">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-[56px] max-w-2xl mx-auto">
            Your <span className="text-[#FFD300]">Perfect Property</span> is Just a Click Away
          </h1>

          {/* Category Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 mb-8">
            {categories.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedCategory(value)}
                className={`px-1 py-2 font-medium  transition ${selectedCategory === value ? "border-b-2 border-yellow-400 text-yellow-400"
                    : "text-white hover:text-yellow-400"
                  }`}
              >
                {label === "Sale" ? "Buy" : label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center w-full max-w-4xl mx-auto bg-white rounded-[36px] shadow-lg overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200 cursor-pointer w-full sm:w-auto justify-between">
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="text-gray-800 font-medium outline-none bg-white cursor-pointer"
              >
                {propertyTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center flex-grow px-4 py-3 ">
              <img src={search} alt="search" className="mr-2 " />
              <input
                type="text"
                placeholder='Search "location or landmark"'
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center space-x-4 px-8 py-3">
              <img src={my_location} alt="location" className=" cursor-pointer" />
              <img src={mic} alt="mic" className=" cursor-pointer" />
            </div>

            <button onClick={handleSearch} className="bg-[#FFD300] text-[#36334D] font-semibold px-6 py-3 rounded-[36px] m-1">
              Search
            </button>
          </div>

          {/* Post Property */}
          <div className="text-center mt-10">
            <p className="text-white text-sm font-semibold mb-4">
              Do you have a Property? Post your property for free
            </p>
            <button
              onClick={() => navigate("/postproperty")}
              className="text-[#FFD300] border-2 border-[#FFD300] rounded-[30px] px-6 py-2 hover:bg-yellow-50 transition"
            >
              Post Property
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeHeader;
