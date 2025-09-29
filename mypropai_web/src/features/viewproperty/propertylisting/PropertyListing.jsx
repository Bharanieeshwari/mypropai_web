import React, { useEffect, useState } from "react";
import { getLoginUserData, isLoggedIn, maskEmail, maskPhone } from "../../../utils/helpers";
import PageHeader from "../../../components/common/PageHeader";
import Footer from "../../../components/common/Footer";
import PropertyFilter from "./PropertyFilter";
import { BASE_URL } from "../../../lib/api";
import { canUserViewContact, getAllProperties, incrementUserView } from "../../../lib/property";
import { addWishlist } from "../../../lib/user";
import {shrinkedPrice, postedDate,capitalizeFirstLetter} from "@/utils/helpers";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// assets
import heart_icon from "../../../assets/home/icons/heart-icon.svg";
import area_icon from "../../../assets/viewproperty/icons/area-icon.svg";
import dimensions_icon from "../../../assets/viewproperty/icons/dimensions-icon.svg";
import direction_icon from "../../../assets/viewproperty/icons/direction-icon.svg";
import dropdownopen_icon from "../../../assets/viewproperty/icons/dropdownopen-icon.svg";
import location_icon from "../../../assets/viewproperty/icons/location-icon.svg";
import sort_icon from "../../../assets/viewproperty/icons/sort-icon.svg";
import no_property from "../../../assets/viewproperty/images/no_property.png";
import lockicon from "../../../assets/propertydetails/lock_icon.svg";
import DialogBox from "@/components/common/DialogBox";
import { PostPropertyButton } from "@/components/PostProperty/PostFormLayout/FormSteps/BasicDetails";

const PropertyListing = () => {
  const location = useNavigate();
  const { category, propertyType } = location.state || {};

  const [user_id, setUserId] = useState(null);
  const loginUserData = getLoginUserData();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

 
  const formatProperties = (rawList) =>
    rawList.map((item) => ({
      id: item.id,
      title: item.title || "Untitled",
      price: item.price || 0,
      area: item.details?.plot_area_sqft
        ? `${item.details.plot_area_sqft} sq.ft`
        : item.area_value
          ? `${item.area_value} ${item.area_unit}`
          : "N/A",
      dimensions: item.details
        ? `${item.details.plot_length_ft} x ${item.details.plot_breadth_ft} (L × B)`
        : "N/A",
      facing: item.details?.facing || "N/A",
      image: item.cover_image || (JSON.parse(item.images || "[]")[0] || null),
      location: item.location
        ? `${item.location.locality || ""}, ${item.location.city || ""}`
        : "N/A",
      verified: item.verification_status || "pending",
      postedBy: item.owner
        ? `${item.owner.first_name} ${item.owner.last_name}`
        : "Unknown",
      postedOn: item.created_at || "N/A",
      priceType: item.price_type || "Fixed",
      rate: item.area_value || "N/A",
       first_name: item.owner.first_name,
          last_name: item.owner.last_name,
          mail: item.owner.mail,
          phone: item.owner.phone,
          email: item.owner.email,
    }));

  useEffect(() => {
    const fetchProperties = async () => {
      try {

        const response = await getAllProperties({ category, property_type: propertyType });

        const rawList = response?.properties || [];
        setProperties(formatProperties(rawList));
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

   // iuser id get
   useEffect(() => {
     const user_details = getLoginUserData();
     console.log(user_details)
     const user_data = user_details.user
     setUserId(user_data.id);
   }, []);
   
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [showContact, setShowContact] = useState(false);

  const loginUserCheck = () => {
    const loginUserData = isLoggedIn()
    if (!loginUserData) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const contactInfo = async (user_id) => {
    try {
      const { success, remaining_views } = await canUserViewContact({
        user_id,
      });
      console.log("success", success)
      console.log("remaining_views", remaining_views)
      if (!success) {
        setIsSubscribed(false);
        setShowContact(true);
        return;
      }

      if (remaining_views <= 0) {
        alert("Limit Exceeded");
        setIsSubscribed(false)
        setShowContact(true)
        return;
      }
      const increment_res = await incrementUserView({ user_id });
      if (increment_res.remaining_views >= 0) {
        setIsSubscribed(true);
        setShowContact(true);
      }
    } catch (error) {
      alert("Unexpected error occurred");
      console.error(error);
    }
  };

  const handleFilterApply = async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      const filteredList = response?.data || [];
      setProperties(formatProperties(filteredList));
    } catch (err) {
      console.error("Error fetching filtered properties:", err);
    } finally {
      setLoading(false);
    }
  };

 
  const PropertyCard = ({ property }) => (
    <div
      // onClick={() => navigate(`/property-details/${property.id}`)}
      className="w-full flex bg-white rounded-2xl overflow-hidden hover:shadow-lg transition h-[327px] cursor-pointer"
    >
      {/* Left Image */}
      <div className="relative w-1/3 min-h-[200px]">
        <img
          src={property.image ? `${BASE_URL}${property.image}` : no_property}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.verified === "approved" && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Verified
          </span>
        )}
      </div>

      {/* Right Content */}
      <div className="relative flex-1 p-5 flex flex-col justify-between bg-[#ECEAFF]">
        <div>
          <h3 className="text-[16px] font-semibold text-[#36334D] leading-6">
            {property.title}
          </h3>
          <p className="flex items-center text-sm text-gray-500 mt-1">
            <img src={location_icon} alt="" className="w-4 h-4 mr-1" />
            {property.location}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-3">
            ₹ {shrinkedPrice(property.price)}
            <span className="text-sm font-normal text-gray-600 ml-1">
              ({property.priceType} price) + Registration Fee
            </span>
          </p>
          <p className="text-sm text-gray-500">1 Sq.ft / ₹ {property.rate}</p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center space-x-1">
                <img src={area_icon} alt="" className="w-4 h-4" />
                <span className="text-xs text-gray-500">Area</span>
              </div>
              <span className="text-[13px] font-medium text-[#36334D]">
                {property.area}
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center space-x-1">
                <img src={dimensions_icon} alt="" className="w-4 h-4" />
                <span className="text-xs text-gray-500">Dimension</span>
              </div>
              <span className="text-[13px] font-medium text-[#36334D]">
                {property.dimensions}
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center space-x-1">
                <img src={direction_icon} alt="" className="w-4 h-4" />
                <span className="text-xs text-gray-500">Facing</span>
              </div>
              <span className="text-[13px] font-medium text-[#36334D]">
                {capitalizeFirstLetter(property.facing)}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={() => navigate(`/property-details/${property.id}`)}
            className="px-4 py-2 border border-[#FFD300] text-[#36334D] rounded-full"
          >
            View Property
          </button>

          <button className="px-4 py-2 bg-[#FFD300] text-[#36334D] font-semibold rounded-full hover:bg-yellow-500" onClick={(e) => {
            e.stopPropagation();
            const result = loginUserCheck();
            if (result) contactInfo(user_id);
          }}>
            Contact Details
          </button>
        </div>
        <div className="mt-5 flex justify-between text-xs text-gray-500">
          <p>Posted by: {property.postedBy}</p>
          <p>Posted on: {postedDate(property.postedOn)}</p>
        </div>

        <button className="absolute top-5 right-5">

          <img src={heart_icon} alt="heart"
            className="cursor-pointer"
            onClick={() => {
              addWishlist(property.id);

            }}
          />
        </button>
      </div>
          {/* pop up conatct modal */}
            {showContact && (
              <DialogBox isOpen={showContact} onClose={() => {setShowContact(false) }}>
                <h1 className="font-medium text-md">
                  Thank You For Showing Interest in Property.
                </h1>
      
                <div className="font-bold text-md text-[#36334D] mt-3">
                  Contact Info
                </div>
                <div className="text-sm font-medium mt-1">
                  Owner Name:
                  <span className="text-md font-medium ml-1">
                    {property.first_name}{property.last_name}
                  </span>
                </div>
      
                <div className="relative mt-3">
                  {!isSubscribed && (
                    <div className="absolute right-4 -top-5">
                      <img src={lockicon} alt="lock-upgrade-plan" />
                    </div>
                  )}
      
                  <div className={isSubscribed ? "" : "blur-[3px]"}>
                    <div className="md:flex justify-between space-x-15">
                      <div>
                        <p className="font-semibold text-md text-[#36334D]">
                          Contact Number
                        </p>
                        <p className="text-md font-medium">
                          +91{" "}
                          {isSubscribed
                            ? property.phone
                            : maskPhone(property.phone)}
                        </p>
                      </div>
      
                      <div className="border-l-2 border-dotted hidden h-10 md:block"></div>
      
                      <div className="mt-2 md:mt-0">
                        <p className="font-semibold text-md text-[#36334D]">
                          Email Id
                        </p>
                        <p className="text-md font-medium">
                          {isSubscribed
                            ? property.email
                            : maskEmail(property.email)}
                        </p>
                      </div>
                    </div>
                  </div>
      
                  {!isSubscribed && (
                    <div className="flex justify-center items-center">
                      <Button
                        type="button"
                        className={`bg-[#FFD300] font-semibold ${PostPropertyButton}`}
                      >
                        Upgrade Plan
                      </Button>
                    </div>
                  )}
                </div>
              </DialogBox>
            )}
    </div>
  );

  return (
    <>
      <PageHeader />

      <div className="lg:max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6">
        {/* 🔗 Filter communicates via onFilterApply */}
        <PropertyFilter onFilterApply={handleFilterApply} />

        <main className="flex-1 pt-20 pb-5">
          <div className="flex justify-between items-start mb-6">
            <nav className="flex items-center text-gray-800 space-x-2">
              <span className="text-[#36334D] text-[20px] font-semibold leading-[30px]">
                Buy Residential
              </span>
              <span className="text-[#FFD300]">|</span>
              <span className="text-[#36334D] text-[20px] font-semibold leading-[30px]">
                Residential Land
              </span>
              <span className="text-[#FFD300]">|</span>
              <span className="text-[#36334D] text-[20px] font-semibold leading-[30px]">
                Chennai
              </span>
            </nav>

            <div className="flex flex-col items-end gap-2">
              <button className="text-sm px-3 py-1 hover:bg-gray-100 flex items-center gap-1 rounded">
                <img src={sort_icon} alt="sort" className="w-4 h-4" />
                Sort by
                <img
                  src={dropdownopen_icon}
                  alt="dropdown"
                  className="w-3 h-3"
                />
              </button>

              <label className="flex items-center text-sm cursor-pointer gap-2">
                Hide already seen
                <button
                  onClick={() => setVerified(!verified)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${verified ? "bg-[#FFD300]" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`w-4 h-4 bg-black rounded-full shadow-md transform transition-transform duration-300 ${verified ? "translate-x-4" : "translate-x-0"
                      }`}
                  ></div>
                </button>
              </label>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading properties...</p>
          ) : (
            <div className="flex flex-col gap-6">
              {properties.length > 0 ? (
                properties
                  .filter((p) => (verified ? p.verified === "approved" : true))
                  .map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
              ) : (
                <p className="text-center text-gray-500">
                  No properties found.
                </p>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <button className="px-10 py-3 bg-[#FFD300] text-[#36334D] font-medium rounded-full hover:bg-yellow-500 transition">
              Show more
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default PropertyListing;
