import React, { useEffect, useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { PostPropertyButton } from "../FormSteps/BasicDetails";
import { FormProvider, useForm, Controller } from "react-hook-form";
import {
  InputField,
  SelectField,
  RadioButton,
  LabelField,
} from "../../FormFields/FormElements";
import {
  selectUnits,
  FacingDirection,
  ApprovalOptions,
  useAboutFormState,
} from "../../FormFields/FormConfig";
import { landSchema } from "../../Validation";
import { yupResolver } from "@hookform/resolvers/yup";
import PropertyPhotos from "../FormSteps/PropertyPhotos";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check } from "lucide-react";
import { capitalizeFirstLetter, formatCurrency } from "@/utils/helpers";

const FeesType = ["Included Registration Fee", "Excluded Registration fee"];

// import api
import { incrementPostProperty, postProperty } from "@/lib/property";
import { InputFocus } from "../FormSteps/AboutForm";

const Authority = [
  { key: "CMDA", label: "CMDA" },
  { key: "DTCP", label: "DTCP" },
  { key: "TNHB", label: "TNHB" },
];

const AboutLand = ({
  goToStep,
  setFormData,
  formData,
  setPropertyId,
  isEdit,
  user_id,
}) => {
  const [loading, setLoading] = useState(false);
  const priceTypeOptions = [
    { key: "fixed", label: "Fixed price" },
    { key: "negotiable", label: "Price negotiable" },
  ];

  const FeesType = [
    { key: "included", label: "Included Registration Fee" },
    { key: "excluded", label: "Excluded Registration Fee" },
  ];
  const lastFormattedPriceRef = useRef("");

  const { setApproval } = useAboutFormState(formData);
  const methods = useForm({
    shouldFocusError: true,
    mode: "all",
    resolver: yupResolver(landSchema),
    defaultValues: {
      landArea: formData.details?.plot_area_sqft || "",
      landAreaUnit: formData?.area_unit ?? "sq_ft",
      length: formData.details?.plot_length_ft?.value || "",
      breadth: formData.details?.plot_breadth_ft?.value || "",
      facing: formData.details?.facing || "",
      approval: formData?.details?.approval_status || "",
      authority: formData?.details?.approval_authority || "",
      price: formData?.price || "",
      price_sqft: formData?.area_sq_ft || "",
      priceOption: formData?.priceOption || "",
      feesOption: formData?.feesOption ?? "excluded",
      propertyTitle: formData?.title || "",
      propertyDescription: formData?.description || "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = methods;

  const onError = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      errorElement.focus();
    }
  };

  const updateUnChangedField = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setFormData]
  );
  const landArea = methods.watch("landArea");
  const price = methods.watch("price");
  useEffect(() => {
    if (!landArea || !price) return;
    const area = parseFloat(landArea || 0);
    const expPrice = parseFloat(price || 0);
    if (area <= 0 || expPrice <= 0) return;
    const pricePerUnit = Math.round(expPrice / area);
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      currency: "INR",
      maximumFractionDigits: 0,
      useGrouping: false,
    }).format(pricePerUnit);

    if (lastFormattedPriceRef.current !== formattedPrice) {
      lastFormattedPriceRef.current = formattedPrice;
      updateUnChangedField("area_sq_ft", formattedPrice);
      methods.setValue("area_sq_ft", formattedPrice, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [landArea, price, updateUnChangedField, methods]);

  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        details: { ...prev.details, [field]: value },
      }));
    },
    [setFormData]
  );

  const hanldePostSubmit = async () => {
    try {
      const finalData = {
        ...formData,
        details: { ...formData.details, ...formData },
        user_id,
      };
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await postProperty(finalData, token);
      const post_id = response?.property_id;
      if (post_id) {
        if (setPropertyId) {
          setPropertyId(post_id);
        }

        try {
          const res = await incrementPostProperty({ user_id });

          if (res?.success) {
            console.log("Incremented ", res.message);
            alert(res.message);
          } else {
            console.error("Increment failed:", res?.message);
            alert(res?.message || "Failed to increment property count.");
          }
        } catch (error) {
          console.error("Increment API error:", error);
          alert("Something went wrong while incrementing property count.");
        }
      }

      goToStep(4);
    } catch (error) {
      console.error("Error posting property:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formData?.area_unit) {
      setFormData((prev) => ({ ...prev, area_unit: "sq_ft" }));
    }

    if (!formData?.feesOption) {
      setFormData((prev) => ({ ...prev, feesOption: "excluded" }));
    }
  }, [formData, setFormData]);

  useEffect(() => {
    reset({
      landArea: formData.details?.plot_area_sqft || "",
      length: formData.details?.plot_length_ft?.value || "",
      breadth: formData.details?.plot_breadth_ft?.value || "",
      facing: formData.details?.facing || "",
      approval: formData?.details?.approval_status || "",
      authority: formData?.details?.approval_authority || "",
      price: formData?.price || "",
      price_sqft: formData?.area_sq_ft || "",
      priceOption: formData?.priceOption || "",
      feesOption: formData?.feesOption ?? "excluded",
      propertyTitle: formData?.title || "",
      landAreaUnit: formData?.area_unit ?? "sq_ft",
      propertyDescription: formData?.description || "",
    });
  }, [formData, reset]);

  const onSubmit = () => {
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-start justify-center  bg-[#2B2A36CC]/70  z-50 p-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {/* Property Title */}
          <div className="mt-6">
            <Label
              htmlFor="propertyTitle"
              className="block text-lg font-medium text-gray-900"
            >
              Property Title
            </Label>
            <Controller
              name="propertyTitle"
              control={control}
              rules={{
                required: "Title is required",
                maxLength: {
                  value: 200,
                  message: "Title cannot exceed 200 characters",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputField
                    {...field}
                    id="propertyTitle"
                    type="text"
                    placeholder="Enter Title for Property"
                    inputClass={`mt-3 w-full h-10 rounded-md border ${
                      fieldState.error ? "border-red-500" : "border-gray-300"
                    } bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-400 ${InputFocus}`}
                    onChange={(e) => {
                      const value = capitalizeFirstLetter(e.target.value);
                      if (value.length <= 200) {
                        field.onChange(value);
                        updateUnChangedField("title", value);
                      }
                    }}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Property Description */}
          <div className="mt-6">
            <Label
              htmlFor="propertyDescription"
              className="block text-lg font-medium  text-gray-900"
            >
              Property Description
            </Label>
            <Controller
              name="propertyDescription"
              control={control}
              defaultValue={formData?.description || ""}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter benefit and advantage of your property"
                  className={`mt-3 h-[90px] w-full rounded-md border-0 bg-white px-4 pt-4 text-base text-gray-900 placeholder:text-gray-400 ${InputFocus}`}
                  onChange={(e) => {
                    const val = capitalizeFirstLetter(e.target.value);
                    field.onChange(val);
                    updateUnChangedField("description", val);
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

          {/* Land Area */}
          <LabelField
            htmlFor="landArea"
            children="Land Area"
            labelClass="mb-2 mt-4"
          />
          <div className="relative">
            <Controller
              name="landArea"
              control={control}
              defaultValue={formData.details?.plot_area_sqft || ""}
              render={({ field }) => (
                <InputField
                  {...field}
                  placeholder="Enter your land area"
                  inputClass="w-full"
                  type="text"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                    updateField("plot_area_sqft", value);
                  }}
                />
              )}
            />

            <div className="absolute pr-3 top-1 right-0">
              <Controller
                name="landAreaUnit"
                control={control}
                defaultValue={formData?.area_unit ?? "sq_ft"}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      updateUnChangedField("area_unit", val);
                    }}
                    options={selectUnits}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between ">
            {errors?.landArea && (
              <span className="text-red-500 text-sm ml-3 mt-1">
                {errors.landArea.message}
              </span>
            )}

            {errors?.landAreaUnit && (
              <span className="text-red-500 text-sm mr-2 mt-1">
                {errors.landAreaUnit.message}
              </span>
            )}
          </div>

          {/* Dimensions */}
          <LabelField htmlFor="Dimension" labelClass="mt-6">
            Dimension
          </LabelField>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <Controller
                name="breadth"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <div className="relative mt-3 grow">
                      <InputField
                        {...field}
                        type="text"
                        placeholder="Enter Breadth"
                        value={field.value ?? ""}
                        inputClass="w-full"
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(val);
                          updateField("plot_breadth_ft", {
                            value: val,
                            unit: "Sq.ft",
                          });
                        }}
                        onInput={(e) =>
                          (e.currentTarget.value =
                            e.currentTarget.value.replace(/[^0-9]/g, ""))
                        }
                      />

                      <div className="pr-3 absolute top-3 right-0 text-xs">
                        Sq.ft
                      </div>
                    </div>
                    <div>
                      {fieldState.error && (
                        <p className="text-red-500 text-sm ml-3 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Controller
                name="length"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <div className="relative mt-3">
                      <InputField
                        {...field}
                        type="text"
                        placeholder="Enter Length"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(val);
                          updateField("plot_length_ft", {
                            value: val,
                            unit: "Sq.ft",
                          });
                        }}
                        onInput={(e) =>
                          (e.currentTarget.value =
                            e.currentTarget.value.replace(/[^0-9]/g, ""))
                        }
                      />
                      <div className="pr-3 absolute top-3 right-0 text-xs ">
                        Sq.ft
                      </div>
                    </div>
                    {fieldState.error && (
                      <p className="text-red-500 text-sm ml-3 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <Label
            htmlFor="price"
            className="mt-5 block text-lg font-medium text-gray-900"
          >
            Property Price Details
          </Label>
          <div className="mt-2 flex gap-3 ">
            <div>
              {/* Expected Price */}
              <div className=" w-[280px] relative ">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputField
                        {...field}
                        id="price"
                        type="text"
                        placeholder="Enter Your Expected Price"
                        inputClass="p-5 h-10  rounded-md  bg-white pl-7 pr-3 text-base  text-gray-900 placeholder:ml-5 placeholder:text-gray-400"
                        value={field.value ? formatCurrency(field.value) : ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          e.target.value = val;
                          field.onChange(e);
                          updateUnChangedField("price", e.target.value);
                        }}
                      />
                      <span className="text-base absolute top-2.5 left-2 text-gray-500">
                        ₹
                      </span>
                    </>
                  )}
                />
              </div>
              <div className="ml-5 mt-1">
                {errors.price && (
                  <div className="text-red-500 text-sm">
                    {errors.price?.message}
                  </div>
                )}
              </div>
            </div>

            {/* Price per Sq.ft */}
            <div className=" relative pl-3">
              <div>
                <Controller
                  name="price_sqft"
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
                        }}
                        disabled={true}
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
          {/* Price Inputs */}

          {/* Price Type Checkboxes */}
          <div className="mt-6 flex gap-4">
            <Controller
              name="priceOption"
              control={control}
              defaultValue={formData.details?.priceOption || ""}
              render={({ field }) =>
                priceTypeOptions.map((typeObj, idx) => (
                  <Label
                    key={idx}
                    className="flex items-center text-[#4B476B] gap-2 text-sm cursor-pointer"
                  >
                    <div
                      className={`h-5 w-5 border-2 rounded-sm flex items-center justify-center
        ${
          field.value === typeObj.key
            ? "bg-[#FCCB02] border-[#FCCB02]"
            : "border-[#FCCB02]"
        }
      `}
                    >
                      {field.value === typeObj.key && (
                        <Check size={14} className="text-black" />
                      )}
                    </div>

                    <input
                      type="radio"
                      {...field}
                      value={typeObj.key}
                      checked={field.value === typeObj.key}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateUnChangedField("priceOption", e.target.value);
                      }}
                      className="hidden"
                    />

                    <span>{typeObj.label}</span>
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
              name="feesOption"
              control={control}
              defaultValue={formData?.feesOption ?? "excluded"}
              render={({ field }) =>
                FeesType.map((typeObj, idx) => (
                  <Label
                    key={idx}
                    className="flex mt-3 text-sm text-[#4B476B] font-medium cursor-pointer"
                  >
                    <div
                      className={`h-5 w-5 border-2 rounded-sm flex items-center justify-center
        ${
          field.value === typeObj.key
            ? "bg-[#FCCB02] border-[#FCCB02]"
            : "border-[#FCCB02]"
        }
      `}
                    >
                      {field.value === typeObj.key && (
                        <Check size={14} className="text-black" />
                      )}
                    </div>

                    <input
                      type="radio"
                      {...field}
                      value={typeObj.key}
                      checked={field.value === typeObj.key}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateUnChangedField("feesOption", e.target.value);
                      }}
                      className="hidden"
                    />

                    <span>{typeObj.label}</span>
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

          {/* Facing */}
          <LabelField htmlFor="facing" labelClass="mt-6">
            Facing
          </LabelField>
          <Controller
            name="facing"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <RadioButton
                  name={field.name}
                  options={FacingDirection}
                  value={field.value ?? ""}
                  onChange={(val) => {
                    field.onChange(val);
                    updateField("facing", val);
                  }}
                />
                {fieldState?.facing?.error && (
                  <p className="text-red-500">
                    {fieldState?.facing?.error.message}
                  </p>
                )}
              </>
            )}
          />

          {/* Approval */}
          <LabelField htmlFor="approval" labelClass="mt-6 mb-3">
            Approval
          </LabelField>
          <Controller
            name="approval"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <RadioButton
                  name={field.name}
                  options={ApprovalOptions}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setApproval(val);
                    updateField("approval_status", val);
                  }}
                  labelClass="w-fit h-fit py-2 text-[#36334D]"
                />
                {fieldState.error && (
                  <p className="text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />

          {/* Conditionally render authority field */}
          {formData.details?.approval_status === "Government Approved" && (
            <>
              <LabelField htmlFor="authority" labelClass="mt-6 mb-3" optional>
                Approval Authority
              </LabelField>
              <RadioButton
                name="authority"
                options={Authority}
                value={formData.details?.approval_authority}
                onChange={(val) => {
                  updateField("approval_authority", val);
                }}
                labelClass="w-fit h-fit py-2"
              />
            </>
          )}

          {/* importing photos component */}
          <PropertyPhotos
            formData={formData}
            setFormData={setFormData}
            isEdit={isEdit}
          />
          {isEdit ? (
            <Button
              type="submit"
              className={`${PostPropertyButton} mt-0`}
              onClick={() => {
                goToStep(3);
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className={`${PostPropertyButton} mt-0`}
              onClick={() => {
                hanldePostSubmit();
              }}
            >
              Post the Property
            </Button>
          )}
        </form>
      </FormProvider>
    </>
  );
};

export default AboutLand;
