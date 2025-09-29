import React from "react";
import SucessPoster from "../../../assets/postproperty/solid_success_icon_pp.svg";
import AddMoreIcon from "../../../assets/postproperty/success_addmore_icon_pp.svg";
import { PostPropertyButton } from "./FormSteps/BasicDetails";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "../../common/Footer";

const PostSuccess = ({ goToStep, propertyId, isEdit, setIsEdit }) => {
  const { isAdditionalDetailsComplete } = false;
  const STEP_KEY = "PropertyFormStep";
  const DATA_KEY = "PropertyFormData";
  const VERSION_KEY = "PropertyFormVersion";
  const navigate = useNavigate();
  const handlePreview = () => {
    if (propertyId) {
      navigate(`/property-details/${propertyId}`);
      localStorage.removeItem(STEP_KEY);
      localStorage.removeItem(DATA_KEY);
      localStorage.removeItem(VERSION_KEY);
    } else {
      alert("Property not found!");
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="justify-center text-center mt-10 bg-[#ECEAFF] h-fit w-[570px] rounded-2xl p-[40px]">
          <img src={SucessPoster} alt="Success" className="mx-auto" />
          <h2 className="text-[24px] text-[#36334D] font-bold mt-3">
            {isAdditionalDetailsComplete
              ? "Your Details has been Updated succesfully"
              : "Posted Successfully"}
          </h2>
          <p className="text-sm text-[#36334D] font-medium text-center my-2">
            Your Ad has been successfully
            {isAdditionalDetailsComplete ? " updated" : " posted "} . Stay with
            us for updates.
          </p>
          <Button
            type="button"
            className={`${PostPropertyButton} mt-3`}
            onClick={handlePreview}
          >
            Preview Your Property
          </Button>
        </div>

        {!isEdit && (
          <>
            <div className="my-5 flex items-center gap-4 text-gray-400">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="text-sm font-light text-[#292C93]">(or)</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="bg-[#ECEAFF] h-fit w-[570px] rounded-2xl p-[40px] ">
              <div className="flex flex-row items-center justify-center mt-3 gap-1">
                <img src={AddMoreIcon} alt="Add More" className="h-7" />
                <h2 className="text-[18px] text-[#36334D] font-bold">
                  To Boost Your Ads, Some Details are Missing
                </h2>
              </div>
              <Button
                type="button"
                className={`${PostPropertyButton} mt-5`}
                onClick={() => {
                  setIsEdit(true);
                  navigate(`/postproperty?id=${propertyId}`);
                  goToStep(3);
                }}
              >
                Add More Details
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PostSuccess;
