import * as yup from "yup";
import { RoomDetails } from "./FormFields/FormConfig";
export const textOnly = yup
  .string()
  .matches(/^[A-Za-z\s]+$/, "Only letters allowed");

export const numberOnly = yup
  .number()
  .typeError("Must be a number")
  .positive("Must be positive");

export const basicDetailsSchema = yup.object({
  category_name: yup.string().required("Please Select Your Need"),
  propertyType: yup.string().required("Please Select Your Property Type"),
  subPropertyType: yup.string().when("propertyType", (propertyType, schema) => {
    return schema.required(
      propertyType === "Commercial"
        ? "Please select commercial type"
        : "Please select residential type"
    );
  }),
});

// location validation.
export const locationSchema = yup.object({
  locality: yup.string().required("Locality is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  city: yup.string().required("City is required"),
  street: yup.string().required("street is required"),
});

// Land schema
export const landSchema = yup.object({
  length: yup.string().required("Length is required"),
  breadth: yup.string().required("Breadth is required"),
  facing: yup.string().required("Facing is required"),
  approval: yup.string().required("Approval status is required"),
});

export const apartmentSchema = yup.object({
  totalFloors: yup.string().required("Total floors is required"),
  bhk: yup.string().required("BHK is required"),
  bedroom: yup.string().required("Bedroom is required"),
  bathroom: yup.string().required("Bedroom is required"),
  balcony: yup.string().required("Balcony is required"),
  plotfloors: yup.string().required("Plot floors is required"),
  parkingCount: yup.string().required("Parking Count is required"),
  projectStatus: yup.string().required("Project Status is required"),
  PropertyType: yup.string().required("Property Type is required"),
});

export const commonSchema = yup.object({
  price: yup
    .string()
    .transform((value) => (value ? value.replace(/\D/g, "") : ""))
    .required("Please Enter Price"),

  priceOption: yup.string().required("Please Select One Price Option"),

  feesOption: yup.string().required("Please Select One Fees Option"),

  propertyTitle: yup
    .string()
    .trim()
    .test(
      "not-only-spaces",
      "Property Title cannot be empty",
      (value) => value?.trim().length > 0
    )
    .max(200, "Title cannot exceed 200 characters")
    .required("Property Title is Required"),

  propertyDescription: yup
    .string()
    .trim()
    .test(
      "not-only-spaces",
      "Property Description cannot be empty",
      (value) => value?.trim().length > 0
    )
    .required("Property Description is Required"),

  landArea: yup
    .string()
    .trim()
    .test(
      "not-only-spaces",
      "Area of land cannot be empty",
      (value) => value?.trim().length > 0
    )
    .required("Area of land is required"),
});

export const aboutIndustrySchema = yup.object({
  landArea: yup.string().required("Area of land is required"),
  facing: yup.string().required("Please Select Direction"),
  PropertyType: yup.string().required("Please Select Your Type"),
  approval: yup.string().required("Please Choose Approved Or Not"),
});

export const aboutHouseSchema = yup.object({
  landArea: yup.string().required("Land Area is required"),
  landAreaUnit: yup.string().required("Please Select Land Area Unit"),
  buildArea: yup.string().required("Build Area is required"),
  buildAreaUnit: yup.string().required("Please Select Build Area Unit"),
  facing: yup.string().required("Please Select Direction"),
  PropertyType: yup.string().required("Please Select Your Property Type"),
});

export const getSchema = (subPropertyType) => {
  switch (subPropertyType) {
    case "Residential Plot":
      return commonSchema.concat(landSchema);
    case "residential_apartment":
      return commonSchema.concat(apartmentSchema);
    default:
      return commonSchema;
  }
};
