import { React, useEffect } from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { InputFocus } from "../PostFormLayout/FormSteps/AboutForm";
import { Plus } from "lucide-react";
import { Controller } from "react-hook-form";
import { Check } from "lucide-react";
import { forwardRef } from "react";

export const ControlledField = ({ name, control, rules, ...rest }) => {
  const { Component } = rest;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <Component
            {...field}
            {...rest}
            selected={field.value}
            onChange={(val) => {
              field.onChange(val);
              rest.onChange?.(val);
            }}
          />

          {fieldState.error && (
            <span className="text-red-500 text-sm">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

// InputField.jsx
export const InputField = forwardRef(
  (
    {
      value,
      onChange,
      type = "text",
      placeholder = "",
      inputClass,
      name,
      disabled = "",
      maxLength,
    },
    ref
  ) => {
    return (
      <div className="">
        <Input
          ref={ref}
          id={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`grow py-2 text-base h-10 rounded-sm pl-5 bg-white pr-3 text-gray-900 placeholder:text-[#4B476B] placeholder:ml-3 placeholder:text-[12px] ${InputFocus} ${inputClass}`}
        />
      </div>
    );
  }
);

export const LabelField = ({
  htmlFor,
  children,
  labelClass,
  optional = false,
}) => {
  return (
    <Label
      htmlFor={htmlFor}
      className={`text-[16px] text-[#36334D] ${labelClass}`}
    >
      {children}
      {optional && (
        <span className="ml-0 text-sm font-light text-[#36334D]">
          (optional)
        </span>
      )}
    </Label>
  );
};

export const RadioButton = ({
  name,
  options = [],
  value,
  onChange,
  wrapperClass = "",
  containerClass = "flex flex-col gap-2",
  labelClass = "w-full h-full items-center justify-center flex",
  allowAddMore = false,
  addPlaceholder = "",
}) => {
  const storageKey = `${name}_customOptions`;
  const [customOptions, setCustomOptions] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [editInput, setEditInput] = useState(false);
  const [editedInputValue, setEditedInputValue] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load custom options from sessionStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setCustomOptions(parsed.options || []);
      setShowInput(parsed.showInput ?? false);
      setEditInput(parsed.editInput ?? false);
      setEditedInputValue(parsed.editedInputValue ?? null);
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          options: customOptions,
          showInput,
          editInput,
          editedInputValue,
        })
      );
    }
  }, [
    customOptions,
    showInput,
    editInput,
    editedInputValue,
    loaded,
    storageKey,
  ]);

  // Combine default options with custom ones, normalize to { key, label } as string
  const allOptions = [
    ...options.map((o) => {
      if (typeof o === "string" || typeof o === "number") {
        return { key: String(o), label: String(o) };
      }
      return { key: String(o.key), label: String(o.label) };
    }),
    ...customOptions.map((o) => ({ key: String(o), label: String(o) })),
  ];

  const handleAddAndEdit = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;

    // Validation: at least one letter and one number (customizable)
    const hasLetterAndNumber = /^(?:[0-9]|[1-9][0-9])$/.test(trimmed);

    if (!hasLetterAndNumber) {
      setError("Value must contain at least one number");
      return;
    }

    if (editedInputValue !== null) {
      const updated = [...customOptions];
      updated[editedInputValue] = trimmed;
      setCustomOptions(updated);
      setEditedInputValue(null);
    } else {
      setCustomOptions((prev) => [...prev, trimmed]);
      onChange(trimmed);
    }

    setNewValue("");
    setShowInput(false);
    setEditInput(true);
    setError("");
  };

  const handleEdit = () => {
    const lastIndex = customOptions.length - 1;
    if (lastIndex >= 0) {
      setNewValue(customOptions[lastIndex]);
      setEditedInputValue(lastIndex);
      setShowInput(true);
    }
  };

  return (
    <div className={`${containerClass}`}>
      <div className="flex flex-wrap">
        {allOptions.map(({ key, label }, index) => {
          const id = `${name}-${index}`;
          return (
            <div key={id} className={`p-1 pl-0 pr-2 mt-1 ${wrapperClass}`}>
              <input
                type="radio"
                id={id}
                name={name}
                value={key}
                checked={String(value) === String(key)}
                onChange={() => onChange(key)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={`p-1 mt-1 mr-2 px-3 rounded-full text-[#36334D] bg-white text-sm peer-checked:bg-[#FFE66C] cursor-pointer transition ${labelClass}`}
              >
                {label}
              </label>
            </div>
          );
        })}

        {allowAddMore && (
          <div className="flex items-center gap-2 mt-1">
            {showInput ? (
              <>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                    setNewValue(value);
                  }}
                  placeholder={addPlaceholder}
                  className="rounded-full px-3 w-14 mb-2 py-1 mt-2 ml-1 text-sm border bg-white focus:outline-0 border-gray-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAndEdit();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddAndEdit}
                  className="text-xs text-[#36334d] bg-[#FFD300] cursor-grabbing mb-2 px-3 py-1.5 mt-2 rounded-full"
                >
                  {editedInputValue !== null ? "Update" : "Add"}
                </button>
              </>
            ) : editInput ? (
              <button
                type="button"
                onClick={handleEdit}
                className="text-sm mb-1 cursor-pointer mt-3 ml-2 text-blue-600 underline"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowInput(true)}
                className="text-sm mb-1 cursor-pointer mt-3 ml-2 text-green-600 underline"
              >
                Add More
              </button>
            )}
          </div>
        )}
      </div>

      {error && <span className="text-sm text-red-800">{error}</span>}
    </div>
  );
};

export const SelectField = ({
  value = { value },
  onChange,
  options = [],
  placeholder,
  selectClass,
}) => {
  return (
    <div className={`ml-2 ${selectClass}`}>
      <Select value={value} className="p-0 m-0" onValueChange={onChange}>
        <SelectTrigger
          className={`border-0 p-0 m-0 rounded-full  cursor-pointer ${InputFocus}`}
        >
          <SelectValue placeholder={placeholder} className="p-0 m-0" />
        </SelectTrigger>
        <SelectContent className="bg-white p-0 border-0">
          {options.map((option) => (
            <SelectItem
              key={option.key}
              value={option.key}
              className="cursor-pointer hover:bg-grey-400 hover:text-purple-700 focus:bg-gray-100 focus:text-purple-900 rounded-md transition"
            >
              {option.label} {/* display label */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const Checkbox = ({
  label = "",
  options = [],
  selected = [],
  onChange = () => { },
  name = "",
  optional = false,
  allowAddMore = false,
  addPlaceholder = "",
}) => {
  const storageKey = `${name}_customOptions`;

  const [customOptions, setCustomOptions] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setCustomOptions(parsed.options || []);
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (loaded) {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ options: customOptions })
      );
    }
  }, [customOptions, loaded, storageKey]);

  const allOptions = [...options, ...customOptions];

  const handleCheckboxChange = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(updated);
  };

  const handleAddOrEdit = () => {
    const trimmed = newValue.trim();
    const errMessage = document.getElementById("errorDiv");

    if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
      errMessage.innerText = "Only letters are allowed";
      return;
    }
    const allExisting = [...options, ...customOptions].map((opt) =>
      opt.toLowerCase()
    );
    if (allExisting.includes(trimmed.toLowerCase())) {
      errMessage.innerText = "This option already exists";
      return;
    }
    errMessage.innerText = "";
    if (editIndex !== null) {
      const updatedOptions = [...customOptions];
      updatedOptions[editIndex] = trimmed;
      setCustomOptions(updatedOptions);
      if (selected.includes(customOptions[editIndex])) {
        onChange(
          selected.map((val) =>
            val === customOptions[editIndex] ? trimmed : val
          )
        );
      }

      setEditIndex(null);
    } else {
      setCustomOptions([...customOptions, trimmed]);
      onChange([...selected, trimmed]); // auto-select new option
    }

    setNewValue("");
    setShowInput(false);
  };

  // const handleEditClick = (index) => {
  //   setNewValue(customOptions[index]);
  //   setEditIndex(index);
  //   setShowInput(true);
  // };

  // const handleDeleteClick = (index) => {
  //   const removed = customOptions[index];
  //   setCustomOptions(customOptions.filter((_, i) => i !== index));
  //   onChange(selected.filter((val) => val !== removed)); // remove from selected if needed
  // };

  return (
    <div className="my-3">
      {label && (
        <Label htmlFor={name} className="text-[16px] text-[#36334D] mt-6">
          {label}
          {optional && (
            <span className="text-sm font-light ml-1 text-[#36334D]">
              (optional)
            </span>
          )}
        </Label>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {allOptions.map((value, index) => {
          const isCustom = index >= options.length;
          return (
            <div key={index} className="flex items-center gap-1">
              <label className="cursor-pointer flex items-center">
                <input
                  type="checkbox"
                  name={name}
                  value={value}
                  className="peer hidden"
                  checked={selected.includes(value)}
                  onChange={() => handleCheckboxChange(value)}
                />
                <span className="py-1 px-3 bg-white rounded-full  text-sm text-[#36334D] peer-checked:bg-[#FFE66C] peer-checked:text-black transition-colors duration-200 flex items-center">
                  {selected.includes(value) ? (
                    <Check className="w-3 h-3 inline mr-1" />
                  ) : (
                    <Plus className="w-3 h-3 inline mr-1" />
                  )}
                  {value}
                </span>
              </label>
              {isCustom && (
                <div className="flex gap-1">
                  {/* <button
                    type="button"
                    onClick={() => handleEditClick(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button> */}
                  {/* <button
                    type="button"
                    onClick={() => handleDeleteClick(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button> */}
                </div>
              )}
            </div>
          );
        })}

        {allowAddMore && (
          <div className="flex items-center gap-2 mt-2">
            {showInput ? (
              <>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-z]/g, "");
                    setNewValue(value);
                  }}
                  placeholder={addPlaceholder}
                  className={`rounded-full px-3 py-1 w-20 text-sm border bg-white border-gray-300 ${InputFocus}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOrEdit();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddOrEdit}
                  className="text-xs bg-[#FFD300] cursor-pointer px-2 py-1 rounded-full"
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowInput(true)}
                className="text-sm text-green-600 underline"
              >
                Add More
              </button>
            )}
          </div>
        )}
      </div>
      <div id="errorDiv" className="text-sm text-red-500 mt-2"></div>
    </div>
  );
};
export const FurnishedStatus = ({ value, setFurnished, residentialType }) => {
  const Status = residentialType === "Service Apartment";
  const Furnished =
    residentialType === "Service Apartment"
      ? ["Fully-Furnished"]
      : ["Fully-Furnished", "Unfurnished", "Semi-furnished"];
  return (
    <div className="mt-4">
      <Label htmlFor="furnishedstatus" className="mt-6 text-[16px]">
        Furnished status
        {Status ? (
          <span className="text-sm font-light">
            (serviced apartment is fully furnished)*
          </span>
        ) : (
          <span className="text-sm font-light">(optional)</span>
        )}
      </Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {Furnished.map((type, index) => (
          <label key={index} className="cursor-pointer mt-2">
            <input
              type="radio"
              name="furnishedstatus"
              value={type}
              className="peer hidden"
              checked={value === type}
              onChange={() => setFurnished(type)}
            />
            <span className="inline-block p-1 px-4 text-[14px] bg-white text-[#36334D] rounded-full peer-checked:bg-[#FFE66C] peer-checked:text-black transition-colors duration-200">
              {type}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
export const ParkingCounter = ({ label, value = 0, onChange }) => {
  const increase = () => onChange(value + 1);
  const decrease = () => onChange(Math.max(0, value - 1));

  return (
    <div className="mb-4 flex justify-between mr-10">
      <Label className="text-[16px] mt-4">{label}</Label>
      <div className="flex items-center gap-3 mt-4">
        <div
          className="w-6 h-6 bg-[#FFE66C] px-2 rounded-full flex justify-center items-center cursor-pointer"
          onClick={decrease}
        >
          -
        </div>
        <div className="text-[16px] min-w-[50px] text-center">{value}</div>
        <div
          className="w-6 h-6 bg-[#FFE66C] px-2 rounded-full flex justify-center items-center cursor-pointer"
          onClick={increase}
        >
          +
        </div>
      </div>
    </div>
  );
};
