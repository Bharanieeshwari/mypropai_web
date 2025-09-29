import React, { useState, useEffect } from "react";
import refresh_icon from "../../../assets/viewproperty/icons/refresh-icon.svg";
import tick_icon from "../../../assets/viewproperty/icons/tick-icon.svg";
import { useLocation } from "react-router-dom";

const PropertyFilter = ({ onFilterApply }) => {

  const location = useLocation();
  const { category, propertyType, location: city } = location.state || {};


  // Separate state for price
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000000);

  // Separate state for area
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState(10000);

  const [verified, setVerified] = useState(false);

  const residentialOptions = [
    "Independent House/ Villa",
    "Residential Apartment",
    "Residential Plot",
    "Farm House",
    "1 RK/ Studio Apartment",
    "Service Apartment",
  ];
  const facingOptions = ["East", "West", "North", "South"];
  const postedByOptions = ["Owner", "Agent", "Builder"];
  const registrationFeeOptions = ["Yes", "No"];

  const [selectedResidential, setSelectedResidential] = useState("");
  const [selectedFacing, setSelectedFacing] = useState([]);
  const [selectedPostedBy, setSelectedPostedBy] = useState([]);
  const [selectedRegFee, setSelectedRegFee] = useState([]);

  const toggleOption = (value, setter, state) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (selectedResidential) params.append("property_types", selectedResidential);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    if (verified) params.append("verified", "true");
    if (selectedFacing.length > 0) params.append("facing", selectedFacing.join(","));
    if (selectedPostedBy.length > 0) params.append("posted_by", selectedPostedBy.join(","));
    if (selectedRegFee.length > 0) params.append("registration_fee", selectedRegFee.join(","));
    if (minArea) params.append("min_area", minArea);
    if (maxArea) params.append("max_area", maxArea);

    params.append("categories", "Sale");
    params.append("cities", "Chennai Region");

    return `/api/properties/filter/?${params.toString()}`;
  };

  const clearFilters = () => {
    setSelectedResidential("");
    setSelectedFacing([]);
    setSelectedPostedBy([]);
    setSelectedRegFee([]);
    setMinPrice(0);
    setMaxPrice(500000000);
    setMinArea(0);
    setMaxArea(10000);
    setVerified(false);
    // onFilterApply("/api/properties/filter/"); // reset call
  };

  useEffect(() => {
    const url = buildQuery();
    // onFilterApply(url);

     if (propertyType && residentialOptions.includes(propertyType)) {
    setSelectedResidential(propertyType);
  }
  }, [
    selectedResidential,
    selectedFacing,
    selectedPostedBy,
    selectedRegFee,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    verified,
    propertyType,
  ]);

  return (
    <aside className="w-full lg:w-1/4 bg-[#ECEAFF] pt-20 px-5 pb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">Filters</h2>
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-[#36334D] hover:underline"
        >
          Clear All
          <img src={refresh_icon} alt="Clear Filters" className="w-4 h-4" />
        </button>
      </div>

      {/* Applied Filters */}
      <div className="mb-6">
        <h3 className="text-[18px] font-medium leading-[27px] text-[#36334D] mb-2">Applied Filters</h3>
        <div className="flex flex-wrap gap-2">
          {/* Residential Type */}
          {selectedResidential && (
            <span className="px-3 py-1 bg-[#FFE66C] text-[#0E0D10] font-[Montserrat] text-[14px] font-normal leading-[21px] rounded-[15px] flex items-center gap-1">
              <img src={tick_icon} alt="" className="w-3 h-3" />
              {selectedResidential}
            </span>
          )}

          {/* Facing */}
          {selectedFacing.map((dir) => (
            <span key={dir} className="px-3 py-1 bg-[#FFE66C] text-[#0E0D10] font-[Montserrat] text-[14px] font-normal leading-[21px] rounded-[15px] flex items-center gap-1">
              <img src={tick_icon} alt="" className="w-3 h-3" />
              {dir}
            </span>
          ))}

          {/* Posted By */}
          {selectedPostedBy.map((p) => (
            <span key={p} className="px-3 py-1 bg-[#FFE66C] text-[#0E0D10] font-[Montserrat] text-[14px] font-normal leading-[21px] rounded-[15px] flex items-center gap-1">
              <img src={tick_icon} alt="" className="w-3 h-3" />
              {p}
            </span>
          ))}

          {/* Registration Fee */}
          {selectedRegFee.map((r) => (
            <span key={r} className="px-3 py-1 bg-[#FFE66C] text-[#0E0D10] font-[Montserrat] text-[14px] font-normal leading-[21px] rounded-[15px] flex items-center gap-1">
              <img src={tick_icon} alt="" className="w-3 h-3" />
              {r}
            </span>
          ))}

          {/* Verified */}
          {verified && (
            <span className="px-3 py-1 bg-[#FFE66C] text-[#0E0D10] font-[Montserrat] text-[14px] font-normal leading-[21px] rounded-[15px] flex items-center gap-1">
              <img src={tick_icon} alt="" className="w-3 h-3" />
              Verified
            </span>
          )}

          {/* Budget */}
          {(minPrice > 0 || maxPrice < 500000000) && (
            <span className="px-3 py-1 bg-[#FFE66C] text-[#0E0D10] font-[Montserrat] text-[14px] font-normal leading-[21px] rounded-[15px] flex items-center gap-1">
              <img src={tick_icon} alt="" className="w-3 h-3" />
              ₹{minPrice / 100000}L - {maxPrice >= 500000000 ? "50+ Cr" : maxPrice / 10000000 + "Cr"}
            </span>
          )}

          {/* Area */}
          {(minArea > 0 || maxArea < 10000) && (
            <span className="px-3 py-1 bg-[#FFE66C] text-[#0E0D10] font-[Montserrat] text-[14px] font-normal leading-[21px] rounded-[15px] flex items-center gap-1">
              <img src={tick_icon} alt="" className="w-3 h-3" />
              {minArea} - {maxArea >= 10000 ? "10k+ sqft" : `${maxArea} sqft`}
            </span>
          )}
        </div>
      </div>


      {/* Budget */}
      <div className="mb-6">
        <h3 className="text-[18px] font-medium leading-[27px] text-[#36334D] mb-2">Budget</h3>
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full"
            style={{
              left: `${(minPrice / 500000000) * 100}%`,
              right: `${100 - (maxPrice / 500000000) * 100}%`,
            }}
          ></div>
          <input
            type="range"
            min="0"
            max="500000000"
            step="100000"
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000000))}
            className="absolute w-full h-2 bg-transparent appearance-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
          />
          <input
            type="range"
            min="0"
            max="500000000"
            step="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000000))}
            className="absolute w-full h-2 bg-transparent appearance-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
          />
        </div>
        <div className="flex justify-between text-xs text-[#36334D] mt-3">
          <span>
            Min{" "}
            <span className="px-2 py-1 bg-white rounded-[4px] text-[#0E0D10] text-center text-[12px] font-medium leading-[18px]">
              ₹{minPrice / 100000}L
            </span>
          </span>
          <span>
            Max{" "}
            <span className="px-2 py-1 bg-white rounded-[4px] text-[#0E0D10] text-center text-[12px] font-medium leading-[18px]">
              {maxPrice >= 500000000 ? "50+ Cr" : maxPrice / 10000000 + "Cr"}
            </span>
          </span>
        </div>
      </div>

      {/* Verified */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[18px] font-medium leading-[27px] text-[#36334D]">Verified Properties</h3>
          <button
            onClick={() => setVerified(!verified)}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${verified ? "bg-yellow-400" : "bg-gray-300"
              }`}
          >
            <div
              className={`w-4 h-4 bg-black rounded-full shadow-md transform transition-transform duration-300 ${verified ? "translate-x-4" : "translate-x-0"
                }`}
            ></div>
          </button>
        </div>
        <p className="text-[#4B476B] text-[14px] font-normal leading-[21px] tracking-[0.14px]">
          Enable toggle button only shown verified properties by MY Prop AI
        </p>
      </div>

      {/* Residential Type */}
      <div className="mb-6">
        <h3 className="text-[18px] font-medium leading-[27px] text-[#36334D] mb-3">Residential Type</h3>
        <div>
          {residentialOptions.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedResidential(type)}
              className={`mb-2 flex items-center gap-2 px-3 py-1 rounded-full border text-[14px] leading-[21px] font-medium transition-colors ${selectedResidential === type
                  ? "bg-yellow-300 text-[#0E0D10] border-yellow-300"
                  : "bg-white text-[#4B476B] border-gray-200 hover:border-gray-400"
                }`}
            >
              {selectedResidential === type ? (
                <img src={tick_icon} alt="selected" className="w-3 h-3" />
              ) : (
                <span className="text-lg">+</span>
              )}
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Area (sqft) */}
      <div className="mb-6">
        <h3 className="text-[18px] font-medium text-[#36334D] mb-2">
          Area sqft
        </h3>
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full"
            style={{
              left: `${(minArea / 10000) * 100}%`,
              right: `${100 - (maxArea / 10000) * 100}%`,
            }}
          ></div>
          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={minArea}
            onChange={(e) => setMinArea(Math.min(Number(e.target.value), maxArea - 50))}
            className="absolute w-full h-2 bg-transparent appearance-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
          />
          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={maxArea}
            onChange={(e) => setMaxArea(Math.max(Number(e.target.value), minArea + 50))}
            className="absolute w-full h-2 bg-transparent appearance-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
          />
        </div>
        <div className="flex justify-between text-xs text-[#36334D] mt-3">
          <span>
            Min{" "}
            <span className="px-2 py-1 bg-white rounded text-[12px] font-medium">
              {minArea} sqft
            </span>
          </span>
          <span>
            Max{" "}
            <span className="px-2 py-1 bg-white rounded text-[12px] font-medium">
              {maxArea >= 10000 ? "10k+ sqft" : `${maxArea} sqft`}
            </span>
          </span>
        </div>
      </div>

      {/* Facing */}
      <div className="mb-6">
        <h3 className="text-[18px] font-medium leading-[27px] text-[#36334D] mb-3">Facing</h3>
        <div className="flex flex-wrap gap-2">
          {facingOptions.map((dir) => (
            <button
              key={dir}
              onClick={() => toggleOption(dir, setSelectedFacing, selectedFacing)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[14px] leading-[21px] font-medium transition-colors ${selectedFacing.includes(dir)
                  ? "bg-yellow-300 text-[#0E0D10] border-yellow-300"
                  : "bg-white text-[#4B476B] border-gray-200 hover:border-gray-400"
                }`}
            >
              {selectedFacing.includes(dir) ? (
                <img src={tick_icon} alt="selected" className="w-3 h-3" />
              ) : (
                <span className="text-lg">+</span>
              )}
              {dir}
            </button>
          ))}
        </div>
      </div>

      {/* Posted By */}
      <div className="mb-6">
        <h3 className="text-[18px] font-medium leading-[27px] text-[#36334D] mb-3">Posted By</h3>
        <div className="flex flex-wrap gap-2">
          {postedByOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption(option, setSelectedPostedBy, selectedPostedBy)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[14px] leading-[21px] font-medium transition-colors ${selectedPostedBy.includes(option)
                  ? "bg-yellow-300 text-[#0E0D10] border-yellow-300"
                  : "bg-white text-[#4B476B] border-gray-200 hover:border-gray-400"
                }`}
            >
              {selectedPostedBy.includes(option) ? (
                <img src={tick_icon} alt="selected" className="w-3 h-3" />
              ) : (
                <span className="text-lg">+</span>
              )}
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Registration Fee */}
      <div className="mb-6">
        <h3 className="text-[18px] font-medium leading-[27px] text-[#36334D] mb-3">Registration Fee</h3>
        <div className="flex flex-wrap gap-2">
          {registrationFeeOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption(option, setSelectedRegFee, selectedRegFee)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[14px] leading-[21px] font-medium transition-colors ${selectedRegFee.includes(option)
                  ? "bg-yellow-300 text-[#0E0D10] border-yellow-300"
                  : "bg-white text-[#4B476B] border-gray-200 hover:border-gray-400"
                }`}
            >
              {selectedRegFee.includes(option) ? (
                <img src={tick_icon} alt="selected" className="w-3 h-3" />
              ) : (
                <span className="text-lg">+</span>
              )}
              {option}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default PropertyFilter;
