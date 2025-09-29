import React from "react";
import {
  InputField,
  SelectField,
  RadioButton,
  FurnishedStatus,
  LabelField,
  Checkbox,
  ControlledField,
} from "../../FormFields/FormElements";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { PostPropertyButton } from "../FormSteps/BasicDetails";
import {
  selectUnits,
  ApprovalOptions,
  PropertyType,
  useAboutFormState,
  FloorTypes,
  ProjectStatusOptions,
  FacingDirection,
} from "../../FormFields/FormConfig";
import { aboutIndustrySchema } from "../../Validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller } from "react-hook-form";

const AboutIndustry = ({ goToStep, formData, setFormData }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(aboutIndustrySchema),
    defaultValues: {
      PropertyType: formData.about?.indus?.PropertyType || "",
      landArea: formData.about?.indus?.landArea?.value || "",
      landAreaUnit: formData.about?.landAreaUnit?.unit || "Sq.ft",
      facing: formData.about?.indus?.facing || "",
      approval: formData.about?.indus?.approval || "",
      furnished: formData.about?.indus?.furnished || "",
      floorTypes: formData.about?.indus?.floorTypes || [],
      projectStatus: formData.about?.indus?.projectStatus || "",
    },
  });

  const onSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        ...data,
        propertyType,
        landAreaUnit,
        facing,
        furnished,
        approval,
        projectStatus,
        floorTypes,
      },
    }));
    goToStep(3);
  };
  const {
    setPropertyType,
    Room,
    SetRoom,
    propertyType,
    landAreaUnit,
    furnished,
    facing,
    setFurnished,
    approval,
    setApproval,
    projectStatus,
    setProjectStatus,
    floorTypes,
    SetFloortype,
  } = useAboutFormState(formData);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        indus: {
          ...prev.about?.indus,
          [field]: value,
        },
      },
    }));
  };
  // console.log("Form data", formData);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <SelectField
            value={formData.about?.indus?.landAreaUnit?.unit || "Sq.ft"}
            onChange={(val) => updateField("landAreaUnit", { unit: val })}
            options={selectUnits}
            placeholder="sq.ft"
          />
        </div>
      </div>
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
      {/* Approval  */}
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
        <p className="text-red-500 text-sm">{errors.approval.message}</p>
      )}

      {/* furniture status */}
      <FurnishedStatus
        value={formData?.about?.indus?.furnished}
        setFurnished={(val) => {
          setFurnished(val);
          updateField("furnished", val);
        }}
      />
      {/* Flooring types */}
      <Checkbox
        label="Floor Type"
        name="floorTypes"
        options={FloorTypes}
        selected={
          floorTypes?.length
            ? floorTypes
            : formData?.about?.indus?.floorTypes || []
        }
        onChange={(val) => {
          SetFloortype(val);
          updateField("floorTypes", val);
        }}
        optional="true"
        allowAddMore={true}
      />

      {/* project status */}
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

      <Button type="submit" className={PostPropertyButton}>
        Next
      </Button>
    </form>
  );
};

export default AboutIndustry;
