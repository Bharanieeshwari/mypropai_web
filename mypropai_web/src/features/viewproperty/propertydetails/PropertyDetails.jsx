import React, { useEffect, useRef, useState } from "react";
import SquareFeet from "../../../assets/propertydetails/sqaure-feet-icon.svg";
import dimension from "../../../assets/propertydetails/dimension-icon.svg";

import facing from "../../../assets/propertydetails/facing-icon.svg";
import roadsize from "../../../assets/propertydetails/roadsize-icon.svg";
import approval from "../../../assets/propertydetails/approval-icon.svg";
import frontage from "../../../assets/propertydetails/frontage-icon.svg";
import { Button } from "@/components/ui/button";
import { PostPropertyButton } from "@/components/PostProperty/PostFormLayout/FormSteps/BasicDetails";
import tick from "../../../assets/propertydetails/tick-green-icon.svg";
import { Check } from "lucide-react";
import ownerprofile from "../../../assets/propertydetails/default-profile-icon.jpg";
import { useParams } from "react-router-dom";
import profileviewed from "../../../assets/propertydetails/profile-viewed-icon.svg";
import uncheckedwishlist from "../../../assets/propertydetails/wishlist-heart-hollow.svg";
import wishlist from "../../../assets/propertydetails/wishlist-red-heart.svg";
import telephone from "../../../assets/propertydetails/telephone-icon.svg";
import Slider from "react-slick";
import AfterLoginHeader from "@/components/common/AfterLoginHeader";
import verified from "../../../assets/propertydetails/verified-icon.svg";
import zoomarrow from "../../../assets/propertydetails/zoom-image-icon.svg";
import { IoMdClose } from "react-icons/io";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
  FaLandmark,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { BASE_URL } from "../../../lib/api";
import {
  getPropertyById,
  incrementUserView,
  getAllProperties,
} from "@/lib/property";
// default image
import defaultimage from "../../../assets/userlisting/image/default-preview.png";
import lockicon from "../../../assets/propertydetails/lock_icon.svg";

// api
import { canUserViewContact } from "@/lib/property";
// recommended property
import right_arrow from "../../../assets/home/icons/right_arrow-icon.svg";
import heart_icon from "../../../assets/home/icons/heart-icon.svg";
import rupee_sign_black_small from "../../../assets/home/icons/rupee-sign-black-small.svg";
import dummy_1 from "../../../assets/dummy_images/dummy_property1.png";

//common utils
import { maskPhone, maskEmail, isLoggedIn, shrinkedPrice, postedDate, capitalizeFirstLetter, compressedDescription, getLoginUserData } from "@/utils/helpers";
import DialogBox from "@/components/common/DialogBox";

// helpers 


const PropertyDetials = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  // States
  const [user_id, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [checked, setChecked] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [showAllPreview, setShowAllPreview] = useState(false);
  const sliderRef = useRef(null);
  // get property by id

  const ADMIN_TOKEN_KEY = "admin_token";

  useEffect(() => {
    const fetchProperty = async () => {
      if (propertyId) {
        try {
          const response = await getPropertyById({ propertyId });
          setProperty(response.data.property);
        } catch (error) {
          console.error("Error fetching property:", error);
        }
      } else {
        console.log("No Property found");
      }
    };
    fetchProperty();
  }, [propertyId]);

  // popups
  useEffect(() => {
    if (isOpen || showContact) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, showContact]);

  //  Fetch properties from API
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await getAllProperties({
          // page: 1,
          // page_size: 3,
        });

        if (response.success) {
          setRecommendedProperties(response.properties || []);
        } else {
          setRecommendedProperties([]);
        }
      } catch (error) {
        console.error("Error fetching recommended properties:", error);
        setRecommendedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [setLoading]);

  // iuser id get
  useEffect(() => {
    const user_details = getLoginUserData();
    const user_data = user_details.user
    setUserId(user_data.id);
  }, []);
  const nearByFacility = [
    "Within 200 M Adayar main bus stand",
    "Within 200 M Adayar main bus stand",
    "More than 25 + Grocery shop within 500 M",
    "Within 200 M Adayar main bus stand",
    "More than 25 + Grocery shop within 500 M",
    "Within 200 M Adayar main bus stand",
    "More than 25 + Grocery shop within 500 M",
    "Within 200 M Adayar main bus stand",
    "More than 25 + Grocery shop within 500 M",
  ];

  const zoomImage = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!property) {
    return (
      <>
        {loading && (
          <div className="fixed inset-0 flex items-start justify-center  bg-[#2B2A36CC]/70  z-50 p-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </>
    );
  }

  const imagesArray = property?.images
    ? Array.isArray(property.images)
      ? property.images
      : JSON.parse(property.images)
    : [];

  const videoArray = property?.videos
    ? Array.isArray(property.videos)
      ? property.images
      : JSON.parse(property.videos)
    : [];

  // api

  const contactInfo = async () => {
    try {
      const { success, remaining_views } = await canUserViewContact({
        user_id,
      });
      console.log("remaining_views", remaining_views)
      if (!success) {
        setIsSubscribed(false);
        setShowContact(true);
        return;
      }

      if (remaining_views <= 0) {
        alert("Limit Exceeded");
        setIsSubscribed(false);
        setShowContact(true);
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

  const closeContactPopup = () => {
    setShowContact(false);
  };

  const loginUserCheck = () => {
    const loginUserData = isLoggedIn()
    if (!loginUserData) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const propertyDetails = [
    {
      icon: SquareFeet,
      label: "Sq.ft",
      value: property?.details?.plot_area_sqft ?? "-",
    },
    {
      icon: dimension,
      label: "Dimension",
      value:
        property?.details?.plot_length_ft && property?.details?.plot_breadth_ft
          ? `${property.details.plot_length_ft} x ${property.details.plot_breadth_ft} (L x B)`
          : "-",
    },
    {
      icon: facing,
      label: "Facing",
      value: property?.details?.facing
        ? property.details.facing.charAt(0).toUpperCase() +
        property.details.facing.slice(1)
        : "-",
    },
    {
      icon: roadsize,
      label: "Road Size",
      value: property?.details?.road_size_sqft
        ? `${property.details.road_size_sqft} Feet Road`
        : "-",
    },
    {
      icon: approval,
      label: "Approval",
      value: property?.details?.approval_status
        ? property.details.approval_status.charAt(0).toUpperCase() +
        property.details.approval_status.slice(1)
        : "-",
    },
    {
      icon: frontage,
      label: "Frontage",
      value: property?.frontage ?? "-",
    },
  ];
  const mediaArray = [
    ...imagesArray.map((img) => ({ type: "image", url: img })),
    ...videoArray.map((vid) => ({ type: "video", url: vid })),
  ];
  // slider for recommended property
  const NextArrowSlider = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        className="absolute top-1/2 right-[-50px] transform -translate-y-1/2 
                 w-10 h-10 flex items-center justify-center 
                 bg-[#3B3898] text-white rounded-full cursor-pointer shadow-md z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    );
  };
  const PrevArrowSlider = ({ onClick }) => {
    return (
      <div
        onClick={onClick}
        className="absolute top-1/2 left-[-50px] transform -translate-y-1/2 
                 w-10 h-10 flex items-center justify-center 
                 bg-[#3B3898] text-white rounded-full cursor-pointer shadow-md z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
    );
  };

  // pop up slider

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrowSlider />,
    nextArrow: <NextArrowSlider />,
  };
  const cardSetting = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnDotsHover: true,
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrowSlider />,
    prevArrow: <PrevArrowSlider />,
  };
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted == true) {
      alert("Added to Wishlist");
    } else {
      alert("removed from Wishlist");
    }
  };

  return (
    <>
      <style>
        {`
        /* Dots styling */
        .dot-slider .slick-dots,
        .dot-slider-zoom .slick-dots {
          position: absolute;
          bottom: 25px; /* adjust as needed */
        }

        .dot-slider .slick-dots li button:before,
        .dot-slider-zoom .slick-dots li button:before {
          color: white;
          font-size: 12px;
        }

        .dot-slider .slick-dots li.slick-active button:before,
        .dot-slider-zoom .slick-dots li.slick-active button:before {
          color: #3b82f6; /* active dot color */
        }

        /* Arrows styling */
        .dot-slider .slick-prev:before,
        .dot-slider .slick-next:before,
        .dot-slider-zoom .slick-prev:before,
        .dot-slider-zoom .slick-next:before {
          font-size: 25px;
          color: white;
        }

        /* Position arrows if needed */
        .dot-slider .slick-prev,
        .dot-slider-zoom .slick-prev {
          left: -30px; /* adjust left position */
        }

        .dot-slider .slick-next,
        .dot-slider-zoom .slick-next {
          right: -30px; /* adjust right position */
        }

        /* Hide arrows if you want them hidden */
        .slick-prev:before,
        .slick-next:before {
          display: none !important;
        }
        `}
      </style>

      <AfterLoginHeader />
      {/* card layout and single description page content */}
      <div className="container max-w-[1440px] mx-auto px-4  ">
        <nav className="text-sm  text-[#B5B1CD] cursor-pointer flex items-center mt-3">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span> &gt; </span>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/postproperty")}
          >
            profile
          </span>
          <span> &gt; </span>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/my-listing")}
          >
            MyListing
          </span>
          <span> &gt; </span>
          <span className="font-light truncate ">
            {property?.title || "Property Details"}
          </span>
        </nav>
        {/* Image + Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-3 w-full h-full lg:max-h-[550px] ">
          <div className="relative rounded-2xl">
            {mediaArray.length > 0 ? (
              <div className="relative dot-slider">
                <Slider
                  {...cardSetting}
                  arrows={false}
                  autoplay
                  autoplaySpeed={600}
                >
                  {mediaArray.map((media, idx) => (
                    <div key={idx} className=" h-[480px] cursor-pointer rounded-2xl overflow-hidden" >
                      {media.type === "image" ? (
                        <img
                          src={`${BASE_URL}${media.url}`}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-full object-center"
                          onClick={zoomImage}
                        />
                      ) : (
                        <video
                          src={`${BASE_URL}${media.url}`}
                          className="object-cover border-0 rounded-3xl"
                          controls
                          loop
                          muted
                          autoPlay
                        />
                      )}
                    </div>
                  ))}

                </Slider>
              </div>
            ) : (
              <img
                src={defaultimage}
                alt="default img"
                className=" w-full object-contain border-0 rounded-3xl"
              />
            )}
            <div
              className="absolute top-[20px] right-[20px] h-7 w-7 flex justify-center items-center  p-1 cursor-pointer  bg-white/60 rounded-full "
              onClick={toggleWishlist}
            >
              <img
                src={isWishlisted || property.isWishlisted ? wishlist : uncheckedwishlist}
                alt="wishlist"
                className="h-7 w-7"
              />
            </div>
            {property.verification_status == "pending" && (
              <div className="absolute top-[18px] left-[0px] cursor-pointer ">
                <div className="bg-[#00AC07] h-6 w-30 [clip-path:polygon(0_0,100%_0,calc(100%_-_10px)_50%,100%_100%,0_100%)] text-center text-sm  text-white flex justify-center items-center">
                  <span>
                    <img src={verified} alt="verify" className="h-4 w-4 mr-2" />
                  </span>
                  Verified
                </div>
              </div>
            )}
            <div
              className="absolute bottom-[30px] right-[37px] cursor-pointer hover:transform scale-110 z-10"
              onClick={zoomImage}
            >
              <img
                src={zoomarrow}
                alt="ZoomIn"
                className="transform transition-transform duration-300 hover:scale-110"
              />
            </div>
            {/* big pop up images scroll */}
            {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-30 z-50 p-4">
                <div className="flex flex-col gap-3 justify-between relative w-full max-h-[90vh] max-w-[600px] h-[40vh] md:h-[70vh] rounded-3xl">
                  <div className="dot-slider dot-slider-zoom relative rounded-3xl">
                    <button
                      className="absolute top-2 right-2 text-white text-2xl z-10"
                      onClick={closePopup}
                    >
                      <IoMdClose className="absolute top-[18px] right-[20px] cursor-pointer" />
                    </button>

                    {mediaArray.length > 0 ? (
                      <Slider ref={sliderRef} {...settings}>
                        {mediaArray.map((media, idx) => (
                          <div
                            key={idx}
                            className="flex justify-center items-center w-full h-100 rounded-2xl bg-black overflow-hidden "
                          >
                            {media.type === "video" ? (
                              <video
                                src={`${BASE_URL}${media.url}`}
                                className="w-full h-full "
                                controls
                                loop
                                muted
                              />
                            ) : (
                              <img
                                src={`${BASE_URL}${media.url}`}
                                alt={`Property ${idx + 1}`}
                                className="w-full h-full max-h-150 rounded-3xl "
                              />
                            )}
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <img
                        src={defaultimage}
                        alt="default img"
                        className="w-full object-cover border-0 "
                      />
                    )}
                  </div>

                  <div className="flex gap-5 pl-4 h-full max-h-20 ">
                    {!showAllPreview ? (
                      <>
                        {/* Show first 3 */}
                        {mediaArray.slice(0, 3).map((media, idx) => (
                          <div
                            key={idx}
                            className="w-40 h-full max-h-25 flex-shrink-0 cursor-pointer"
                            onClick={() => sliderRef.current.slickGoTo(idx)}
                          >
                            {media.type === "image" ? (
                              <img
                                src={`${BASE_URL}${media.url}`}
                                alt={`Property ${idx + 1}`}
                                className="w-full h-full  rounded-md"
                              />
                            ) : (
                              <video
                                src={`${BASE_URL}${media.url}`}
                                className="w-full h-full rounded-md object-cover bg-black"
                                muted
                              />
                            )}
                          </div>
                        ))}

                        {/* Last preview with +N overlay */}
                        {mediaArray.length > 3 && (
                          <div
                            className="w-40 h-25 relative flex-shrink-0 cursor-pointer"
                            onClick={() => setShowAllPreview(true)}
                          >
                            {mediaArray[3].type === "image" ? (
                              <img
                                src={`${BASE_URL}${mediaArray[3].url}`}
                                alt="Property Preview"
                                className="w-full h-full rounded-md object-cover"
                              />
                            ) : (
                              <video
                                src={`${BASE_URL}${mediaArray[3].url}`}
                                className="w-full h-full rounded-md object-cover bg-black"
                                muted
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold bg-black/60 rounded-md">
                              +{mediaArray.length - 3}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Show all */
                      <div className="flex gap-4 flex-wrap">
                        {mediaArray.map((media, idx) => (
                          <div
                            key={idx}
                            className="w-40 h-25 relative cursor-pointer"
                            onClick={() => sliderRef.current.slickGoTo(idx)}
                          >
                            {media.type === "image" ? (
                              <img
                                src={`${BASE_URL}${media.url}`}
                                alt={`Property ${idx + 1}`}
                                className="w-full h-full rounded-md object-cover"
                              />
                            ) : (
                              <video
                                src={`${BASE_URL}${media.url}`}
                                className="w-full h-full rounded-md object-cover bg-black"
                                muted
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col w-full py-[16px] ">
            <div className="">
              <h1 className="text-2xl sm:text-3xl lg:text-3xl text-[#36334D] font-semibold mb-4 leading-12">
                {property ? capitalizeFirstLetter(property.title) : ""}
              </h1>

              <div className="flex gap-2 font-medium text-lg mb-2">
                {/* Price */}
                <div>
                  <span className="text-[#36334D] text-2xl sm:text-3xl lg:text-4xl font-bold">
                    <span className="font-[Inter,sans-serif] font-semibold">
                      ₹
                    </span>{" "}
                    {property ? shrinkedPrice(property.price) : ""}
                  </span>
                </div>
                <div className="flex items-end ">
                  <div>
                    (
                    {property
                      ? capitalizeFirstLetter(property.price_type) + " Price"
                      : "Property"}
                    )
                  </div>
                  <span>+</span>

                  <div>
                    {property ? (
                      <div className="ml-1">
                        {property?.registration_fee
                          ? capitalizeFirstLetter(property.registration_fee) +
                          " Fees"
                          : "No Fee"}
                      </div>
                    ) : (
                      "Property"
                    )}
                  </div>
                </div>
              </div>

              <div className="font-medium text-sm  sm:text-lg text-[#36334D]">
                Per Sq.Ft./ <span className="font-[Inter,sans-serif]">₹</span>{" "}
                {property ? property.area_value : ""}
              </div>

              {/* Property Details Grid */}
              <div className="mt-6 grid grid-cols-2  lg:grid-cols-3 gap-4">
                {propertyDetails.map(({ icon, label, value }, idx) => (
                  <div
                    className="flex flex-col justify-center gap-1 "
                    key={idx}
                  >
                    <div className="flex items-center mt-[6px] gap-2">
                      <img src={icon} alt={label} /> {label}
                    </div>
                    <div className="text-sm text-[#36334D] ">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-6  mt-6 justify-start ">
                <Button
                  type="button"
                  className={`${PostPropertyButton} bg-transparent mt-2 hover:bg-[#FFD300] font-semibold border-2 px-8 h-12 border-[#FFD300] md:w-fit`}
                  onClick={loginUserCheck}
                >
                  Schedule Visit
                </Button>

                <Button
                  type="button"
                  className={`${PostPropertyButton} bg-[#FFD300] mt-2 px-10 h-12 font-semibold md:w-fit`}
                  onClick={() => {
                    const result = loginUserCheck();
                    if (result) contactInfo();
                  }}
                >
                  Contact Now
                </Button>
                {showContact && (
                  <DialogBox isOpen={showContact} onClose={closeContactPopup}>
                    <h1 className="font-medium text-md">
                      Thank You For Showing Interest in Property.
                    </h1>

                    <div className="font-bold text-md text-[#36334D] mt-3">
                      Contact Info
                    </div>
                    <div className="text-sm font-medium mt-1">
                      Owner Name:
                      <span className="text-md font-medium ml-1">
                        {property.owner.first_name} {property.owner.last_name}
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
                                ? property.owner.phone
                                : maskPhone(property.owner.phone)}
                            </p>
                          </div>

                          <div className="border-l-2 border-dotted hidden h-10 md:block"></div>

                          <div className="mt-2 md:mt-0">
                            <p className="font-semibold text-md text-[#36334D]">
                              Email Id
                            </p>
                            <p className="text-md font-medium">
                              {isSubscribed
                                ? property.owner.email
                                : maskEmail(property.owner.email)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isSubscribed && (
                        <div className="flex justify-center items-center">
                          <Button
                            type="button"
                            className={`bg-[#FFD300] font-semibold ${PostPropertyButton}`}
                            onClick={() => { navigate('/subscription-plans') }}
                          >
                            Upgrade Plan
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogBox>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posted Date */}
        <div className="my-5 text-sm sm:text-base text-[#4B476B] ">
          Posted On: {postedDate(property?.created_at)}
        </div>

        {/*  facility Section */}
        <div className="text-2xl font-bold">Near By Facilities</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 py-4">
          {nearByFacility.map((values, idx) => (
            <div key={idx} className=" flex gap-1 py-2 text-md">
              <img src={tick} alt="tick icon" className="w-5 h-5" />
              {values}
            </div>
          ))}
        </div>
        {/* Description */}
        <div className="grid grid-cols-12 gap-8 ">
          <div className="col-span-12 md:col-span-8">
            <div className="text-2xl font-bold mt-4 text-[#36334D]">
              Property Description
            </div>

            <div className="text-md font-bold mt-4 text-[#36334D]">
              Property Location:
              <span className="ml-2 font-medium text-sm text-[#4B476B] ">
                {property?.location?.street}, {property?.location?.city}.
              </span>
            </div>

            <div className="text-[#4B476B] text-sm leading-relaxed text-justify mt-3">
              <div className="text-[#4B476B] text-sm leading-relaxed text-justify">
                {compressedDescription(property.description, showMore)}
                {property.description?.length > 300 && (
                  <span
                    onClick={() => setShowMore(!showMore)}
                    className="text-black font-semibold cursor-pointer ml-1"
                  >
                    {showMore ? (
                      <span className="underline">Show Less</span>
                    ) : (
                      <span className="underline">Read More</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 relative">
            <div className="bg-gray-100 rounded-xl mt-4 p-5 sticky top-0">
              <div>Contact Now to Get Your Dream Property</div>
              <label className="flex items-center space-x-2 cursor-pointer select-none mt-4">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="sr-only"
                />

                <div
                  className={`h-5 w-5 flex items-center justify-center border-2 border-[#FFD300] rounded-sm ${checked ? "bg-transparent" : "bg-transparent"
                    }`}
                >
                  {checked && <Check size={16} color="#FFD300" />}
                </div>

                <span className="text-sm text-[#4B476B]">
                  I agree to My Prop AI
                  <a href="#" className=" ml-1 underline">
                    T&C
                  </a>
                </span>
              </label>
              <Button
                type="button"
                className={`${PostPropertyButton} bg-[#FFD300] mt-4 px-6 w-fit py-0`}
                onClick={() => {
                  const result = loginUserCheck();
                  if (result) contactInfo();
                }}
              >
                Contact Now
              </Button>
            </div>
          </div>
        </div>
        <div className="grid mt-10 grid-cols-12  gap-6">
          <div className="col-span-12 md:col-span-5">
            <h1 className="text-2xl font-bold mb-3">Posted By</h1>
            <div className="flex items-center ">
              <img
                src={ownerprofile}
                alt="owner profile"
                className="h-20 w-20 rounded-full"
              />
              <div className="p-3 pt-3">
                <span className="block mt-1 text-lg font-bold">
                  {capitalizeFirstLetter(property.owner.first_name) +
                    " " +
                    capitalizeFirstLetter(property.owner.last_name)}
                </span>
                <span className="text-sm font-medium">Owner</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
              <div>Properties Listed: 12</div>
              <div>Properties Verified: 10</div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            <h1 className="text-2xl font-bold mb-3">
              Activity on the Property
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              <div className="flex flex-col">
                <div className="flex gap-3 font-semibold">
                  <img src={profileviewed} alt="" className="h-5 w-5 " />
                  <span className="text-md">People Viewed</span>
                </div>
                <div className="mt-4">
                  <span className="text-sm">
                    54 people viewed this property
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-3 font-semibold">
                  <img src={wishlist} alt="" className="h-6 w-6 " />
                  <span className="text-md">Wishlisted</span>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-md">20 people wishlisted</span>
                </div>
              </div>

              <div className="flex flex-col text-sm">
                <div className="flex gap-3 font-semibold">
                  <img src={telephone} alt="" className="h-5 w-5 " />
                  <span className="text-md">Contacted</span>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-md">4 people contacted owner</span>
                </div>
              </div>
            </div>
            <div className="text-[#4B476B] text-sm font-light mt-5 cursor-pointer">
              Property code:1562781 (OR) www.mypropai/{propertyId}.com
            </div>
          </div>
        </div>

        {/* ? Recommmended list */}
        <div className=" ">
          {/* First section - 70% */}
          <section className="pt-12 pb-6 ">
            <div className=" flex justify-between">
              <div>
                <h2 className="text-[#36334D] text-2xl font-bold">
                  Recommended Properties
                </h2>
                <p className="text-[#36334D] text-base mt-1">
                  Highly Recommended property for you
                </p>
              </div>

              <div>
                <a
                  href="test"
                  className="flex items-center mt-2 text-base font-medium bg-gradient-to-b from-[#3B3898] to-[#5B489B] bg-clip-text text-transparent"
                >
                  See all properties
                  <img src={right_arrow} alt="arrow" className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="relative  mt-4">
              <Slider {...sliderSettings}>
                {recommendedProperties.map((property) => {
                  const imageUrl = property.cover_image
                    ? `${BASE_URL}${property.cover_image}`
                    : dummy_1;

                  return (
                    <div key={property.id} className="p-2">
                      <div className="bg-[#ECEAFF] p-[8px] max--w-full rounded-lg relative">
                        {/* Wishlist Icon */}
                        <img
                          src={heart_icon}
                          alt="wishlist"
                          className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform"
                        />

                        {/* Property Image */}
                        <img
                          src={imageUrl}
                          alt={property.title || "Property"}
                          className=" w-full h-[200px] object-cover rounded-md"
                        />

                        {/* Price */}
                        <div className="font-semibold text-[#36334D] flex items-center mt-2">
                          <img
                            src={rupee_sign_black_small}
                            alt="rupee"
                            className="mr-1"
                          />
                          {property.price?.toLocaleString() ?? "N/A"}
                          {property.price_type === "negotiable" && (
                            <span className="text-[#4B476B] text-[14px] font-semibold ml-1">
                              (negotiable)
                            </span>
                          )}
                        </div>

                        {/* Property Type */}
                        <div className="font-semibold text-[#36334D] text-[16px] leading-[24px]">
                          {property.property_type}
                        </div>

                        {/* Description */}
                        <div className="text-sm text-[#36334D]">
                          {property?.description
                            ? property.description.length > 30
                              ? property.description.substring(0, 30) + "..."
                              : property.description
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </section>
          {/* footer */}
        </div>
        {/* for you */}
        <div className=" ">
          {/* First section - 70% */}
          <section className="pt-12 pb-6 ">
            <div className=" flex justify-between">
              <div>
                <h2 className="text-[#36334D] text-2xl font-bold">
                  Similar Properties
                </h2>
                <p className="text-[#36334D] text-base mt-1">
                  Hot Selling similar property for you
                </p>
              </div>

              <div>
                <a
                  href="/property-listing"
                  className="flex items-center mt-2 text-base font-medium bg-gradient-to-b from-[#3B3898] to-[#5B489B] bg-clip-text text-transparent"
                >
                  See all properties
                  <img src={right_arrow} alt="arrow" className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="relative mt-4">
              <Slider {...sliderSettings}>
                {recommendedProperties.map((property) => {
                  const imageUrl = property.cover_image
                    ? `${BASE_URL}${property.cover_image}`
                    : dummy_1;

                  return (
                    <div key={property.id} className="p-2" onClick={() => { navigate(`/property-details/${property.id}`) }}>
                      <div className="bg-[#ECEAFF] p-[8px] w-full rounded-lg relative">
                        {/* Wishlist Icon */}
                        <img
                          src={heart_icon}
                          alt="wishlist"
                          className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform"
                        />

                        {/* Property Image */}
                        <img
                          src={imageUrl}
                          alt={property.title || "Property"}
                          className="w-full h-[200px] object-cover rounded-md"
                        />

                        {/* Price */}
                        <div className="font-semibold text-[#36334D] flex items-center mt-2">
                          <img
                            src={rupee_sign_black_small}
                            alt="rupee"
                            className="mr-1"
                          />
                          {property.price?.toLocaleString() ?? "N/A"}
                          {property.price_type === "negotiable" && (
                            <span className="text-[#4B476B] text-[14px] font-semibold ml-1">
                              (negotiable)
                            </span>
                          )}
                        </div>

                        {/* Property Type */}
                        <div className="font-semibold text-[#36334D] text-[16px] leading-[24px]">
                          {property.property_type}
                        </div>

                        {/* Description */}
                        <div className="text-sm text-[#36334D]">
                          {property?.description
                            ? property.description.length > 30
                              ? property.description.substring(0, 30) + "..."
                              : property.description
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </section>
          {/* footer */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PropertyDetials;
