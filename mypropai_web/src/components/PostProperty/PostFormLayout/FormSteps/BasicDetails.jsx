import { React, useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { basicDetailsSchema } from "../../Validation";
import { InputField } from "../../FormFields/FormElements";
import { InputFocus } from "./AboutForm";
import { canUserPostProperty } from "@/lib/property";
import { IoMdClose } from "react-icons/io";
import { getAllCategories, getAllPropertyType } from "@/lib/property";

export const PostPropertyButton =
  "rounded-full bg-[#FFD300] w-full h-11 text-[#0E0D10] text-[16px] text-center mt-8 cursor-pointer ";

function BasicDetails({ goToStep, formData, setFormData, isEdit, user_id }) {
  // states
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [residentialTypes, setResidentialTypes] = useState([]);
  const [commercialTypes, setCommercialTypes] = useState([]);
  const [showCanPost, setShowCanPost] = useState(false);
  const [showTostMessage, SetShowTostMessage] = useState(false);
  showTostMessage;
  const { control, handleSubmit, watch, setValue } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(basicDetailsSchema),
    defaultValues: {
      category_name: formData.category_name || "Sale",
      propertyType: formData.propertyType || "Residential",
      subPropertyType: formData.subPropertyType || "",
    },
  });

  // style
  const radioStyle =
    "rounded-full checked:bg-[#FFD300] border-2 border-[#FFD300] text-black cursor-pointer" +
    "data-[state=checked]:bg-yellow-400 " +
    "data-[state=checked]:border-yellow-400 "

  const others = formData.subPropertyType || {};

  // get available category

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        if (data.success && Array.isArray(data.categories)) {

          const options = data.categories.map((cat) => ({
            key: cat.value,
            label: cat.label,
          }));
          setCategoryOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const data = await getAllPropertyType();
        if (data?.property_types && Array.isArray(data.property_types)) {
          const residential = data.property_types.filter((item) =>
            item.value.toLowerCase().includes("residential")
          );
          const commercial = data.property_types.filter((item) =>
            item.value.toLowerCase().includes("commercial")
          );

          setResidentialTypes(
            residential.map(item => ({ key: item.value, label: item.label }))
          );
          setCommercialTypes(
            commercial.map(item => ({ key: item.value, label: item.label }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch property types:", error);
      }
    };

    fetchPropertyTypes();
  }, []);
  const propTypeOptions = [
    { key: "Residential", label: "Residential" },
    { key: "Commercial", label: "Commercial" },
  ];


  const onNext = handleSubmit(async () => {
    try {
      const res = await canUserPostProperty({ user_id: user_id });
      if (res?.can_post) {
        goToStep(1);
      } else {
        setShowCanPost(true);
        SetShowTostMessage(res.message);
      }
    } catch (error) {
      console.error("Error checking can post:", error);
      alert("Something went wrong. Try again later.");
    }
  });

  const watchedPropertyType =
    watch("propertyType") || formData.propertyType || "Residential";

  const onSubmit = () => { };

  useEffect(() => {
    if (!isEdit && watch("propertyType") !== formData.propertyType) {
      setFormData((prev) => ({
        ...prev,
        propertyType: watch("propertyType"),
        subPropertyType: "",
        details: {},
        photos: [],
      }));
    }
  }, [watch("propertyType"), formData.propertyType, isEdit, setFormData]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (!isEdit) {
      setFormData((prev) => ({
        ...prev,
        details: {},
      }));
    }
  }, [watch("subPropertyType"), isEdit, setFormData]);

  return (
    <div className="justify-center mt-10 bg-[#ECEAFF] text=[#36334D] h-fit w-[470px] rounded-lg mb-8 p-[30px]">
      <h2 className="text-[24px]  font-bold mb-[0px]">
        Start Posting Your Property
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PURPOSE */}
        <Label className="mt-6 text-[16px]">You're looking to</Label>
        <Controller
          control={control}
          name="category_name"
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup
                value={field.value || formData.category_name || ""}
                onValueChange={(val) => {
                  field.onChange(val);
                  updateField("category_name", val);
                }}
                className="flex mt-4 gap-6"
              >
                {categoryOptions.map(({ key, label }) => (
                  <div key={key} className="flex gap-3">
                    <RadioGroupItem
                      value={key}
                      id={key}
                      className={radioStyle}
                      disabled={isEdit}
                    />
                    <Label htmlFor={key} className="cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
              )}
            </>
          )}
        />

        {/* PROPERTY TYPE */}
        <Label className="mt-6 text-[16px]">Property Type</Label>
        <Controller
          name="propertyType"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <RadioGroup
              value={field.value || formData.propertyType || ""}
              onValueChange={(val) => {
                field.onChange(val);
                updateField("propertyType", val);
                setValue("subPropertyType", "");
                updateField("subPropertyType", "");
              }}
              className="flex mt-4 gap-6 cursor-pointer"
            >
              {propTypeOptions.map(({ key, label }) => (
                <div key={key} className="flex gap-3 cursor-pointer">
                  <RadioGroupItem
                    value={key}
                    id={key}
                    className={radioStyle}
                    disabled={isEdit}
                  />
                  <Label htmlFor={key} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
              )}
            </RadioGroup>
          )}
        />

        {/* COMMERCIAL TYPE */}
        <Controller
          name="subPropertyType"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="gap-2 mt-3">
                {(watchedPropertyType === "Residential"
                  ? residentialTypes
                  : commercialTypes
                ).map(({ key, label }) => (
                  <label key={key} className="cursor-pointer">
                    <input
                      type="radio"
                      value={key}
                      checked={field.value === key}
                      disabled={isEdit}
                      onChange={() => {
                        field.onChange(key);
                        updateField("subPropertyType", key);
                      }}
                      className="peer hidden"
                    />
                    <span className="inline-block px-3 py-2 mt-2 mr-2 text-sm bg-white rounded-full peer-checked:bg-[#FFE66C] cursor-pointer peer-checked:text-black peer-disabled:cursor-not-allowed">
                      {label}
                    </span>
                  </label>
                ))}
                {others === "others" && (
                  <input
                    type="text"
                    className={`bg-white border-b-2 rounded-md mt-3 inline border-black ${InputFocus}`}
                    onChange={(e) =>
                      updateField("subPropertyTypeOther", e.target.value)
                    }
                  />
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-3">{error.message}</p>
              )}
            </>
          )}
        />
        {isEdit ? (
          <Button
            type="button"
            className={PostPropertyButton}
            onClick={() => {
              goToStep(1);
            }}
          >
            Next
          </Button>
        ) : (
          <Button type="button" className={PostPropertyButton} onClick={onNext}>
            Post Property Free
          </Button>
        )}
      </form>
      {/* pop up messages contaier */}
      {showCanPost && (
        <div className="fixed inset-0 flex items-start justify-center  bg-[#2B2A36CC]/70  z-50 p-4">
          <div className="relative text-[#36334D] top-20  bg-white mx-10 py-10 p-[20px]">
            <button
              className="absolute top-3 right-8 text-white text-2xl z-10"
              onClick={() => {
                setShowCanPost(false);
              }}
            >
              <IoMdClose className="absolute  cursor-pointer text-black" />
            </button>
            <div>{showTostMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicDetails;
