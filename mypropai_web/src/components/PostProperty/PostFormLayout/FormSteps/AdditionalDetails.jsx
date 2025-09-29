import React from "react";
import {
  LabelField,
  InputField,
  RadioButton,
  SelectField,
} from "../../FormFields/FormElements";
import { InputFocus } from "./AboutForm";
import { selectUnits } from "../../FormFields/FormConfig";
import { Button } from "@/components/ui/button";
import { PostPropertyButton } from "./BasicDetails";
import { useForm } from "react-hook-form";
import { UpdatePostProperty } from "@/lib/property";
import { shouldShowField } from "../../FormFields/FormConfig";
import { WaterFacility } from "../../FormFields/FormConfig";
import { Checkbox } from "../../FormFields/FormElements";
import { amenities, FloorTypes } from "../../FormFields/FormConfig";
import { getLoginUserData, getOptionsWithCustomValue } from "@/utils/helpers";

const AdditionalDetails = ({
  setFormData,
  formData,
  goToStep,
  propertyId,
  setPropertyId,
  subPropertyType,
  isEdit,
  setIsEdit,
  user_id,
}) => {
  const twoChoice = [
    { key: true, label: "Yes" },
    { key: false, label: "No" },
  ];

  const methods = useForm();
  const { handleSubmit } = methods;
  const updateField = (field, value) => {
    setFormData((prev) => {
      const updatedAdditionalDetails = {
        ...prev.details,
        [field]: value,
      };
      const isComplete =
        updatedAdditionalDetails.permissible_floors ||
        updatedAdditionalDetails.corner_plot ||
        updatedAdditionalDetails.boundary_wall ||
        updatedAdditionalDetails.open_sides_count ||
        updatedAdditionalDetails.construction_done ||
        updatedAdditionalDetails.road_size_sqft ||
        updatedAdditionalDetails.roadsizeunit;
      return {
        ...prev,
        details: updatedAdditionalDetails,
        isAdditionalDetailsComplete: isComplete,
      };
    });
  };

  const onSubmit = async (data) => {
    try {
      const finalData = {
        ...formData,
        details: {
          ...formData.details,
          ...data.details,
        },
      };
      const loginUserData = getLoginUserData();
      const user_id = loginUserData.user.id
      const printObject = (obj, prefix = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            printObject(value, `${prefix}${key}.`);
          } else {
            console.log(`${prefix}${key}: ${value}`);
          }
        });
      };
      printObject(finalData);
      const response = await UpdatePostProperty(
        finalData,
        propertyId, user_id,
      );
      setPropertyId(response.property_id);
      setIsEdit(true);
      goToStep(4);
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.",);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="justify-center mt-7 mx-7 mb-auto w-full bg-[#ECEAFF] h-fit rounded-lg p-[30px]">
        <h2 className="text-[24px] font-bold mb-3">Property Location</h2>
        {/* floors allowed */}
        {shouldShowField("floorsAllowed", subPropertyType) && (
          <>
            {" "}
            <LabelField
              htmlfor="floorsAllowed"
              children="Floors Allowed For Construction"
              optional
              labelClass="mt-6"
            />
            <RadioButton
              name="floorsAllowed"
              options={getOptionsWithCustomValue(
                ["0", "1", "2", "3"],
                formData?.details?.permissible_floors,
                isEdit
              )}
              value={formData?.details?.permissible_floors || ""}
              onChange={(val) =>
                updateField(
                  "permissible_floors",
                  val,
                  formData.details.permissible_floorsOptions || []
                )
              }
              allowAddMore
            />
          </>
        )}
        {/* corner plot */}
        {shouldShowField("cornerPlot", subPropertyType) && (
          <>
            <LabelField
              htmlfor="cornerPlot"
              children="Is it a Corner Plot?"
              labelClass="mt-6"
              optional
            />
            <RadioButton
              labelClass="w-fit h-fit px-2 mt-3"
              name="cornerPlot"
              options={twoChoice}
              value={formData?.details?.corner_plot ?? null}
              onChange={(val) => {
                updateField("corner_plot", val);
              }}
              containerClass="mt-3"
            />
          </>
        )}
        {/* open sides */}
        {shouldShowField("openSides", subPropertyType) && (
          <>
            <LabelField
              htmlfor="openSides"
              children="No of open Sides"
              optional
              labelClass="mt-6"
            />
            <RadioButton
              name="openSides"
              options={["0", "1", "2", "3", "4"]}
              labelClass=""
              value={formData?.details?.open_sides_count || ""}
              onChange={(val) => {
                updateField("open_sides_count", val);
              }}
            />
          </>
        )}
        {/* construction */}
        {shouldShowField("construction", subPropertyType) && (
          <>
            <LabelField
              htmlfor="Construction"
              children="Any Construction "
              optional
              labelClass="mt-6"
            />
            <RadioButton
              name="Construction"
              options={twoChoice}
              value={formData?.details?.construction_done ?? null}
              onChange={(val) => {
                updateField("construction_done", val);
              }}
              containerClass="mt-2"
            />
          </>
        )}
        {/* wall boundry */}
        {shouldShowField("wallBoundry", subPropertyType) && (
          <>
            <LabelField
              htmlfor="wallBoundry"
              children="Is there a boundary wall around the Property?"
              labelClass="mt-6"
              optional
            />
            <RadioButton
              name="wallBoundry"
              options={twoChoice}
              value={formData?.details?.boundary_wall ?? null}
              onChange={(val) => {
                updateField("boundary_wall", val);
              }}
              containerClass="mt-3"
            />
          </>
        )}
        {/* Flooring types */}
        {shouldShowField("floorTypes", subPropertyType) && (
          <>
            {" "}
            <Checkbox
              label="Floor Type"
              options={FloorTypes}
              selected={formData?.details?.floorTypes || []}
              onChange={(val) => {
                updateField("floorTypes", val);
              }}
              optional={true}
              allowAddMore={true}
            />
          </>
        )}
        {/* water facility */}
        {shouldShowField("waterFacility", subPropertyType) && (
          <>
            <Checkbox
              label="Water Facility"
              options={WaterFacility}
              selected={formData?.details?.waterFacility || []}
              onChange={(val) => {
                updateField("waterFacility", val);
              }}
              optional={true}
            />
          </>
        )}
        {/* extra details */}
        {shouldShowField("amenities", subPropertyType) && (
          <>
            {" "}
            {amenities.map(({ key, label, options }) => (
              <div key={key} className="mt-3">
                <LabelField
                  htmlFor={label}
                  children={label}
                  labelClass="mt-5"
                  optional={true}
                />

                <RadioButton
                  name={key}
                  options={options}
                  value={formData?.details?.[key] || ""}
                  containerClass="mt-3"
                  onChange={(val) => updateField(`${key}`, val)}
                  optional={true}
                  labelClass="w-fit h-fit px-2 mt-3"
                />
              </div>
            ))}
          </>
        )}

        {/* road size */}
        {shouldShowField("roadsize", subPropertyType) && (
          <>
            <LabelField
              htmlfor="roadSize"
              children="Road Size"
              optional
              labelClass="mt-6"
            />
            <div className="relative">
              <InputField
                id="roadsize"
                name="roadSize"
                type="text"
                inputClass="mt-2 mb-3"
                placeholder="Enter your Property road size"
                value={formData?.details?.road_size_sqft || ""}
                onChange={(e) =>
                  updateField(
                    "road_size_sqft",
                    e.target.value.replace(/[^0-9]/g, "")
                  )
                }
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /[^0-9]/g,
                    ""
                  );
                }}
                className={`grow py-2 text-base rounded-full ${InputFocus}`}
              />
              <div className="absolute top-0 right-0 mr-2">
                <SelectField
                  value={formData?.details?.roadsizeunit || "Sq.ft"}
                  onChange={(val) => {
                    updateField("roadsizeunit", val);
                  }}
                  options={selectUnits}
                />
              </div>
            </div>
          </>
        )}
        <Button className={`${PostPropertyButton} mt-6`}>Save Details</Button>
      </div>
    </form>
  );
};

export default AdditionalDetails;
