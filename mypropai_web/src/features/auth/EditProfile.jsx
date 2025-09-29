// Imports
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../lib/api";
import { getUserProfile, UpdateUserProfile } from "../../lib/auth";
import { getLoginUserData } from "../../utils/helpers";

// Assets
import banner from "../../assets/auth/images/regver-banner.png";
import empty_profile from "../../assets/auth/images/empty_profile.png";
import icon_house from "../../assets/auth/icons/mini_home-icon.svg";
import user_icon from "../../assets/auth/icons/user-icon.svg";
import pencil_icon from "../../assets/auth/icons/pencil-icon.svg";
import icon_mail from "../../assets/auth/icons/mail-icon.svg";

// ===================
// Validation schema
// ===================
const validationSchema = Yup.object({
    first_name: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters"),
    last_name: Yup.string()
        .required("Last name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
});

// ===================
// Component
// ===================
function EditProfile() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [previewPic, setPreviewPic] = useState(null);

    const fileInputRef = useRef(null);

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const userData  = getLoginUserData();
                if (!userData ) {
                    console.error("No user token found");
                    return;
                }

                const updatedData = {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    profile_picture: fileInputRef.current?.files[0] || null,
                };

                await UpdateUserProfile(userData.token, updatedData);
                setEditMode(false);
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }


    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData  = getLoginUserData();

         
                if (!userData) return;
                const profileResponse = await getUserProfile();
                if (profileResponse.success && profileResponse.user) {
                    const user = profileResponse.user;
                    setPhone(user.phone);
                    setProfilePic(user.profile_picture);
                    formik.setValues({
                        first_name: user.first_name || "",
                        last_name: user.last_name || "",
                        email: user.email || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handlePicClick = () => {
        fileInputRef.current.click();
    };

    const handlePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewPic(URL.createObjectURL(file));
        }
    };


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
                        <div className="relative bg-[#ECEAFF] rounded-[16px] p-6 md:p-8 w-full max-w-[400px] my-20 md:my-[68px] text-center">
                            {/* Profile Image */}
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                                <div className="relative w-28 h-28">
                                    <img
                                        src={previewPic ? previewPic : profilePic ? `${BASE_URL}/media/${profilePic}` : empty_profile}
                                        alt="profile"
                                        className="w-28 h-28 rounded-full shadow-md object-cover"
                                    />

                                    {/* Edit button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(true);
                                            handlePicClick();
                                        }}
                                        className="absolute bottom-0 right-0 "
                                    >
                                        <img src={pencil_icon} alt="edit" className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePicChange}
                                    />
                                </div>
                            </div>

                            {/* Name + Phone */}
                            <h3 className="text-[#36334D] text-lg font-semibold mt-16">
                                {formik.values.first_name} {formik.values.last_name}
                            </h3>
                            <p className="text-gray-500 text-sm">{phone}</p>

                            {/* Form Section */}
                            <form
                                onSubmit={formik.handleSubmit}
                                className="mt-6 space-y-4 text-left"
                            >
                                {/* Name Fields */}
                                {!editMode ? (
                                    <InputField
                                        label="Name"
                                        placeholder="Enter your Name"
                                        name="name"
                                        icon={user_icon}
                                        value={`${formik.values.first_name} ${formik.values.last_name}`}
                                        onChange={() => { }}
                                        onBlur={() => { }}
                                        editable
                                        onEditClick={() => setEditMode(true)}
                                    />
                                ) : (
                                    <div className="flex gap-3">
                                        <InputField
                                            label="First Name"
                                            placeholder="Enter First Name"
                                            name="first_name"
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.first_name && formik.errors.first_name
                                                    ? formik.errors.first_name
                                                    : null
                                            }
                                        />
                                        <InputField
                                            label="Last Name"
                                            placeholder="Enter Last Name"
                                            name="last_name"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.last_name && formik.errors.last_name
                                                    ? formik.errors.last_name
                                                    : null
                                            }
                                        />
                                    </div>
                                )}

                                {/* Email Field */}
                                <InputField
                                    label="Email"
                                    placeholder="Enter your Email"
                                    icon={icon_mail}
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.email && formik.errors.email
                                            ? formik.errors.email
                                            : null
                                    }
                                    editable={!editMode}
                                    onEditClick={() => setEditMode(true)}
                                />

                                {/* Save Button */}
                                {editMode && (
                                    <button
                                        type="submit"
                                        className="w-full bg-[#FFD300] text-[#36334D] font-semibold rounded-full py-2 mt-4 cursor-pointer"
                                    >
                                        Save
                                    </button>
                                )}
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
    editable = false,
    onEditClick,
}) {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="text-[#36334D] text-base font-medium leading-normal"
            >
                {label}
            </label>
            <div
                className={`flex items-center justify-between h-10 px-3 gap-2 rounded-[8px] mt-2 ${error ? "border border-red-500 bg-[#FEE2E2]" : "bg-[#F8F8F8]"
                    }`}
            >
                <div className="flex items-center gap-2 w-full">
                    {icon && <img src={icon} alt="icon" className="w-4 h-4" />}
                    <input
                        id={name}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        className="bg-transparent border-none outline-none w-full text-sm md:text-base"
                    />
                </div>
                {editable && (
                    <button
                        type="button"
                        className="flex items-center text-sm text-[#5B4B8A] whitespace-nowrap"
                        onClick={onEditClick}
                    >
                        Edit <img src={pencil_icon} alt="edit" className="ml-1 w-4 h-4 inline-block" />
                    </button>
                )}
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

export default EditProfile;
