import { Edit } from "lucide-react";
import React from "react";

const FormProgressBar = ({
  currentStep = 0,
  onStepClick,
  formData,
  isEdit,
}) => {
  let steps = ["Basic Details", "Property Location", "Property Details"];
  if (currentStep === 3 || isEdit) {
    steps = [...steps, "Additional Details"];
  }
  const stepValues = [
    formData?.subPropertyType || "",
    [formData.location?.city, formData.location?.locality]
      .filter(Boolean)
      .join(",") || "",
    currentStep >= 2 ? formData?.title || "AboutProperty" : "",
    currentStep === 3 ? formData?.roadSize || "Additional" : "",
  ];

  const getStatus = (index) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="bg-gradient-to-r from-[#252A93] to-[#624999] pt-2 pb-2 text-white sticky top-0 z-1">
      <div className="max-w-[1440px] mx-auto ">
        {/* Step Circles */}
        <div className="flex items-center justify-between px-6 sm:px-16 relative">
          {steps.map((label, index) => {
            const status = getStatus(index);

            return (
              <div
                key={index}
                className="relative flex-1 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (onStepClick) {
                    if (index <= currentStep) onStepClick(index);
                  }
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10
                  ${
                    status === "completed" || status === "current"
                      ? "bg-white text-black"
                      : "bg-[#9A9A9A] text-white border border-white/30"
                  }
                `}
                >
                  {index + 1}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-1/2 w-full h-1 z-0
                    ${
                      status === "completed"
                        ? "bg-white"
                        : "bg-[#9A9A9A] border border-white/30"
                    }
                  `}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Labels */}
        <div className="flex justify-around items-center text-xs sm:text-sm font-medium px-6 sm:px-16 mt-1">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`text-center w-20 sm:w-32 truncate cursor-pointer ${
                index <= currentStep ? "hover:underline" : "opacity-50"
              }`}
              onClick={() => {
                if (onStepClick && index <= currentStep) onStepClick(index);
              }}
            >
              <div className="flex flex-col">
                {label}
                {stepValues[index] && (
                  <span className="text-gray-300 text-xs">
                    {stepValues[index].length > 12
                      ? stepValues[index].slice(0, 12)
                      : stepValues[index]}
                    <span className="text-white text-sm">...Edit</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormProgressBar;
