import React, { useState, useEffect } from "react";
import AfterLoginHeader from "@/components/common/AfterLoginHeader";
import Home from "../../../assets/dummy_images/dummy_property2.png";
import { BASE_URL } from "@/lib/api";
import adresssicon from "../../../assets/userlisting/icon/location-icon.svg";
import { shrinkedPrice, postedDate, capitalizeFirstLetter, getLoginUserData, } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { PostPropertyButton } from "@/components/PostProperty/PostFormLayout/FormSteps/BasicDetails";
import forsaleposter from "../../../assets/userlisting/image/for-sale-poster-img.png";
import { useNavigate } from "react-router-dom";
import nolisting from "../../../assets/userlisting/image/empty-mylist-poster.png";
import Footer from "@/components/common/Footer";
import defaultimage from "../../../assets/userlisting/image/default-preview.png";
import { getUserProperties } from "@/lib/property";
import DialogBox from "@/components/common/DialogBox";
import LoaderOverlay from "@/components/common/LoaderOverLay";

const UserListings = () => {
  const [user_id, setUserId] = useState(null);
  const [propertyList, setPropertyList] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Pagination states
  useEffect(() => {
    const user_details = getLoginUserData();

    const user_data = user_details.user
    setUserId(user_data.id);
  }, []);
  const handleDeleteProperty = (id) => {
    if (id >= 0) {
      setIsDelete(true);
      setDeleteId(id);
    } else {
      alert("Invalid Property");
    }
  };

  useEffect(() => {
    if (!user_id) return;
    let isMounted = true;
    const fetchUserProperty = async () => {
      try {
        setLoading(true);
        const response = await getUserProperties({
          user_id,
          page,
          page_size: pageSize,
        });

        if (response.success && isMounted) {
          setPropertyList(response.properties || []);
          setLoading(false);
          setIsEmptyList(true);
          if (
            response.pagination?.total_pages &&
            response.pagination?.total_pages !== totalPages
          ) {
            setTotalPages(response.pagination?.total_pages);
          }
        } else {
          if (isMounted) setPropertyList([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        if (isMounted) setPropertyList([]);
        setLoading(false);
      }
    };

    fetchUserProperty();

    return () => {
      isMounted = false;
    };
  }, [user_id, page, pageSize]);
  // handle edit
  const handleEditForm = (propertyId) => {
    if (propertyId) {
      navigate(`/postproperty?id=${propertyId}`);
    } else {
      console.log("property id is not defined");
    }
  };

  return (
    <div>
      <AfterLoginHeader />
      <LoaderOverlay loading={loading} />
      <div className="max-w-[1440px] conatiner mx-auto px-4 ">
        <nav className="text-sm mt-3  text-[#B5B1CD] cursor-pointer flex items-center">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span> &gt; </span>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("")}
          >
            Profile
          </span>
          <span> &gt; </span>
          <span className="font-light truncate ">My Listings</span>
        </nav>
        <div className="flex flex-row justify-between ">
          <h1 className="text-xl md:text-2xl md:block font-bold mt-4 ">
            My Listing
          </h1>
          <div className="md:hidden">
            <Button
              className={`bg-[#FFD300] mt-3 md:rounded-2xl  text-[#000000] text-sm md:text-md px-4 md:px-6 py-2 md:py-3 w-fit`}
              onClick={() => navigate("/postproperty")}
            >
              Post Property Free
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6 mt-5 md:px-0 px-5  cursor-pointer">
          {/* Left section: Listings */}
          <div className="col-span-12 md:col-span-7">
            {propertyList.length > 0
              ? propertyList.map((myList) => (
                <div
                  key={myList.id}
                  className="grid grid-cols-1 lg:grid-cols-12 lg:gap-1 overflow-hidden  lg:max-h-[260px]  bg-[#ECEAFF] rounded-2xl mb-4 z-10 hover:shadow transition-all"
                  onClick={() =>
                    navigate(`/property-details/${myList.id}`)
                  }
                >
                  {/* Left Image */}

                  <div className="md:col-span-4 ">
                    <img
                      src={
                        myList.cover_image
                          ? `${BASE_URL}${myList.cover_image}`
                          : defaultimage
                      }
                      alt={myList.title || "Default property"}
                      className="w-full md:h-full max-h-[250px]
                          object-cover"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="md:col-span-8  flex flex-col p-4">
                    <h1
                      data-id={myList.id}
                      className="text-base md:text-lg font-semibold text-[#36334D] truncate w-inherit cursor-pointer "
                      onClick={(e) => {
                        e.stopPropagation();
                        e.currentTarget.classList.remove("truncate", "w-111")
                      }
                      }
                    >
                      {capitalizeFirstLetter(myList.title)}
                    </h1>

                    <div className="mt-2 flex items-center gap-1 text-sm text-[#4D4D4D]">
                      <img
                        src={adresssicon}
                        alt="address"
                        className="h-4 w-4"
                      />
                      <span>
                        {myList.location.street},{myList.location.locality}{" "}
                        {myList.location.city}
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="text-[#36334D] text-lg mr-2 font-bold">
                        <span className="font-[Inter,sans-serif] font-semibold text-xl md:text-2xl">
                          ₹
                        </span>{" "}
                        {shrinkedPrice(myList.price)}
                      </span>
                      <span className="text-xs md:text-sm text-[#36334D] font-semibold">
                        ({capitalizeFirstLetter(myList.price_type)} Price)
                      </span>
                    </div>

                    <div className="font-light text-sm mt-1 text-[#4D4D4D]">
                      Per Sq.Ft. /{" "}
                      <span className="font-[Inter,sans-serif]">₹</span>{" "}
                      {myList.area_value}
                    </div>
                    <div className="flex flex-col md:flex-row lg:px-2 xl:px-3 flex-wrap mt-3 justify-center  gap-2 xl:gap-10">
                      <button
                        className="w-full sm:w-auto border-0 bg-transparent text-[#36334D] lg:text-md text-sm font-medium underline cursor-pointer text-center"
                        onClick={(e) => { e.stopPropagation(); handleDeleteProperty(myList.id) }}
                      >
                        Delete
                      </button>

                      <button
                        className="w-full sm:w-auto rounded-full border-2 cursor-pointer text-[#36334D] px-6 lg:text-md text-sm  py-2 font-medium hover:bg-[#ffd300] border-[#FFD300]"
                        onClick={(e) => { e.stopPropagation(); handleEditForm(myList.id) }}
                      >
                        Edit Post
                      </button>

                      <button
                        className="w-full sm:w-auto rounded-full bg-[#FFD300] cursor-pointer text-[#36334D] px-6 lg:text-md text-sm  py-2 font-medium text-center"
                        onClick={(e) => { e.stopPropagation(); navigate(`/property-details/${myList.id}`) }
                        }
                      >
                        View Property
                      </button>
                    </div>

                    <div className="mt-3 flex justify-end text-xs md:text-sm text-[#4B476B]">
                      Posted on: {postedDate(myList?.created_at)}
                    </div>
                  </div>
                </div>
              ))
              : ""}
          </div>

          {/* Right Section: Poster */}
          {propertyList.length > 0 && (
            <div className=" col-span-12 md:col-span-5 mb-5 relative">
              <div className="bg-[#ECEAFF] hidden md:block rounded-2xl p-6 md:p-9 sticky top-1 ">
                <div className="relative w-full max-w-sm mx-auto">
                  <img
                    src={forsaleposter}
                    alt="For Sale"
                    className="w-full h-auto rounded-lg object-cover"
                  />

                  {/* Overlay text */}
                </div>

                <p className="mt-4 text-sm  font-medium text-[#36334D]">
                  Looking for Buyer? My Prop AI has more than 10000+ daily
                  active buyers. Post your property today and get a genuine
                  buyer.
                </p>
                <p className="mt-4 text-sm  font-medium text-[#36334D]">
                  More than 5000+ happy families fulfilled their dreams.
                </p>

                <Button
                  className={`${PostPropertyButton} mt-3 text-[#000000] text-sm md:text-md px-4 md:px-6 py-2 md:py-3 w-fit`}
                  onClick={() => navigate("/postproperty")}
                >
                  Post Property Free
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* paginatoin */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-4 py-2 rounded ${page === idx + 1
                  ? "bg-[#FFD300] text-black font-bold"
                  : "bg-gray-200"
                  }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, totalPages));
              }}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        {isEmptyList && (
          <>
            {propertyList.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <img src={nolisting} alt="Empty List" />
                <div className="flex flex-col justify-center items-center ">
                  <h2 className="text-2xl">No Listing !</h2>
                  <h3 className="text-sm mt-2">
                    Sell your property at 0 Cost{" "}
                  </h3>
                </div>
                <Button
                  className={`${PostPropertyButton} mt-5 text-[#000000] text-sm md:text-md px-10 py-2 md:py-3 w-fit`}
                  onClick={() => navigate("/postproperty")}
                >
                  Post Property Free
                </Button>
              </div>
            )}
          </>
        )}

        {/* Delete Pop up box */}
        {isDelete && (
          <DialogBox onClose={() => setIsDelete(false)} isOpen={isDelete}>
            <h1 className="font-medium text-md ">Delete this Property?</h1>
            <div className=" mt-3">
              <p>This will delete your property from your listing</p>
            </div>
            <div className="flex justify-end items-center gap-3 mt-4">
              <div
                className="text-[#36334D] font-medium cursor-pointer text-sm"
                onClick={() => {
                  setIsDelete(false);
                }}
              >
                Cancel
              </div>
              <div className="flex items-center">
                <Button
                  type="button"
                  className={`${PostPropertyButton} text-sm px-4 py-0 h-8 mt-0  `}
                  onClick={() => {
                    alert(`Successfully Deleted ${deleteId}`);
                    setIsDelete(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogBox>
        )}
      </div>
      {/* <Footer /> */}
    </div >
  );
};

export default UserListings;
