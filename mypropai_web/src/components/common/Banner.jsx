import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import headerBanner from "../../assets/home/images/header-banner.png";
import arrow from "../../assets/home/icons/arrow-icon.svg";
import search from "../../assets/home/icons/search-icon.svg";
import mic from "../../assets/home/icons/mic-icon.svg";
import my_location from "../../assets/home/icons/my_location-icon.svg";

const Banner = () => {
  const [type] = useState("All Residential");
  const navigate = useNavigate();



  return (
    <div
      className="p-4 pl-0 pr-0"
      style={{
        background: `linear-gradient(90deg, rgba(26, 32, 144, 0.90) 0%, rgba(97, 68, 152, 0.90) 100%), url(${headerBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
  
      {/* Banner Heading */}
      <h1 className="text-white text-center text-[40px] font-bold leading-[56px] w-[474px] mx-auto mt-[70px] mb-[40px]">
        Your{" "}
        <span className="text-[#FFD300] text-[40px] font-extrabold">
          Perfect Property
        </span>{" "}
        is Just a Click Away
      </h1>

      {/* Category Links */}
      <div className="space-x-8 text-center mb-6">
        {[
          { path: "/Buy", label: "Buy" },
          { path: "/Rent", label: "Rent" },
          { path: "/Commercial", label: "Commercial" },
          { path: "/Co-Working", label: "Co-Working" },
        ].map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `text-white ${isActive ? "border-b-2 border-yellow-400 pb-1" : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex items-center w-full max-w-4xl bg-white rounded-[36px] shadow-[0_-4px_12px_rgba(0,0,0,0.15),0_8px_12px_rgba(0,0,0,0.15)] overflow-hidden mx-auto">
        {/* Dropdown */}
        <div className="flex items-center px-4 py-3 border-r border-gray-200 cursor-pointer">
          <span className="text-gray-800 font-medium">{type}</span>
          <img src={arrow} alt="arrow" className="ml-2 w-4 h-4" />
        </div>

        {/* Input */}
        <div className="flex items-center flex-grow px-4">
          <img src={search} alt="search" className="text-gray-400 mr-2 w-5 h-5" />
          <input
            type="text"
            placeholder='Search "location or landmark"'
            className="flex-grow outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Location & Mic */}
        <div className="flex items-center space-x-4 px-4">
          <img src={my_location} alt="location" className="w-5 h-5 cursor-pointer" />
          <img src={mic} alt="mic" className="w-5 h-5 cursor-pointer" />
        </div>

        {/* Search button */}
        <button className="bg-[#FFD300] text-[#36334D] font-semibold px-6 py-3 rounded-[36px] m-1">
          Search
        </button>
      </div>

      <div className="text-center mb-15">
        <p className="text-white text-center font-montserrat text-[14px] font-semibold leading-[21px] mb-7">
          Do you have a Property? Post your property for free
        </p>

        <button
        onClick={() => navigate("/postproperty")}
          className="text-center text-[#FFD300] rounded-[30px] border-[2.5px] border-[#FFD300] pt-[10px] px-[22px] pb-[10px]"
        >
          Post Property
        </button>
      </div>
    </div>
  );
};

export default Banner;
