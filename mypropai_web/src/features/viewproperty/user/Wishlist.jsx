import React, { useEffect, useState } from "react";
import { getLoginUserData } from "../../../utils/helpers";
import PageHeader from "../../../components/common/PageHeader";
import Footer from "../../../components/common/Footer";
import PropertyFilter from "../propertylisting/PropertyFilter";
import { BASE_URL } from "../../../lib/api";
import { getWishlist } from "../../../lib/user";

// assets
import wishlist_heart from "../../../assets/home/icons/wishlist-heart.svg";
import area_icon from "../../../assets/viewproperty/icons/area-icon.svg";
import dimensions_icon from "../../../assets/viewproperty/icons/dimensions-icon.svg";
import direction_icon from "../../../assets/viewproperty/icons/direction-icon.svg";
import dropdownopen_icon from "../../../assets/viewproperty/icons/dropdownopen-icon.svg";
import location_icon from "../../../assets/viewproperty/icons/location-icon.svg";
import sort_icon from "../../../assets/viewproperty/icons/sort-icon.svg";
import no_property from "../../../assets/viewproperty/images/no_property.png";

const PropertyListing = () => {
  const loginUserData = getLoginUserData();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getWishlist();
        console.log(response)

        const rawList = response?.data || [];

        const formatted = rawList.map((item) => {
          const p = item.property || {};
          const o = item.owner || {};
          return {
            id: p.id,
            title: p.title || "Untitled",
            price: p.price || 0,
            area: p.area || "N/A",
            dimensions: p.dimensions || "N/A",
            facing: p.facing || "N/A",
            image: p.cover_image,
            location: p.location
              ? `${p.location.city || ""}, ${p.location.state || ""}`
              : "N/A",
            verified: p.verification_status || "pending",
            postedBy: o.first_name || "Unknown",
            postedOn: item.created_at || "N/A", 
            priceType: p.price_type || "Fixed",
            rate: p.rate || "",
          };
        });

        setProperties(formatted);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const [verified, setVerified] = useState(false);


  // Reusable PropertyCard component
  const PropertyCard = ({ property }) => (
    <div className="w-full flex bg-white rounded-2xl overflow-hidden hover:shadow-lg transition h-[327px]">

      {/* Left Image */}
      <div className="relative w-1/3 min-h-[200px]">
        <img
          src={property.image ? `${BASE_URL}${property.image}` : no_property}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {property.verified && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Verified
          </span>
        )}
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <img src={wishlist_heart} alt="Save" className="cursor-pointer" />
        </button>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-[#ECEAFF]">

        <div>
          {/* Title + Location */}
          <h3 className="text-[16px] font-semibold text-[#36334D] leading-6">
            {property.title}
          </h3>
          <p className="flex items-center text-sm text-gray-500 mt-1">
            <img src={location_icon} alt="" className="w-4 h-4 mr-1" />
            {property.location}
          </p>

          {/* Price */}
          <p className="text-2xl font-bold text-gray-900 mt-3">
            ₹ {property.price.toLocaleString()} Cr
            <span className="text-sm font-normal text-gray-600 ml-1">
              ({property.priceType} price) + Registration Fee
            </span>
          </p>
          <p className="text-sm text-gray-500">1 Sq.ft / ₹ {property.rate || "N/A"}</p>

          {/* Features Section */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center text-center">
              <img src={area_icon} alt="" className="w-6 h-6 mb-1" />
              <span className="text-[13px] font-medium text-[#36334D]">{property.area}</span>
              <span className="text-xs text-gray-500">Sq.ft</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={dimensions_icon} alt="" className="w-6 h-6 mb-1" />
              <span className="text-[13px] font-medium text-[#36334D]">{property.dimensions}</span>
              <span className="text-xs text-gray-500">Dimension</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={direction_icon} alt="" className="w-6 h-6 mb-1" />
              <span className="text-[13px] font-medium text-[#36334D]">{property.facing}</span>
              <span className="text-xs text-gray-500">Facing</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 border border-gray-300 text-[#36334D] rounded-lg hover:bg-gray-100">
            View Property
          </button>
          <button className="px-4 py-2 bg-[#FFD300] text-[#36334D] font-semibold rounded-lg hover:bg-yellow-500">
            Contact Details
          </button>
        </div>
        {/* Buttons + Footer */}
        <div className="mt-5 ">

          <div className="flex justify-between text-xs text-gray-500 ">
            <p>Posted by: {property.postedBy}</p>
            <p>Posted on: {property.postedOn}</p>
          </div>
        </div>

      </div>
    </div>
  );


  return (
    <>
      {/* Header */}
      <PageHeader />

      <div className="lg:max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 ">
        {/* Sidebar Filters */}
        <PropertyFilter />

        {/* Main Content */}
        <main className="flex-1 pt-20  pb-5 ">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            {/* Breadcrumb */}
            <nav className="flex items-center text-gray-800 space-x-2">
              <span className="text-[#36334D] text-[20px] font-semibold leading-[30px]">
                Your Wishlist
              </span>

            </nav>


            {/* Right side (Sort + Toggle) */}
            <div className="flex flex-col items-end gap-2">
              {/* Sort */}
              <button className="text-sm px-3 py-1 hover:bg-gray-100 flex items-center gap-1 rounded">
                <img src={sort_icon} alt="sort" className="w-4 h-4" />
                Sort by
                <img src={dropdownopen_icon} alt="dropdown" className="w-3 h-3" />
              </button>

              {/* Hide Already Seen */}
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
          {/* Property Cards */}
          {loading ? (
            <p className="text-center text-gray-500">Loading properties...</p>
          ) : (
            <div className="flex flex-col gap-6">
              {properties.length > 0 ? (
                properties.map((property) =>
                  property.verified === "approved" ? (
                    <PropertyCard key={property.id} property={property} />
                  ) : null // skip rendering if not approved
                )
              ) : (
                <p className="text-center text-gray-500">No properties found.</p>
              )}

              {/* Optional: show message if no approved properties */}
              {properties.length > 0 && !properties.some(p => p.verified === "approved") && (
                <p className="text-center text-gray-500">No approved properties found.</p>
              )}
            </div>

          )}

          {/* Highly Recommended */}
          {/* Unapproved Properties */}
          {properties.some(p => p.verified !== "approved") && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-4">Highly Recommended</h2>
              <div className="flex flex-col gap-6">
                {properties
                  .filter(p => p.verified !== "approved") // only unapproved
                  .map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
              </div>
            </div>
          )}


          {/* Show More */}
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
