import { React } from "react";
import { useForm } from "react-hook-form";
import {
  InputField,
  SelectField,
  RadioButton,
  LabelField,
  Checkbox,
  ControlledField,
} from "../../FormFields/FormElements";
import {
  selectUnits,
  ApprovalOptions,
  PropertyType,
  useAboutFormState,
  FloorTypes,
  ProjectStatusOptions,
  FacingDirection,
} from "../../FormFields/FormConfig";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PostPropertyButton } from "../FormSteps/BasicDetails";
import { aboutHouseSchema } from "../../Validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";
import { Form } from "react-router-dom";

export default function AboutHouse({ goToStep, formData, setFormData }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(aboutHouseSchema),
    defaultValues: {
      landArea: formData?.about?.House?.landArea?.value || "",
      landAreaUnit: formData?.about?.House?.landAreaUnit?.unit || "Sq.ft",
      buildArea: formData?.about?.House?.buildArea?.value || "",
      buildAreaUnit: formData?.about?.House?.buildAreaUnit?.unit || "Sq.ft",
      PropertyType: formData?.about?.House?.PropertyType || "",
      facing: formData?.about?.House?.facing || "",
      projectStatus: formData?.about?.House?.projectStatus || "",
      totalFloors: formData?.about?.House?.totalFloors || "",
      approval: formData?.about?.House?.approval || "",
    },
  });
  const PropertyType = ["New Property", "Resale Property"];

  const RoomDetails = {
    "Plot Floor": ["Ground", "1", "2", "3", "4"],
    "Total no.of floor": ["Ground", "1", "2", "3", "4"],
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        House: {
          ...prev.about?.House,
          [field]: value,
        },
      },
    }));
  };
  const onSubmit = () => {
    // console.log("form submit Data:", data);
    goToStep(3);
  };

  const {
    setPropertyType,
    Room,
    SetRoom,
    setApproval,
    projectStatus,
    setProjectStatus,
    floorTypes,
    SetFloortype,
  } = useAboutFormState(formData);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <>
        <Label className="text-[16px] mb-2" htmlFor="type">
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
        {errors?.PropertyType && (
          <span className="text-red-500 text-sm ml-3 mt-1">
            {errors?.PropertyType?.message}
          </span>
        )}

        {/* 2. Land Area */}
        <LabelField
          htmlFor="landArea"
          children="Land Area"
          labelClass="mb-2 mt-4"
        />
        <div className="relative">
          <Controller
            name="landArea"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                value={formData.about?.House?.landArea?.value || ""}
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
            <SelectField
              value={formData.about?.House?.landAreaUnit?.unit || "Sq.ft"}
              onChange={(val) => updateField("landAreaUnit", { unit: val })}
              options={selectUnits}
              placeholder="sq.ft"
            />
          </div>
        </div>
        <div className="flex flex-row justify-between ">
          {errors?.landArea && (
            <span className="text-red-500 text-sm ml-3 mt-1">
              {errors?.landArea?.message}
            </span>
          )}

          {errors?.landAreaUnit && (
            <span className="text-red-500 text-sm mr-2 mt-1">
              {errors.landAreaUnit.message}
            </span>
          )}
        </div>
        {/* 3. BuildUp Area */}
        <LabelField
          htmlfor="buildupArea"
          children="BuildUp Area"
          labelClass="mb-2 mt-4"
        />
        <div className="relative">
          <Controller
            name="buildArea"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                value={formData.about?.House?.buildArea?.value || ""}
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
              name="landAreaUnit"
              control={control}
              defaultValue={formData.about?.House?.landAreaUnit?.unit || "Sq.ft"}
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
        <div className="flex flex-row justify-between ">
          {errors?.buildArea && (
            <span className="text-red-500 text-sm ml-3 mt-1">
              {errors.buildArea.message}
            </span>
          )}

          {errors?.buildAreaUnit && (
            <span className="text-red-500 text-sm mr-2 mt-1">
              {errors.buildAreaUnit.message}
            </span>
          )}
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
          options={RoomDetails["Total no.of floor"]}
          labelClass="inline-block py-1 px-3 text-[14px] bg-white rounded-full peer-checked:bg-[#FFD300] peer-checked:text-black transition-colors duration-200"
          allowAddMore={true}
          onChange={(val, fieldOnChange) => {
            fieldOnChange(val);
            updateField("totalFloors", val);
          }}
        />

        {/* 5. Facing */}
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

        {/* 6. Floor Type */}
        <Checkbox
          label="Floor Type"
          name="floorTypes"
          options={FloorTypes}
          selected={
            floorTypes?.length
              ? floorTypes
              : formData?.about?.House?.floorTypes || []
          }
          onChange={(val) => {
            SetFloortype(val);
            updateField("floorTypes", val);
          }}
          optional="true"
          allowAddMore={true}
        />

        {/* 7. Approval */}
        <LabelField htmlFor="approval" labelClass="mt-6 mb-3">
          Approval
        </LabelField>
        <ControlledField
          name="approval"
          control={control}
          Component={RadioButton}
          options={ApprovalOptions}
          labelClass="w-fit h-fit py-2"
          onChange={(val, fieldOnChange) => {
            fieldOnChange(val);
            setApproval(val);
            updateField("approval", val);
          }}
        />
        {errors?.approval && (
          <p className="text-red-500 text-sm">{errors.approval?.message}</p>
        )}

        {/* 8. Project Status */}
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
              value={field.value || projectStatus}
              onChange={(val) => {
                field.onChange(val);
                setProjectStatus(val);
                updateField("projectStatus", val);
              }}
            />
          )}
        />
        <Button className={PostPropertyButton}>Next</Button>
      </>
    </form>
  );
}
