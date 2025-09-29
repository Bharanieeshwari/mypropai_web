// conditional rendering fomr data// config/fieldConfig.js
export const fieldConfig = {
  "Residential Plot": [
    "landArea",
    "dimension",
    "facing",
    "approval",
    "floorsAllowed",

    // additional details
    "cornerPlot",
    "openSides",
    "construction",
    "wallBoundry",
    "roadsize",
  ],
  "Residential Apartment": [
    "bhk",
    "RoomDetails",
    "facing",
    "floors",
    "buildupArea",
    "parking",
    "lookingfor",
    "projectstatus",

    // additional details
    "construction",
    "roadsize",
    "amenities",
    "waterFacility",
    "floorTypes",
  ],
  House: ["bedrooms", "bathrooms", "plotArea", "garden", "parking"],
  FarmHouse: ["plotArea", "waterSource", "garden"],
};

export const shouldShowField = (fieldName, propertyType) => {
  return fieldConfig[propertyType]?.includes(fieldName);
};

// Constant Values

import { useState } from "react";
export const priceTypeOptions = [
  { key: "fixed", label: "Fixed price" },
  { key: "negotiable", label: "Price negotiable" },
];

export const FeesType = [
  { key: "included", label: "Included Registration Fee" },
  { key: "excluded", label: "Excluded Registration Fee" },
];
export const Authority = [
  { key: "CMDA", label: "CMDA" },
  { key: "DTCP", label: "DTCP" },
  { key: "TNHB", label: "TNHB" },
];
export const selectUnits = [
  { key: "sq_ft", label: "Sq.ft" },
  { key: "sqm", label: "Sqm" },
  { key: "acres", label: "Acres" },
  { key: "hectares", label: "Hectares" },
];
export const FacingDirection = [
  { key: "north", label: "North" },
  { key: "south", label: "South" },
  { key: "east", label: "East" },
  { key: "west", label: "West" },
  { key: "northeast", label: "North-East" },
  { key: "northwest", label: "North-West" },
  { key: "southeast", label: "South-East" },
  { key: "southwest", label: "South-West" },
];

// export const ApprovalOptions = ["Government Approved", "Non-Approved"];
export const ApprovalOptions = [
  { key: "Government Approved", label: "Government Approved" },
  { key: "Non-Approved", label: "Non-Approved" },
];

export const PropertyType = ["New Property", "Resale Property"];

export const RoomDetails = {
  bedroom: ["1", "2", "3", "4"],
  balcony: ["1", "2", "3", "4"],
  bathroom: ["1", "2", "3", "4"],
  plotfloors: ["Ground", "1", "2", "3", "4"],
};

export const floorDetails = {
  "Total no.of floor": ["Ground", "1", "2", "3", "4"],
};

export const FloorTypes = ["Tiles", "Marbles", "Cement", "Vitrified"];

export const ProjectStatusOptions = ["Completed", "Under-Construction"];

export const bhk = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "1RK/1BHK"];

export const parkingTypes = [
  { label: "Covered Parking", key: "covered" },
  { label: "Open Parking", key: "open" },
];

export const WaterFacility = [
  "Municipal Corporation",
  "Bore/Tank",
  "24*7 Water",
];

export const amenities = [
  {
    key: "gatedCommunity",
    label: "Gated Community",
    options: ["Yes", "No"],
  },
  {
    key: "drainageSystem",
    label: "Drainage System",
    options: ["Yes", "No"],
  },
  {
    key: "playArea",
    label: "Play Area",
    options: ["Yes", "No"],
  },
];
export const residentialTypes1 = [
  { key: "Residential Plot", label: "Residential Land" },
  { key: "residential_apartment", label: "Residential Apartment" },
  { key: "independent_villa", label: "Independent House/Villa" },
  { key: "studio_apartment", label: "1 RK/Studio Apartment" },
  { key: "service_apartment", label: "Service Apartment" },
  { key: "farm_house", label: "Farm House" },
  { key: "others", label: "Others" },
];

export const commercialTypes1 = [
  { key: "Commercial Plot", label: "Commercial Land" },
  { key: "shops_retail", label: "Shops and Retails" },
  { key: "factory", label: "Factory and Manufacturing" },
  { key: "warehouse", label: "Warehouse" },
  { key: "hotel_resort", label: "Hotel and Resorts" },
  { key: "others", label: "Others" },
];

export const locationFields = [
  { name: "city", label: "City", placeholder: "Enter City" },
  { name: "locality", label: "Locality", placeholder: "Enter Locality" },
  { name: "landmark", label: "Landmark", placeholder: "Enter Landmark" },
];

// =======================
// Reusable Hook
// =======================

export const useAboutFormState = (formData, residentialType) => {
  // type marginTop:
  const typeMap = {
    "Residental Apartment": "apart",
    "Service Apartment": "apart",
    "Residential Plot": "land",
    "Commercial Land": "land",
    "Residental Industry": "industry",
    "Factory and Manufacturing": "industry",
    "Farm House": "house",
    "Independet House/Villa": "house",
    "Hotel and Resorts": "house",
    Warehouse: "house",
    "Shops and Retails": "house",
    "1 RK/Studio Apartment": "apart",
  };
  // Core property fields
  const [propertyType, setPropertyType] = useState(
    formData.about?.propertyType || ""
  );
  const [buildArea, setBuildArea] = useState(formData.about?.buildArea || "");
  const [landAreaUnit, setLandAreaUnit] = useState(
    formData.about?.landAreaUnit || "Sq.ft"
  );
  const [buildAreaUnit, setBuildAreaUnit] = useState(
    formData.about?.buildAreaUnit || "Sq.ft"
  );
  const [Room, SetRoom] = useState(formData.about?.Room || {});
  const [facing, setFacing] = useState(formData.about?.facing || "");
  const [parkingCount, setParkingCount] = useState(
    formData.about?.[typeMap]?.parkingCount || { covered: 0, open: 0 }
  );
  const [selectedBhk, setSelectedBhk] = useState(
    formData.about?.selectedBhk || { type: "" }
  );
  const [furnished, setFurnished] = useState(
    residentialType === "Service Apartment"
      ? "Fully-Furnished"
      : formData.about?.furnished || ""
  );
  const [roadSize, setRoadSize] = useState(formData.about?.roadSize || "");
  const [roadSizeUnit, setRoadSizeUnit] = useState(
    formData.about?.roadSizeUnit || "Sq.ft"
  );
  const [waterFacility, setWaterFacility] = useState(
    formData.about?.[typeMap]?.waterFacility || []
  );
  const [optionalAmenities, setOptionalAmenities] = useState(
    formData.about?.optionalAmenities || {}
  );
  const [approval, setApproval] = useState(formData.about?.approval || "");
  const [projectStatus, setProjectStatus] = useState(
    formData.about?.[typeMap]?.projectStatus || ""
  );
  const [floorTypes, SetFloortype] = useState(
    formData.about?.[typeMap]?.floorTypes || []
  );

  // Land-specific fields
  const [length, setLength] = useState(formData.about?.length || "");
  const [breadth, setBreadth] = useState(formData.about?.breadth || "");
  const [frontage, setFrontage] = useState(formData.about?.frontage || "");
  const [frontageUnit, setFrontageUnit] = useState(
    formData.about?.frontageUnit || "Sq.ft"
  );

  return {
    propertyType,
    setPropertyType,
    buildArea,
    setBuildArea,
    landAreaUnit,
    setLandAreaUnit,
    buildAreaUnit,
    setBuildAreaUnit,
    Room,
    SetRoom,
    facing,
    setFacing,
    parkingCount,
    setParkingCount,
    selectedBhk,
    setSelectedBhk,
    furnished,
    setFurnished,
    roadSize,
    setRoadSize,
    roadSizeUnit,
    setRoadSizeUnit,
    waterFacility,
    setWaterFacility,
    optionalAmenities,
    setOptionalAmenities,
    approval,
    setApproval,
    projectStatus,
    setProjectStatus,
    floorTypes,
    SetFloortype,
    length,
    setLength,
    breadth,
    setBreadth,
    frontage,
    setFrontage,
    frontageUnit,
    setFrontageUnit,
  };
};
