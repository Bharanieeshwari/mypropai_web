import React, { useState, useEffect } from "react";
import AfterLoginHeader from "@/components/common/AfterLoginHeader";
import { Button } from "@/components/ui/button";
import { PostPropertyButton } from "@/components/PostProperty/PostFormLayout/FormSteps/BasicDetails";
import forsaleposter from "../../assets/userlisting/image/for-sale-poster-img.png";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import ion_home from "../../assets/auth/icons/ion_home.svg";
import LoaderOverlay from "@/components/common/LoaderOverLay";

const MyActivity = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // loader simulation
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
          <span className="font-light truncate ">My activity</span>
        </nav>
        <div className="flex flex-row justify-between ">
          <h1 className="text-xl md:text-2xl md:block font-bold mt-4 ">
            My activity
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
          {/* Left section: Activity list */}
          <div className="col-span-12 md:col-span-7">
            <div className="space-y-6">
              {/* Today Section */}
              <div>
                <h2 className="text-base font-semibold text-[#36334D] mb-4">
                  Today
                </h2>
                <div className="space-y-4">
                  {Array(5)
                    .fill("")
                    .map((_, index) => (
                      <div
                        key={`today-${index}`}
                        className="flex gap-3 items-start"
                      >
                        <img
                          src={ion_home}
                          alt="activity"
                          className="w-6 h-6 mt-1"
                        />
                        <div>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                          <p className="text-sm font-medium text-[#36334D]">
                            You view this property
                          </p>
                          <a
                            href="#"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            2BHK Independent House for sale in Adyar, Chennai
                            600 005
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Yesterday Section */}
              <div>
                <h2 className="text-base font-semibold text-[#36334D] mb-4">
                  Yesterday
                </h2>
                <div className="space-y-4">
                  {Array(3)
                    .fill("")
                    .map((_, index) => (
                      <div
                        key={`yesterday-${index}`}
                        className="flex gap-3 items-start"
                      >
                        <img
                          src={ion_home}
                          alt="activity"
                          className="w-6 h-6 mt-1"
                        />
                        <div>
                          <p className="text-xs text-gray-500">18 hours ago</p>
                          <p className="text-sm font-medium text-[#36334D]">
                            You view this property
                          </p>
                          <a
                            href="#"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            2BHK Independent House for sale in Adyar, Chennai
                            600 005
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Last Week Section */}
              <div>
                <h2 className="text-base font-semibold text-[#36334D] mb-4">
                  Last Week
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <img
                      src={ion_home}
                      alt="activity"
                      className="w-6 h-6 mt-1"
                    />
                    <div>
                      <p className="text-xs text-gray-500">7 days ago</p>
                      <p className="text-sm font-medium text-[#36334D]">
                        You view this property
                      </p>
                      <a
                        href="#"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        2BHK Independent House for sale in Adyar, Chennai 600
                        005
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Poster */}
          <div className=" col-span-12 md:col-span-5 mb-5 relative">
            <div className="bg-[#ECEAFF] hidden md:block rounded-2xl p-6 md:p-9 sticky top-1 ">
              <div className="relative w-full max-w-sm mx-auto">
                <img
                  src={forsaleposter}
                  alt="For Sale"
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>

              <p className="mt-4 text-sm  font-medium text-[#36334D]">
                Looking for Buyer? My Prop AI has more than 10000+ daily active
                buyers. Post your property today and get a genuine buyer.
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyActivity;
