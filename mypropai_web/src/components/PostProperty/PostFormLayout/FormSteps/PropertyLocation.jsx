import React, { useState } from "react";
import axios from "axios";
import { PostPropertyButton } from "./BasicDetails";
import { Button } from "@/components/ui/button";
import { InputField, LabelField } from "../../FormFields/FormElements";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CityData from "../../../../Data/PostProperty/DummyCityData";
import { locationSchema } from "../../Validation";
import location_icon from "../../../../assets/postproperty/location_icon_mypai.svg";
import PlusIcon from "../../../../assets/postproperty/plus-icon.svg";
import { PINCODE_KEY } from "@/lib/api";

// function
import { capitalizeFirstLetter } from "@/utils/helpers";

const PropertyLocation = ({ goToStep, formData, setFormData }) => {
  const [searchText, setSearchText] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [, setSelectedCity] = useState("");
  const [localityOptions, setLocalityOptions] = useState([]);
  const [selectPincode, setSelectPincode] = useState("");
  const [isStreet, setIsStreet] = useState(true);
  const [isApartment, setIsApartment] = useState(false);

  const methods = useForm({
    resolver: yupResolver(locationSchema),
    mode: "all",
    shouldFocusError: true,

    defaultValues: {
      city: formData.location?.city || "",
      locality: formData.location?.locality || "",
      landmark: formData.location?.landmark || "",
      pincode: formData.location?.pincode || "",
      street: formData.location?.street || "",
      apartment: formData.location?.apartment_society || "",
    },
  });

  const { handleSubmit } = methods;

  const isPincodeValid = formData?.location?.pincode?.length === 6;

  // hellper functions
  const landmarkValidate = (val) =>
    val.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g, "");


  const CityOption = CityData.map((city) => ({
    label: city.Region,
    value: city.Region,
  }));
  const filteredCities = CityOption.filter(
    (opt) =>
      searchText && opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Storing values to fomrdata onChange
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const textOnly = (val) => val.replace(/[^a-zA-Z\s]/g, "");

  const api = axios.create({
    baseURL:
      "https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd",
  });
  const API_KEY = `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=${PINCODE_KEY}&`;

  // get city,state,latitude ,longitude,localities by pincode
  const getCity = async (pincode) => {
    try {
      const response = await api.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const location_data = response?.data[0]?.PostOffice || [];
      const localities = [
        ...new Set(location_data.map((c) => (c.Name))),
      ];
      setLocalityOptions(localities);
      const cityNames = [...new Set(location_data.map((c) => c.Region))];
      const stateName = [...new Set(location_data.map((c) => c.State))];
      const countryName = [...new Set(location_data.map((c) => c.Country))];


      if (location_data.length <= 0) {
        methods.setError("pincode", {
          type: "manual",
          message: "No List found in this pincode",
        });
        updateField("city", "");
        setSearchText("");
      } else {
        methods.clearErrors("city");
        updateField("state", capitalizeFirstLetter(stateName[0]));
        updateField("country", capitalizeFirstLetter(countryName[0]));


        if (cityNames.length > 0) {
          const city = capitalizeFirstLetter(cityNames[0]);
          setSearchText(city);
          setSelectedCity(city);
          updateField("city", city);
          methods.setValue("city", city, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching city:", err);
    }
  };

  // get latittude and longitude by geolocation api
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          updateField("Latitude", lat);
          updateField("Longitude", lon);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied. Please enable location services.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get location timed out.");
              break;
            default:
              alert("An unknown error occurred while fetching location.");
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const onSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, ...data },
    }));
    goToStep(2);
  };

  const handleLocalityChange = (val) => {
    updateField("locality", val);

    if (val.length > 0) {
      getPincodeCity(val);
    } else {
      setSelectedCity("");
      setSelectPincode("");
    }
  };

  // detect if error naviagte to that field
  const onError = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      errorElement.focus();
    }
  };
  return (
    <div className="justify-center mt-7 mx-7 mb-auto bg-[#ECEAFF] h-fit rounded-lg p-[30px]">
      <h2 className="text-[24px] font-bold mb-3">Property Location</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {/* City & Pincode */}
          <div className="flex gap-3">
            <div className="relative w-64">
              <LabelField htmlFor="City" labelClass="mb-2">
                City
              </LabelField>
              <InputField
                {...methods.register("city")}
                type="text"
                value={searchText || formData?.location.city}
                onChange={(e) => {
                  setShowCityDropdown(true);
                  const val = capitalizeFirstLetter(textOnly(e.target.value));
                  setSearchText(val);
                  methods.setValue("city", val, { shouldValidate: true });
                }}
                placeholder="Please Enter Your City"
                inputClass={`w-full px-3 py-2 border ${methods.formState.errors.city
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:ring-1 focus:ring-purple-500"
                  }`}
              />

              {methods.formState.errors.city && (
                <p className="text-red-500 text-sm mt-2 ml-2">
                  {methods.formState.errors.city.message}
                </p>
              )}
              {showCityDropdown && (
                <div className="absolute mt-1 border text-sm text-[#4B0082]  bg-white border-purple-400 shadow-purple-200 max-h-40 overflow-auto text-center rounded   w-full z-10">
                  <ul>
                    {filteredCities.length > 0
                      ? filteredCities.map((opt) => (
                        <li
                          key={opt.value}
                          className="p-2 hover:shadow-[0_0_10px_#FFFFF] cursor-pointer rounded"
                          onClick={() => {
                            setSelectedCity(opt.label);
                            setSearchText(opt.label);
                            setShowCityDropdown(false);
                            updateField("city", opt.label);
                          }}
                        >
                          {opt.label}
                        </li>
                      ))
                      : "No Result Found"}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <LabelField htmlFor="pincode" labelClass="mb-2">
                Pincode
              </LabelField>
              <Controller
                name="pincode"
                control={methods.control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    type="tel"
                    placeholder="Enter Pincode"
                    inputClass="rounded-sm"
                    value={field.value || ""}
                    onChange={(e) => {
                      setShowCityDropdown(false);
                      let value = e.target.value.replace(/^0+|[^0-9]/g, "");

                      if (value.length > 6) value = value.slice(0, 6);
                      field.onChange(value);
                      updateField("pincode", value);
                      if (value.length === 6) {
                        getCity(value);
                      } else {
                        setShowCityDropdown(false);
                        updateField("city", "");
                        setSearchText("");
                      }
                    }}
                  />
                )}
              />
              {methods.formState.errors.pincode && (
                <p className="text-red-500 text-sm mt-2 ml-1">
                  {methods.formState.errors.pincode.message}
                </p>
              )}
            </div>
          </div>
          <div
            className="mt-2 ml-2 text-xs text-[#3B3898] font-bold cursor-pointer"
            onClick={detectLocation}
          >
            <span>
              <img src={location_icon} alt="" className="inline mr-2" />
            </span>
            Detect My Location
          </div>

          {/* Locality */}
          <div className="relative mt-4">
            <LabelField htmlFor="locality" labelClass="mb-2">
              Locality
            </LabelField>
            <Controller
              name="locality"
              control={methods.control}
              render={({ field }) => (
                <div className="relative">
                  <InputField
                    {...field}
                    value={field.value || "" || selectPincode}
                    placeholder="Enter Your locality"
                    inputClass="mt-0 mb-2 rounded-sm"
                    onChange={(e) => {
                      const value = capitalizeFirstLetter(textOnly(e.target.value));
                      field.onChange(value);
                      updateField("locality", value);
                      if (value.length > 0) {
                        setLocalityOptions(localityOptions);
                        handleLocalityChange(value);
                      }
                    }}
                    onFocus={() => {
                      if (field.value || localityOptions.length > 0) {
                        setLocalityOptions(localityOptions);
                      }
                    }}
                    disabled={isPincodeValid}
                  />
                  {localityOptions.length > 0 && (
                    <div className="absolute mt-1 border border-purple-400 shadow-purple-200 max-h-40 overflow-auto text-center text-sm text-[#4B0082] rounded shadow bg-white w-[250px] z-10 ">
                      <ul>
                        {localityOptions.map((value, index) => (
                          <li
                            key={value + index}
                            className="p-2 hover:bg-purple-100 bg-[#F9FAFB] cursor-pointer "
                            onClick={() => {
                              field.onChange(value);
                              updateField("locality", value);
                              setLocalityOptions([]);
                            }}
                          >
                            {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
          {methods.formState.errors.locality && (
            <p className="text-red-500 text-sm mt-2 ml-1">
              {methods.formState.errors.locality.message}
            </p>
          )}

          {isStreet && (
            <>
              <LabelField htmlFor="street" labelClass="mb-2 mt-5" >
                Street
              </LabelField>
              <Controller
                name="street"
                control={methods.control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    value={field.value || ""}
                    placeholder="Enter street address "
                    inputClass="mt-0 mb-2 rounded-sm"
                    onChange={(e) => {
                      const value = capitalizeFirstLetter(e.target.value);
                      field.onChange(value);
                      updateField("street", value);
                    }}
                  />
                )}
              />
              {methods.formState.errors.street && (
                <p className="text-red-500 text-sm mt-2 ml-1">
                  {methods.formState.errors.street.message}
                </p>
              )}

            </>
          )}
          {/* Landmark */}
          <div className="mt-5">
            <LabelField htmlFor="landmark" labelClass="mb-2" optional>
              Land Mark
            </LabelField>
            <Controller
              name="landmark"
              control={methods.control}
              render={({ field }) => (
                <InputField
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter Your landmark"
                  inputClass="mt-0 mb-2 rounded-sm"
                  onChange={(e) => {
                    const value = capitalizeFirstLetter(landmarkValidate(e.target.value));
                    field.onChange(value);
                    updateField("landmark", value);
                  }}
                />
              )}
            />
          </div>

          {isApartment && (
            <>
              <LabelField htmlFor="street" labelClass="mb-2 mt-5" optional>
                Apartment/Society
              </LabelField>
              <Controller
                name="apartment"
                control={methods.control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    value={field.value || ""}
                    placeholder="Enter apartment/society "
                    inputClass="mt-0 mb-2 rounded-sm"
                    onChange={(e) => {
                      const value = capitalizeFirstLetter(e.target.value);
                      field.onChange(value);
                      updateField("apartment_society", value);
                    }}
                  />
                )}
              />
            </>
          )}
          <div className="mt-5 flex gap-5">
            {!isStreet && (
              <div
                className=" cursor-pointer hover:underline decoration-purple-700 "
                onClick={() => setIsStreet(true)}
              >
                <img
                  src={PlusIcon}
                  alt="address"
                  className=" w-[13px] h-[14px] inline text-center mr-1 mb-0.5 text-[#493f99] "
                />
                <span className="text-sm text-[#493F99] font-semibold ">
                  Add Street
                </span>
              </div>
            )}
            {!isApartment && (
              <div
                className=" cursor-pointer hover:underline decoration-purple-700 "
                onClick={() => setIsApartment(true)}
              >
                <img
                  src={PlusIcon}
                  alt="apartment"
                  className=" w-[13px] h-[14px] inline text-center mr-1 mb-0.5 text-[#493f99] "
                />
                <span className="text-sm text-[#493F99] font-semibold ">
                  Add Apartment/Society
                </span>
              </div>
            )}
          </div>

          <Button className={PostPropertyButton} type="submit">
            Next
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default PropertyLocation;
