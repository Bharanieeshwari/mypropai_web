"use client";
import React from "react";
import postPropertyBanner from "../../../assets/postproperty/postproperty-banner.jpg";
import ListHomeIcon from "../../../assets/postproperty/home-icon-mpai.svg";
import "../post-property.css";

const PostPropertyHome = () => {
  return (
    <>
      <div
        className="w-full min-h-screen h-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(172deg, rgba(12, 0, 68, 0.72) 35.69%, rgba(78, 63, 151, 0.72) 87.73%), url(${postPropertyBanner})`,
        }}
      >
        <div className="text-white flex justify-center mb-10">
          <div className="mt-15">
            <div className="text-white font-bold text-4xl/14 ">
              List Your Property <br />
              <span className="text-[#FFD300]">Free</span> With
              <span className="text-[#FFD300] ml-3">My Prop AI</span>
            </div>
            <ul className="mt-6 text-lg/11">
              <li>
                <img src={ListHomeIcon} alt="home-icon" className="inline" />
                Post Your Property for <span className="font-bold ">Free</span>
              </li>
              <li>
                <img src={ListHomeIcon} alt="home-icon" className="inline" />
                Get accessed by more{" "}
                <span className="font-bold "> 1 lakhs buyers</span>
              </li>
              <li>
                <img src={ListHomeIcon} alt="home-icon" className="inline" />
                Get daily update of{" "}
                <span className="font-bold ">Our property</span>
              </li>
              <li>
                <img src={ListHomeIcon} alt="home-icon" className="inline" />
                Get latest trends{" "}
                <span className="font-bold ">Market price</span>
              </li>
            </ul>
            <div className="text-[#FFD300] font-bold text-3xl mt-5">
              Sell or Rent your Property
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PostPropertyHome;
