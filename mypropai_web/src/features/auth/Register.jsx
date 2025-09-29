// Imports
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import "../auth/auth.css";
import { userLogin, userRegister } from "../../lib/auth";

// Assets
import banner from "../../assets/auth/images/register-banner.png";
import icon_house from "../../assets/auth/icons/mini_home-icon.svg";
import icon_user from "../../assets/auth/icons/user-icon.svg";
import icon_multiuser from "../../assets/auth/icons/multi-users.svg";
import icon_mail from "../../assets/auth/icons/mail-icon.svg";

// ===================
// Form Validation schema
// ===================
const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  user_type: Yup.string()
    .test(
      "user_type-selected",
      "Please select a valid user type",
      (value) => {
        return (
          value === "Individual User" ||
          ["Agent", "Builder", "Promoter"].includes(value)
        );
      }
    )
    .required("User type is required"),
});

// ===================
// Component
// ===================
function Register() {
  const location = useLocation();
  const phone = location.state?.phone || "";
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: phone,
      password: "Myprop@12345",
      user_type: "Individual User",
    },

    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = { ...values };

        const response = await userRegister(values);

        // After register trigger login
        const email = response.user.email;
        const loginResult = await userLogin(email, "Myprop@12345");

        if (loginResult.user) {
          // Clear old data
          localStorage.removeItem("login_user_data");

          // Set new data
          localStorage.setItem("login_user_data", JSON.stringify(loginResult.user));
        }


        alert("Registration successful!");
        navigate("/");
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
        console.error("Registration error:", error);
      }
      setSubmitting(false);
    },
  });

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#242992] to-[#634A9A] p-4">
        <div className="max-w-[1440px] mx-auto">
          <div className="px-6 ">
            <a href="/">
              <img src="/images/logo.png" alt="Logo" className="h-10" />
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Left Side */}
          <div
            className="w-full md:w-1/2 text-white pt-12 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(172deg, rgba(12, 0, 68, 0.7), rgba(78, 63, 151, 0.31)), url(${banner})`,
            }}
          >
            <div className="px-6 ">
              <h1 className="text-[#FFD300] text-3xl md:text-[39px] font-extrabold mb-6">
                My Prop AI{" "}
                <span className="text-white text-2xl md:text-[32px] font-bold mb-6">
                  offer you
                </span>
              </h1>

              <ListItem icon={icon_house} text="Post your property for" highlight="Free." />
              <ListItem icon={icon_house} text="Thousands of" highlight="New Listing daily." />
              <ListItem icon={icon_house} text="Get accessed by more than" highlight="1 lakhs buyers." />
              <ListItem icon={icon_house} text="Get daily update of" highlight="Our property." />
              <ListItem icon={icon_house} text="Get latest trends and" highlight="Market price." />
              <ListItem icon={icon_house} text="Get Upcoming" highlight="Developing area status." />

              <h3 className="text-[#FFD300] text-2xl md:text-[32px] font-extrabold mt-6">
                Buy your Dream Property
              </h3>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 flex justify-center px-6 md:px-0">
            <div className="bg-[#ECEAFF] rounded-[16px] p-6 md:p-8 w-full max-w-[400px] my-10 md:my-[68px]">
              <h2 className="text-[#36334D] text-xl md:text-2xl font-semibold">Welcome to MyPropAI...</h2>
              <p className=" text-gray-400 mb-4">Your journey to selling or renting starts here !</p>

              <form onSubmit={formik.handleSubmit}>
                {/* First + Last name */}
                <div className="flex gap-3">
                  <InputField
                    label="First Name"
                    placeholder="Enter First Name"
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.first_name && formik.errors.first_name ? formik.errors.first_name : null}
                  />
                  <InputField
                    label="Last Name"
                    placeholder="Enter Last Name"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.last_name && formik.errors.last_name ? formik.errors.last_name : null}
                  />
                </div>

                {/* Email */}
                <InputField
                  label="Email"
                  placeholder="Enter your Mail ID"
                  icon={icon_mail}
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                />

                {/* User type toggle */}
                <div className="flex gap-3 my-3">
                  {/* Individual User */}
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-full flex cursor-pointer ${formik.values.user_type === "Individual User" ? "bg-[#FFD300]" : "bg-white"
                      }`}
                    onClick={() => formik.setFieldValue("user_type", "Individual User")}
                  >
                    <img src={icon_user} alt="icon" className="w-4 h-4 mt-[4px]" />
                    Individual User
                  </button>

                  {/* Business User */}
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-full flex cursor-pointer ${formik.values.user_type.startsWith("Business") ||
                      ["Agent", "Builder", "Promoter"].includes(formik.values.user_type)
                      ? "bg-[#FFD300]"
                      : "bg-white"
                      }`}
                    onClick={() => {
                      // Set placeholder for Business User
                      if (!["Agent", "Builder", "Promoter"].includes(formik.values.user_type)) {
                        formik.setFieldValue("user_type", "Business"); // placeholder
                      }
                    }}
                  >
                    <img src={icon_multiuser} alt="icon" className="w-4 h-4 mt-[4px]" />
                    Business User
                  </button>
                </div>

                {/* Business type dropdown */}
                {formik.values.user_type.startsWith("Business") || ["Agent", "Builder", "Promoter"].includes(formik.values.user_type) ? (
                  <select
                    name="user_type"
                    value={["Agent", "Builder", "Promoter"].includes(formik.values.user_type) ? formik.values.user_type : ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 bg-white rounded-[8px] mt-2"
                  >
                    <option value="">Select type of Business</option>
                    <option value="Agent">Agent</option>
                    <option value="Builder">Builder</option>
                    <option value="Promoter">Promoter</option>
                  </select>
                ) : null}

                {formik.touched.user_type && formik.errors.user_type && (
                  <p className="text-red-500 text-sm">{formik.errors.user_type}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#FFD300] text-[#36334D] font-semibold rounded-full py-2 mt-4 cursor-pointer"
                  disabled={formik.isSubmitting}
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ===================
// InputField Component
// ===================
function InputField({
  label,
  placeholder,
  icon,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="text-[#36334D] text-base font-medium leading-normal">
        {label}
      </label>
      <div
        className={`flex items-center h-10 px-1 gap-2 rounded-[8px] mt-2 ${error
          ? "border border-red-500 bg-[#FEE2E2]"
          : "bg-[#F8F8F8]"
          }`}
      >
        {icon && <img src={icon} alt="icon" className="w-4 h-4" />}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          className="bg-transparent border-none outline-none w-full pl-2 text-sm md:text-base"
        />
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

// ===================
// ListItem Component
// ===================
function ListItem({ icon, text, highlight }) {
  return (
    <p className="flex gap-2 text-base md:text-lg font-medium mb-4 md:mb-5 items-center">
      {icon && <img src={icon} alt="icon" className="w-4 h-4 md:w-5 md:h-5" />}
      <span>
        {text} <b>{highlight}</b>
      </span>
    </p>
  );
}

export default Register;
