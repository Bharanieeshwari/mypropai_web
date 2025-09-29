import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // ✅ import navigate
import AfterLoginHeader from "../../components/common/AfterLoginHeader";
import PostPropertyNavbar from "@/components/PostProperty/PostPropetyHeader/PostPropertyNavbar";
import HelpSection from "@/components/PostProperty/PostPropertyLeftSection/HelpSection";
import FormProgressBar from "@/components/PostProperty/PostFormLayout/FormProgressBar";
import PostPropertyHome from "@/components/PostProperty/PostPropertyLeftSection/PostPropertyHome";

import BasicDetails from "@/components/PostProperty/PostFormLayout/FormSteps/BasicDetails";
import PropertyLocation from "@/components/PostProperty/PostFormLayout/FormSteps/PropertyLocation";
import AboutForm from "@/components/PostProperty/PostFormLayout/FormSteps/AboutForm";
import PostSuccess from "@/components/PostProperty/PostFormLayout/PostSuccess";
import AdditionalDetails from "@/components/PostProperty/PostFormLayout/FormSteps/AdditionalDetails";
import Footer from "@/components/common/Footer";
import { getPropertyById } from "@/lib/property";
import { getLoginUserData, isLoggedIn } from "@/utils/helpers";

const STEP_KEY = "PropertyFormStep";
const DATA_KEY = "PropertyFormData";
const VERSION_KEY = "PropertyFormVersion";

const steps = [
  BasicDetails,
  PropertyLocation,
  AboutForm,
  AdditionalDetails,
  PostSuccess,
];

function getEmptyForm() {
  return {
    location: {},
    details: {},
    photos: [],
  };
}

export default function PostProperty() {
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [getParamId] = useSearchParams();
  const [userId, setUserId] = useState("");
  const user_id = userId;
  useEffect(() => {
    const user_details = getLoginUserData();
    if (user_details?.user?.id) {
      setUserId(user_details.user.id);
    }
  }, []);
  const [formVersion, setFormVersion] = useState(() => {
    return localStorage.getItem(VERSION_KEY) || Date.now().toString();
  });

  const [stepIndex, setStepIndex] = useState(() => {
    const savedStep = localStorage.getItem(STEP_KEY);
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  // Form data
  const [formData, setFormData] = useState(() => {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const savedData = localStorage.getItem(DATA_KEY);

    if (savedData && savedVersion === formVersion) {
      return JSON.parse(savedData);
    }

    return getEmptyForm();
  });
  const subPropertyType = formData.subPropertyType;

  useEffect(() => {
    const loginVerification = isLoggedIn();
    if (!loginVerification) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const id = getParamId.get("id");

    if (id) {
      setEditId(id);
      localStorage.setItem("editId", id);
    } else {
      setEditId(null);
      localStorage.removeItem("editId");
    }
  }, [getParamId]);

  useEffect(() => {
    if (!editId) return;
    const alreadyEdited = localStorage.getItem(`EDITED_${editId}`);
    const cachedData = localStorage.getItem(`EDIT_DATA_${editId}`);

    if (alreadyEdited && cachedData) {
      setFormData(JSON.parse(cachedData));
      setIsEdit(true);
      setPropertyId(editId);
      setStepIndex(1);
    }
    const fetchPropertyData = async () => {
      try {
        const { data } = await getPropertyById({ propertyId: editId });
        console.log("get by id", data)
        const property = data?.property;
        if (!property) return;
        const formPayload = {
          title: property.title,
          description: property.description,
          price: property.price,
          area_sq_ft: property.area_value,
          area_unit: property.area_unit,
          subPropertyType: property.property_type,
          user_id: property?.owner?.id,
          category_name: property.category,
          priceOption: property.price_type,
          feesOption: property.registration_fee,
          cover_image: property.cover_image,
          location: {
            locality: property.location?.locality,
            landmark: property.location?.landmark,
            street: property.location?.street,
            apartment_society: property.location?.apartment_society,
            city: property.location?.city,
            state: property.location?.state,
            country: property.location?.country,
            pincode: property.location?.pincode,
            latitude: property.location?.latitude,
            longitude: property.location?.longitude,
          },
          details: {
            plot_area_sqft: property.details?.plot_area_sqft,
            plot_length_ft: { value: property.details?.plot_length_ft },
            plot_breadth_ft: { value: property.details?.plot_breadth_ft },
            facing: property.details?.facing,
            approval_status: property.details?.approval_status,
            approval_authority: property.details?.approval_authority,
            permissible_floors: property.details?.permissible_floors,
            corner_plot: property.details?.corner_plot,
            boundary_wall: property.details?.boundary_wall,
            open_sides_count: property.details?.open_sides_count,
            construction_done: property.details?.construction_done,
            road_size_sqft: property.details?.road_size_sqft,
          },
          photos: property.images || [],
          video: property.videos || [],
        };
        setFormData(formPayload);
        setIsEdit(true);
        setStepIndex(0);
        setPropertyId(editId);
      } catch (error) {
        console.error("Failed to fetch property data:", error);
      }
    };

    fetchPropertyData();
  }, [editId]);

  const CurrentStepComponent = steps[stepIndex];

  useEffect(() => {
    localStorage.setItem(STEP_KEY, stepIndex);
  }, [stepIndex]);

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(formData));
    localStorage.setItem(VERSION_KEY, formVersion);
  }, [formData, formVersion]);
  const handleMainDetails = (newBasicDetails) => {
    setFormVersion(Date.now().toString());
    setFormData({
      basicDetails: newBasicDetails,
    });
    setStepIndex(1);
  };
  const stepFormProps = {
    goToStep: setStepIndex,
    formData,
    setFormData,
    handleMainDetails,
    propertyId,
    setPropertyId,
    isEdit,
    user_id,
    subPropertyType,
    setIsEdit,
  };
  useEffect(() => {
    return () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.endsWith("_customOptions")) {
          localStorage.removeItem(key);
        }
      });

      localStorage.removeItem(STEP_KEY);
      localStorage.removeItem(DATA_KEY);
      localStorage.removeItem(VERSION_KEY);
    };
  }, []);

  return (
    <>
      <AfterLoginHeader />
      {stepIndex > 0 && stepIndex < steps.length - 1 && (
        <FormProgressBar
          currentStep={stepIndex}
          totalSteps={steps.length}
          onStepClick={(i) => setStepIndex(i)}
          formData={formData}
          isEdit={isEdit}
        />
      )}

      <div className="conatiner lg:max-w-[1440px] relative mx-auto">
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
          <div className="">
            {stepIndex === 0 ? (
              <PostPropertyHome />
            ) : (
              <HelpSection currentStep={stepIndex} formData={formData} />
            )}
          </div>

          {/* Form section */}
          <div className="flex justify-center sm:px-4  max-sm:p-5 lg:px-0 w-full max-w-[600px] mx-auto mb-8">
            <CurrentStepComponent {...stepFormProps} />
          </div>
        </div>
      </div>
      {/* {stepIndex == 4 && <Footer />} */}
    </>
  );
}
