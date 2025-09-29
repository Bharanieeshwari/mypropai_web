import React, { useEffect, useRef, useState } from "react";

import { BASE_URL } from "../lib/api";
import { getAllProperties } from "../lib/property";
import Slider from "react-slick";
import { getLoginUserData } from "../utils/helpers";
import { addWishlist,deleteWishlist } from "../lib/user";

// Common files
import HomeHeader from "../components/common/HomeHeader";

import PageHeader from "../components/common/PageHeader";
import Footer from "../components/common/Footer";

// All assets
import right_arrow from "../assets/home/icons/right_arrow-icon.svg";
import heart_icon from "../assets/home/icons/heart-icon.svg";
import wishlist_icon from "../assets/home/icons/wishlist-heart.svg";
import rupee_sign_black_small from "../assets/home/icons/rupee-sign-black-small.svg";
import recent_icon from "../assets/home/icons/recent-icon.svg";
import cross_arrow from "../assets/home/icons/arrow-cross.svg";
import content_1 from "../assets/home/images/content-1.png";
import content_2a from "../assets/home/images/content-2a.png";
import content_2b from "../assets/home/images/content-2b.png";
import content_2c from "../assets/home/images/content-2c.png";
import content_4 from "../assets/home/images/content-4.png";

import arrow_left from "../assets/home/icons/arrow-left.svg";
import arrow_right from "../assets/home/icons/arrow-right.svg";

// Static images from table
import apartment from "../assets/home/images/property-type/apartment-type.png";
import villa from "../assets/home/images/property-type/villa-type.png";
import land from "../assets/home/images/property-type/land-type.png";

// Dummy images
import dummy_1 from "../assets/dummy_images/dummy_property1.png";

// ===============================
// Reusable Property Card
// ===============================
function PropertyCard({ property }) {
  const imageUrl = property.cover_image
    ? `${BASE_URL}${property.cover_image}`
    : dummy_1;

  return (
    <div
      key={property.id}
      className="bg-[#ECEAFF] p-2 rounded-[16px] shadow-sm"
    >
      <div className="relative">
        {property.is_wishlisted ? (
          <img
            src={wishlist_icon}
            alt="heart"
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => {
             try {
                const result =  deleteWishlist(property.wishlist_id);
                alert("Removed wishlist!");
                // window.location.reload(); 
              } catch (error) {
                alert("Failed to add to wishlist. Please try again.");
              }
            }}
          />
        ) : (
          <img
            src={heart_icon}
            alt="heart"
            className="absolute top-2 right-2 cursor-pointer"
            onClick={async () => {
              try {
                const result = await addWishlist(property.id);
                alert("Added to wishlist successfully!");
                window.location.reload(); 
              } catch (error) {
                alert("Failed to add to wishlist. Please try again.");
              }
            }}
          />

        )}

        <img
          src={imageUrl}
          alt={property.title || property.type || "Property"}
          className="w-full h-[200px] object-cover rounded-[16px]"
        />
      </div>


      <div className="mt-2 font-semibold text-[#36334D] flex items-center">
        <img src={rupee_sign_black_small} alt="rupee" className="mr-1" />
        {property.price}
        <span className="text-[#4B476B] text-sm font-semibold ml-1">
          ({property.price_type || "negotiable"})
        </span>
      </div>

      <div className="font-semibold text-[#36334D] text-base leading-6">
        {property.property_type || property.type}
      </div>

      <div className="text-sm text-[#36334D]">
        {property?.description || property?.desc
          ? (property.description || property.desc).slice(0, 30) +
          ((property.description || property.desc).length > 30 ? ".." : "")
          : ""}
      </div>
    </div>
  );
}

function Index() {

  const [showPageHeader, setShowPageHeader] = useState(false);
  const homeHeaderRef = useRef(null);


  const loginUserData = getLoginUserData();
  const STEP_KEY = "PropertyFormStep";
  const DATA_KEY = "PropertyFormData";
  const VERSION_KEY = "PropertyFormVersion";
  localStorage.removeItem(STEP_KEY);
  localStorage.removeItem(DATA_KEY);
  localStorage.removeItem(VERSION_KEY);
  // Custom Arrow Components
  const NextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-0 transform -translate-y-1/2
               w-10 h-10 flex items-center justify-center
               bg-[#3B3898] text-white rounded-full cursor-pointer
               z-10"
      style={{ boxShadow: "0 9px 11px 0 rgba(0, 0, 0, 0.25)" }}
    >
      <img src={arrow_right} alt="Next" className="w-5 h-5" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-0 transform -translate-y-1/2
               w-10 h-10 flex items-center justify-center
               bg-[#3B3898] text-white rounded-full cursor-pointer
               z-10"
      style={{ boxShadow: "0 9px 11px 0 rgba(0, 0, 0, 0.25)" }}
    >
      <img src={arrow_left} alt="Previous" className="w-5 h-5" />
    </div>
  );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const sliderSettings4 = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // State for real properties
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(loginUserData.user.id);
  // Fetch properties from API
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        if (loginUserData && loginUserData.user && loginUserData.user.id) {
          const response = await getAllProperties({ user_id: loginUserData.user.id });

          if (response.success) {
            setRecommendedProperties(response.properties || []);
          } else {
            setRecommendedProperties([]);
          }
        }


      } catch (error) {
        console.error("Error fetching recommended properties:", error);
        setRecommendedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  const propertyType = [
    { id: 1, type: "Apartment", image: apartment, color_code: "#D1D9EB" },
    { id: 2, type: "Villa", image: villa, color_code: "#DEE595" },
    { id: 3, type: "Land", image: land, color_code: "#C0E28D" },
    { id: 3, type: "Land", image: land, color_code: "#C0E28D" },
  ];


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowPageHeader(!entry.isIntersecting);
      },
      { threshold: 0 } // triggers when HomeHeader leaves the viewport
    );

    if (homeHeaderRef.current) {
      observer.observe(homeHeaderRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <>
      {/* Conditional Header */}
      <div ref={homeHeaderRef}>
        <HomeHeader />
      </div>
      {showPageHeader && <PageHeader />}

      <div className="max-w-[1440px] mx-auto px-2">
        {/*  Recommended Properties  */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Section*/}
          <section className="pt-12 pb-6 w-full lg:w-[75%]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[#36334D] text-2xl font-bold">
                  Recommended Properties
                </h2>
                <p className="text-[#36334D] text-base mt-1">
                  Specially for you
                </p>
              </div>
              <a
                href="property-listing"
                className="flex items-center text-base font-medium bg-gradient-to-b from-[#3B3898] to-[#5B489B] bg-clip-text text-transparent"
              >
                See all properties
                <img src={right_arrow} alt="arrow" className="ml-2 w-4 h-4" />
              </a>
            </div>
            <div className="relative mt-4">
              <Slider {...sliderSettings}>
                {recommendedProperties
                  .filter(
                    (property) => property.verification_status === "approved"
                  )
                  .map((property) => (
                    <div key={property.id} className="p-2">
                      <PropertyCard property={property} />
                    </div>
                  ))}
              </Slider>
            </div>
          </section>
          {/* Right Section */}
          <section className="py-2 lg:py-12 w-full lg:w-[25%]">
            <div className="bg-[#ECEAFF] p-4 rounded-lg">
              <div className="font-semibold text-[#36334D] mb-1">
                Recent Activities
              </div>
              <div className="flex items-center text-[#4B476B] text-sm mb-3">
                <img src={recent_icon} alt="recent" className="mr-2" />
                View all recent activities
              </div>
              <button className="bg-[#FFD300] text-[#36334D] font-semibold text-sm px-3 py-1 rounded-full">
                View All
              </button>
              <img
                src={cross_arrow}
                alt="cross-arrow"
                className="float-right mt-2"
              />
            </div>
          </section>
        </div>

        {/* All Properties */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Section - Property Types */}
          <section className="pt-12 pb-6 w-full lg:w-[75%]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[#36334D] text-2xl font-bold">
                  Apartments, Independent Houses and More
                </h2>
                <p className="text-[#36334D] text-base mt-1">
                  Dream property just away from a click
                </p>
              </div>
            </div>
            <div className="relative mt-4">
              <Slider {...sliderSettings}>
                {propertyType.map((propType) => (
                  <div key={propType.id} className="p-2">
                    <div
                      style={{ backgroundColor: propType.color_code }}
                      className="flex flex-col items-center justify-center p-4 rounded-[16px] shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <img
                        src={propType.image}
                        alt={propType.type}
                        className="w-full mb-2 rounded-[16px]"
                      />
                      <div className="font-semibold text-[#36334D] text-lg text-center">
                        {propType.type}
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </section>
          {/* Right Section */}
          <section className="py-2 lg:py-12 w-full lg:w-[25%]"></section>
        </div>

        {/* Best Properties */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section*/}
          <section className="pt-12 pb-6 w-full lg:w-[75%]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[#36334D] text-2xl font-bold">
                  Best Choice
                </h2>
                <p className="text-[#36334D] text-base mt-1">
                  Popular residences in high demand area
                </p>
              </div>
              <a
                href="property-listing"
                className="flex items-center text-base font-medium bg-gradient-to-b from-[#3B3898] to-[#5B489B] bg-clip-text text-transparent"
              >
                See all properties
                <img src={right_arrow} alt="arrow" className="ml-2 w-4 h-4" />
              </a>
            </div>

            <div className="relative mt-4">
              <Slider {...sliderSettings}>
                {recommendedProperties
                  .filter(
                    (property) => property.verification_status === "approved"
                  )
                  .map((property) => (
                    <div key={property.id} className="p-2">
                      <PropertyCard property={property} />
                    </div>
                  ))}
              </Slider>
            </div>
          </section>

          {/* Right Section */}
          <section className="py-2 lg:py-12 w-full lg:w-[25%]"></section>
        </div>

        {/* Banner section 1 */}
        <section className="bg-gradient-to-br from-[#3B3898] to-[#5D499C] text-white flex items-center gap-[100px] pl-[10px]">
          <div className="">
            <h3 className="text-4xl font-extrabold mb-4">
              Sell your property <span className="text-[#FFD300]">Faster</span>{" "}
              with
              <br />
              <span className="text-[#FFD300]">My Prop AI</span>
            </h3>
            <p className="text-white font-montserrat text-[20px] font-semibold leading-[30px] mb-3">
              Post your property @
              <span className="text-[#FFD300] font-bold"> ₹0 Cost</span>
            </p>
            <p className="mb-6 text-white font-montserrat text-[14px] font-medium leading-[21px]">
              Looking for Buyers? My Prop AI has more than 10,000+ daily active
              buyers.
              <br />
              Post your property today and get a genuine buyer.
            </p>

            <button className="bg-[#FFD300] text-[#36334D] font-semibold px-8 py-3 rounded-full shadow-lg transition-all hover:bg-yellow-400">
              Post Property Free
            </button>
          </div>
          <div>
            <img src={content_1} alt="Property illustration" className="w-80" />
          </div>
        </section>

        {/* Hot selling Properties */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section*/}
          <section className="pt-12 pb-6 w-full lg:w-[100%]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[#36334D] text-2xl font-bold">
                  Hot Selling Property
                </h2>
                <p className="text-[#36334D] text-base mt-1">
                  Hot selling property for you
                </p>
              </div>
              <a
                href="property-listing"
                className="flex items-center text-base font-medium bg-gradient-to-b from-[#3B3898] to-[#5B489B] bg-clip-text text-transparent"
              >
                See all properties
                <img src={right_arrow} alt="arrow" className="ml-2 w-4 h-4" />
              </a>
            </div>

            <div className="relative mt-4">
              <Slider {...sliderSettings4}>
                {recommendedProperties
                  .filter(
                    (property) => property.verification_status === "approved"
                  )
                  .map((property) => (
                    <div key={property.id} className="p-2">
                      <PropertyCard property={property} />
                    </div>
                  ))}
              </Slider>
            </div>
          </section>
        </div>

        {/* Banner section 2 */}
        <section className=" mt-[90px] bg-gradient-to-br from-[#3B3898] to-[#5D499C] text-white flex items-center justify-between px-16 py-6 relative ">
          {/* Left side - images */}
          <div className="grid grid-cols-2 gap-6">
            <img
              src={content_2a}
              alt="Property illustration"
              className="col-span-2 absolute -top-[60px] left-[115px]"
            />
            <img
              src={content_2b}
              alt="Property illustration"
              className="mt-[225px]"
            />
            <img src={content_2c} alt="Property illustration" className="" />
          </div>

          {/* Right side - text */}
          <div className="max-w-lg ml-16">
            <h3 className="text-4xl font-extrabold leading-snug">
              My Prop AI <br />
              <span className="text-[#FFD300]">
                Delivers Genuine Seller & Buyer
              </span>
            </h3>
          </div>
        </section>

        {/* Hot selling Properties */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section*/}
          <section className="pt-12 pb-6 w-full lg:w-[100%]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[#36334D] text-2xl font-bold">
                  Hot Selling Property
                </h2>
                <p className="text-[#36334D] text-base mt-1">
                  Hot selling property for you
                </p>
              </div>
              <a
                href="property-listing"
                className="flex items-center text-base font-medium bg-gradient-to-b from-[#3B3898] to-[#5B489B] bg-clip-text text-transparent"
              >
                See all properties
                <img src={right_arrow} alt="arrow" className="ml-2 w-4 h-4" />
              </a>
            </div>

            <div className="relative mt-4">
              <Slider {...sliderSettings4}>
                {recommendedProperties
                  .filter(
                    (property) => property.verification_status === "approved"
                  )
                  .map((property) => (
                    <div key={property.id} className="p-2">
                      <PropertyCard property={property} />
                    </div>
                  ))}
              </Slider>
            </div>
          </section>
        </div>
        {/* Banner section 3 */}
        <section className=" mt-[90px] bg-gradient-to-br from-[#3B3898] to-[#5D499C] text-white flex items-center justify-between px-16 py-6 relative ">
          {/* Right side - text */}
          <div className="max-w-lg ml-16">
            <h3 className="text-4xl font-extrabold leading-snug">
              Make Your Dream Come True With <br />
              <span className="text-[#FFD300]">My Prop AI</span>
            </h3>
          </div>
          {/* Left side - images */}
          <div className="grid grid-cols-2 gap-6">
            <img
              src={content_2a}
              alt="Property illustration"
              className="col-span-2 absolute -top-[60px] right-[390px]"
            />
            <img
              src={content_2b}
              alt="Property illustration"
              className="mt-[225px]"
            />
            <img src={content_2c} alt="Property illustration" className="" />
          </div>
        </section>

        {/* location fillter section */}

        {/* Banner section 4 */}
        <section className="bg-white  flex items-center gap-[100px] my-[30px]">
          <div className="">
            <h3 className="text-4xl font-extrabold mb-4">Post Your Property</h3>

            <p className="mb-6  font-montserrat text-[14px] font-medium leading-[21px]">
              Looking for Buyer? My Prop AI have more than 10000+ daily active
              buyers.
              <br />
              Post your property today and get a genuine buyer.
            </p>
            <p className="mb-6  font-montserrat text-[14px] font-medium leading-[21px]">
              More than 5000+ happy family fulfilled there dreams.
            </p>

            <p className=" font-montserrat text-[20px] font-semibold leading-[30px] mb-3">
              Post your property @<span className=" font-bold"> ₹0 Cost</span>
            </p>
            <button className="bg-[#FFD300] text-[#36334D] font-semibold px-8 py-3 rounded-full shadow-lg transition-all hover:bg-yellow-400">
              Post Property Free
            </button>
          </div>
          <div>
            <img src={content_4} alt="Property illustration" className="w-80" />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Index;
