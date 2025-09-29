import React from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check } from "lucide-react";
import { PostPropertyButton } from "./BasicDetails";
import { InputFocus } from "../AboutForm";
import { InputField } from "../../FormFields/FormElements";
import { Controller } from "react-hook-form";

const priceTypeOptions = ["Fixed price", "Price negotiable"];
const FeesType = ["Included Registration Fee", "Excluded Registration fee"];

export default function PricingForm({
  control,
  errors,
  formData,
  setFormData,
}) {
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value,
      },
    }));
  };

  return (
    <>
      {/* Price Inputs */}
      <Label
        htmlFor="price"
        className="mt-5 block text-lg font-medium text-gray-900"
      >
        Property Price
      </Label>
      <div className="mt-2 flex gap-3 ">
        <div>
          {/* Expected Price */}
          <div className=" w-[280px] pl-2 relative ">
            <Controller
              name="pricing.price"
              control={control}
              render={({ field }) => (
                <>
                  <InputField
                    {...field}
                    id="price"
                    type="text"
                    placeholder="Enter Your Expected Price"
                    inputClass="p-5 h-10  rounded-md  bg-white pl-7 pr-3 text-base  text-gray-900 placeholder:ml-5 placeholder:text-gray-400"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      e.target.value = val;
                      field.onChange(e);
                      updateField("price", e.target.value);
                    }}
                  />
                  <span className="text-base absolute top-2.5 left-5 text-gray-500">
                    ₹
                  </span>
                </>
              )}
            />
          </div>
          <div className="ml-5 mt-1">
            {errors.price && (
              <div className="text-red-500 text-sm">
                {errors?.price?.message}
              </div>
            )}
          </div>
        </div>

        {/* Price per Sq.ft */}
        <div className=" relative pl-3">
          <div>
            <Controller
              name="pricing.price_sqft"
              control={control}
              render={({ field }) => (
                <>
                  <InputField
                    {...field}
                    id="price_sqft"
                    type="text"
                    placeholder="Price per Sq.ft"
                    inputClass="p-5 h-6  rounded-md bg-white pl-7 pr-3 text-base  text-gray-900 placeholder:ml-5 placeholder:text-gray-400"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      e.target.value = val;
                      field.onChange(e);
                      updateField("price_sqft", e.target.value);
                    }}
                  />
                  <span className="text-base absolute top-2.5 left-5 text-gray-500">
                    ₹
                  </span>
                </>
              )}
            />
          </div>
          <div className=" mt-1 ml-1">
            {errors.price_sqft && (
              <span className="text-red-500 text-xs">
                {errors?.price_sqft?.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price Type Checkboxes */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Controller
          name="pricing.priceOption"
          control={control}
          defaultValue={formData?.price?.priceOption || ""}
          render={({ field }) =>
            priceTypeOptions.map((type, idx) => (
              <Label
                key={idx}
                className="flex items-center gap-2 text-md cursor-pointer"
              >
                <div
                  className={`h-5 w-5 border-2 rounded-sm flex items-center justify-center
      ${
        field.value === type
          ? "bg-[#FCCB02] border-[#FCCB02]"
          : "border-[#FCCB02]"
      }`}
                >
                  {field.value === type && (
                    <Check size={14} className="text-black" />
                  )}
                </div>

                <input
                  type="radio"
                  {...field}
                  value={type}
                  checked={field.value === type}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    updateField("priceOption", e.target.value);
                  }}
                  className="hidden"
                />

                <span>{type}</span>
              </Label>
            ))
          }
        />
      </div>
      {errors.priceOption && (
        <span className="text-red-500 text-sm">
          {errors?.priceOption?.message}
        </span>
      )}

      {/* Fees Type */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Controller
          name="pricing.feesOption"
          control={control}
          defaultValue={formData?.price?.feesOption || ""}
          render={({ field }) =>
            FeesType.map((type, idx) => (
              <Label
                key={idx}
                className="flex gap-2 mt-3 text-md cursor-pointer "
              >
                <div
                  className={`h-5 w-5 border-2 rounded-sm flex items-center justify-center
      ${
        field.value === type
          ? "bg-[#FCCB02] border-[#FCCB02]"
          : "border-[#FCCB02]"
      }`}
                >
                  {field.value === type && (
                    <Check size={14} className="text-black" />
                  )}
                </div>
                <input
                  type="radio"
                  {...field}
                  value={type}
                  checked={field.value === type}
                  onChange={(e) => {
                    field.onChange(e.target.value);

                    updateField("feesOption", e.target.value);
                  }}
                  className="hidden"
                />
                <span>{type}</span>
              </Label>
            ))
          }
        />
      </div>
      {errors.feesOption && (
        <div className="text-red-500 text-sm mt-2 ">
          {errors?.feesOption?.message}
        </div>
      )}

      {/* Property Title */}
      <div className="mt-6">
        <Label
          htmlFor="propertyTitle"
          className="block text-lg font-medium text-gray-900"
        >
          Property Title
        </Label>
        <Controller
          name="pricing.propertyTitle"
          control={control}
          render={({ field }) => (
            <>
              <InputField
                {...field}
                id="propertyTitle"
                type="text"
                placeholder="Enter Title for Property"
                inputClass={`mt-3 w-full h-10 rounded-md border-0 bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-400 ${InputFocus}`}
                onChange={(e) => {
                  field.onChange(e);
                  updateField("propertyTitle", e.target.value);
                }}
              />
            </>
          )}
        />
      </div>
      {errors.propertyTitle && (
        <div className="text-red-500 text-sm mt-2 ml-2">
          {errors?.propertyTitle?.message}
        </div>
      )}

      {/* Property Description */}
      <div className="mt-6">
        <Label
          htmlFor="propertyDescription"
          className="block text-lg font-medium text-gray-900"
        >
          Property Description
        </Label>
        <Controller
          name="pricing.propertyDescription"
          control={control}
          defaultValue={formData?.price?.description || ""}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Enter benefit and advantage of your property"
              className={`mt-3 h-[150px] w-full rounded-md border-0 bg-white px-4 pt-4 text-base text-gray-900 placeholder:text-gray-400 ${InputFocus}`}
              onChange={(e) => {
                field.onChange(e.target.value);
                updateField("propertyDescription", e.target.value);
              }}
            />
          )}
        />
      </div>
      {errors.propertyDescription && (
        <div className="text-red-500 text-sm mt-2 ml-2">
          {errors?.propertyDescription?.message}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-500">
        <AlertCircle className="h-5 w-5 text-red-600 border-0" />
        <span>Property Description boosts your ad.</span>
      </div>
    </>
  );
}
