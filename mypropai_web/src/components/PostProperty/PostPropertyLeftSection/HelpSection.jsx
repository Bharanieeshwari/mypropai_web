import React from "react";
import ProgressCircle from "../PostFormLayout/ProgressCircle";
import home_icon from "../../../assets/postproperty/home-icon-mpai.svg";
import Wp_icon from "../../../assets/postproperty/wp-icon-mypai.svg";
const HelpSection = ({ currentStep = 0, formData }) => {
  const { isAdditionalDetailsComplete } = formData;
  let progressPercent = 0;

  if (isAdditionalDetailsComplete) {
    progressPercent = 100;
  } else {
    const values = ["0", "43", "77", "92", "92"];
    progressPercent = parseInt(values[currentStep]);
  }
  return (
    <div className=" mt-7 mb-10 flex flex-row sticky top-[150px] justify-center text-[#36334D] space-x-4">
      <div>
        <div className="text-3xl font-semibold "> Property Score</div>
        <ul className="flex flex-col w-[400px] my-6">
          <li className="flex items-start gap-2">
            <img src={home_icon} alt="" loading="lazy" />
            <span>
              Based on property information My Prop AI provide score for your
              property. High Score increase chances of sell or rent
            </span>
          </li>
          <li className="flex items-start gap-2 mt-5">
            <img src={home_icon} alt="" />
            <span>High Score, High Visibility</span>
          </li>
        </ul>
        <div className="flex md:justify-start justify-center items-center my-5">
          <ProgressCircle percentage={progressPercent} />
        </div>
        <div className="my-5 leading-3">
          <h1 className="text-black text-xl font-bold">
            Need help in posting your property?
          </h1>
          <ul className=" mt-5">
            <li className="text-sm text-[#36334D] flex items-start gap-2 py-2 ">
              <img src={home_icon} alt="" />
              <span>
                Send Hi to
                <span className="font-bold mx-1">
                  <img src={Wp_icon} alt="" className="inline mx-1" />
                  98758 12345
                </span>
                our assistant help you to post property
              </span>
            </li>

            <li className="flex items-center  gap-2 py-2">
              <img src={home_icon} alt="" />
              <span>
                For any enquiry call 1800 258 654 customer care service
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
