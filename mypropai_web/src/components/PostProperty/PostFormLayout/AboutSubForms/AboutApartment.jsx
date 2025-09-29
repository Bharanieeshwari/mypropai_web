import React from "react";
import { Label } from "@/components/ui/label";
import { PostPropertyButton } from "../FormSteps/BasicDetails";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  InputField,
  SelectField,
  RadioButton,
  FurnishedStatus,
  ParkingCounter,
  LabelField,
  Checkbox,
  ControlledField,
} from "../../FormFields/FormElements";
import {
  selectUnits,
  FacingDirection,
  ApprovalOptions,
  useAboutFormState,
  PropertyType,
  bhk,
  RoomDetails,
  parkingTypes,
  WaterFacility,
  amenities,
  FloorTypes,
  ProjectStatusOptions,
} from "../../FormFields/FormConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { aboutApartmentSchema } from "../../Validation";
import { Controller } from "react-hook-form";
import { InputFocus } from "./AboutLand";

const AboutApartment = ({ goToStep, formData, setFormData }) => {
  const residentialType = formData?.subPropertyType || "";

  const floorDetails = {
    "Total no.of floor": ["Ground", "1", "2", "3", "4"],
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(aboutApartmentSchema),
    defaultValues: {
      landArea: formData.details?.landArea?.value || "",
      PropertyType: formData.details?.PropertyType || "",
      bhk: formData.details?.bhk || "",
      buildArea: formData.details?.buildArea?.value || "",
      buildAreaUnit: formData.details?.buildAreaUnit?.unit || "Sq.ft",
      Bedroom: formData.details?.Bedroom || "",
      Balcony: formData.details?.Balcony || "",
      Bathroom: formData.details?.Bathroom || "",
      "Plot Floor": formData.details?.["Plot Floor"] || "",
      "Total no.of floor": formData.details?.["Total no.of floor"] || "",
      facing: formData.details?.facing || "",
      parkingCount: {
        covered: formData?.details?.parkingCount?.covered || 0,
        open: formData?.details?.parkingCount?.open || 0,
      },
      furnished: formData.details?.furnished || "",
      roadSize: formData.details?.roadsize?.value || "",
      roadSizeUnit: formData.details?.roadSizeUnit || "",
      waterFacility: formData.details?.waterFacility || [],
      gatedCommunity: formData.details?.gatedCommunity || "",
      playArea: formData.details?.playArea || "",
      drainageSystem: formData.details?.drainageSystem || "",
      approval: formData.details?.approval || "",
      projectStatus: formData.details?.projectStatus || "",
      floorTypes: formData.details?.floorTypes || [],
      optionalAmenities: formData.details?.optionalAmenities || {},
    },
  });

  const {
    setPropertyType,
    Room,
    SetRoom,
    setSelectedBhk,
    furnished,
    setFurnished,
    setRoadSizeUnit,
    SetFloortype,
  } = useAboutFormState(formData, residentialType);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        apart: {
          ...prev.about?.apart,
          [field]: value,
        },
      },
    }));
  };
  const onSubmit = (data) => {
    console.log("Form Data", data);
    goToStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {residentialType === "Service Apartment" && (
        <FurnishedStatus
          value={furnished}
          setFurnished={setFurnished}
          residentialType={residentialType}
        />
      )}
      <Label className="text-[16px] mt-3 mb-2" htmlFor="type">
        Looking for
      </Label>
      <div className="mb-2 flex items-center gap-3 cursor-pointer">
        <ControlledField
          name="PropertyType"
          control={control}
          rules={{ required: "Property type is required" }}
          Component={RadioButton}
          options={PropertyType}
          labelClass="w-fit h-fit py-2"
          onChange={(val, fieldOnChange) => {
            fieldOnChange(val);
            setPropertyType(val);
            updateField("PropertyType", val);
          }}
        />
      </div>
      {/* bhk */}
      <Label className="text-[16px] mt-4" htmlFor="bhk">
        BHK
      </Label>
      <ControlledField
        name="bhk"
        control={control}
        rules={{ required: "BHK selection is required" }}
        Component={RadioButton}
        options={bhk}
        allowAddMore
        addPlaceholder="BHK"
        containerClass="flex flex-col"
        labelClass="w-fit h-fit py-2"
        wrapperClass="mt-3"
        onChange={(val, fieldOnChange) => {
          fieldOnChange(val);
          setSelectedBhk(val);
          updateField("bhk", val);
        }}
      />

      {/* land area */}
      <LabelField
        htmlFor="landArea"
        children="Land Area"
        labelClass="mb-2 mt-4"
      />
      <div className="relative mt-2">
        <Controller
          name="landArea"
          control={control}
          defaultValue={formData.details?.landArea?.value || ""}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Enter your land area"
              type="text"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(value);
                updateField("landArea", { value });
              }}
            />
          )}
        />

        <div className="absolute top-0 right-0 pr-3">
          <Controller
            name="landAreaUnit"
            control={control}
            defaultValue={formData.details?.landAreaUnit?.unit || "Sq.ft"}
            render={({ field }) => (
              <SelectField
                {...field}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  updateField("landAreaUnit", { unit: val });
                }}
                options={selectUnits}
                placeholder="sq.ft"
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
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

      {/* buildup area */}
      <LabelField
        htmlfor="buildupArea"
        children="BuildUp Area"
        labelClass="mb-2 mt-4"
      />
      <div className="relative">
        <Controller
          name="buildArea"
          control={control}
          defaultValue={formData.details?.buildArea?.value || ""}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Enter your build up area details"
              type="text"
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(val);
                updateField("buildArea", { value: val });
              }}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
            />
          )}
        />

        <div className="absolute top-0 right-0 pr-3">
          <Controller
            name="buildAreaUnit"
            control={control}
            defaultValue={formData.details?.buildAreaUnit?.unit || "Sq.ft"}
            render={({ field }) => (
              <SelectField
                {...field}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  updateField("buildAreaUnit", { unit: val });
                }}
                options={selectUnits}
                placeholder="sq.ft"
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between ">
        {errors?.landArea && (
          <span className="text-red-500 text-sm ml-3 mt-1">
            {errors?.buildArea?.message}
          </span>
        )}

        {errors?.buildAreaUnit && (
          <span className="text-red-500 text-sm mr-2 mt-1">
            {errors?.buildAreaUnit?.message}
          </span>
        )}
      </div>
      {/* rooms */}
      <div className="space-y-6 mt-4">
        {Object.entries(RoomDetails).map(([key, options]) => (
          <div key={key} className="my-4">
            <Label className="text-[16px] mt-2 inline-block" htmlFor={key}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </Label>

            <ControlledField
              name={key}
              control={control}
              rules={{ required: `${key} selection is required` }}
              Component={RadioButton}
              options={options}
              allowAddMore
              labelClass="inline-block py-1 px-3 text-[14px] bg-white rounded-full peer-checked:bg-[#FFD300] peer-checked:text-black transition-colors duration-200"
              value={String(control._formValues?.[key] ?? "")}
              onChange={(val, fieldOnChange) => {
                fieldOnChange(val);
                updateField(key, val);
              }}
            />
          </div>
        ))}
      </div>

      {/* 4. Total no.of floor */}
      <Label className="text-[16px] mt-6 inline-block" htmlFor="totalFloors">
        Total no. of floors
      </Label>

      <ControlledField
        name="totalFloors"
        control={control}
        rules={{ required: "Total no. of floors is required" }}
        Component={RadioButton}
        options={floorDetails["Total no.of floor"]}
        labelClass="inline-block py-1 px-3 text-[14px] bg-white rounded-full peer-checked:bg-[#FFD300] peer-checked:text-black transition-colors duration-200"
        allowAddMore={true}
        onChange={(val, fieldOnChange) => {
          fieldOnChange(val);
          updateField("totalFloors", val);
        }}
      />

      {/* directions */}
      <LabelField htmlfor="facing" children="Facing" labelClass="mt-6" />
      <Controller
        name="facing"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RadioButton
              name={field.name}
              options={FacingDirection}
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                updateField("facing", val);
              }}
            />
            {fieldState.error && (
              <p className="text-red-500">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
      {/*parkings and floors  */}
      <Label className="text-[16px] mt-6">Parking</Label>
      {parkingTypes.map(({ label, key }) => (
        <Controller
          key={key}
          name={`parkingCount.${key}`} // Nested object in RHF
          control={control}
          rules={{ required: `${label} is required` }}
          render={({ field }) => (
            <ParkingCounter
              label={label}
              value={field.value || 0}
              onChange={field.onChange}
            />
          )}
        />
      ))}

      {/* furniture status */}
      {residentialType !== "Service Apartment" && (
        <FurnishedStatus
          value={formData?.details?.furnished}
          setFurnished={(val) => {
            setFurnished(val);
            updateField("furnished", val);
          }}
          residentialType={residentialType}
        />
      )}
      {/* road size */}
      <LabelField htmlFor="roadsize" labelClass="mt-6" optional>
        Road Size
      </LabelField>
      <div className="relative">
        <InputField
          id="roadsize"
          name="roadSize"
          type="text"
          placeholder="Enter your Property road size"
          value={formData.about.apart?.roadsize?.value || ""}
          onChange={(e) =>
            updateField("roadsize", {
              value: e.target.value.replace(/[^0-9]/g, ""),
            })
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
            value={formData.about.land?.roadsizeunit}
            onChange={(val) => {
              setRoadSizeUnit(val);
              updateField("roadsizeunit", val);
            }}
            options={selectUnits}
          />
        </div>
      </div>
      {/* water facility */}
      <Controller
        name="waterFacility"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Water Facility"
            options={WaterFacility}
            selected={field.value || []}
            onChange={(val) => {
              field.onChange(val);
              updateField("waterFacility", val);
            }}
            optional={true}
          />
        )}
      />

      {/* extra details */}
      {amenities.map(({ key, label, options, optional }) => (
        <div key={key} className="mt-3">
          <Label htmlFor={key} className="block text-[16px] mt-6">
            {label}
            {optional && (
              <span className="ml-1 text-sm font-light">(optional)</span>
            )}
          </Label>

          <Controller
            name={`optionalAmenities.${key}`} // nested object in RHF
            control={control}
            render={({ field }) => (
              <RadioButton
                name={key}
                options={options}
                value={field.value || ""} // default empty string
                onChange={field.onChange}
                optional={optional}
                labelClass="w-fit h-fit px-2 mt-3"
              />
            )}
          />
        </div>
      ))}

      {/* Flooring types */}
      <Controller
        name="floorTypes"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Floor Type"
            options={FloorTypes}
            selected={field.value || []}
            onChange={(val) => {
              field.onChange(val);
              updateField("floorTypes", val);
            }}
            optional={true}
            allowAddMore={true}
          />
        )}
      />

      {/* Approval  */}
      <LabelField htmlFor="approval" labelClass="mt-6 mb-3">
        Approval
      </LabelField>
      <Controller
        name="approval"
        control={control}
        render={({ field }) => (
          <RadioButton
            options={ApprovalOptions}
            value={field.value || " "}
            onChange={(val) => {
              field.onChange(val);
              updateField("approval", val);
            }}
            labelClass="w-fit h-fit py-2"
          />
        )}
      />
      <LabelField
        htmlFor="projectStatus"
        children="Project Status"
        labelClass="mt-6"
        optional
      />

      <Controller
        name="projectStatus"
        control={control}
        render={({ field }) => (
          <RadioButton
            name="projectStatus"
            options={ProjectStatusOptions}
            value={field.value || ""}
            onChange={(val) => {
              field.onChange(val);

              updateField("projectStatus", val);
            }}
          />
        )}
      />
      <Button className={`${PostPropertyButton} mt-6`}>Next</Button>
    </form>
  );
};

export default AboutApartment;
