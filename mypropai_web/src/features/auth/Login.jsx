// Imports
import { React, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { checkUserIsthere, userLogin } from "../../lib/auth";

// Assets
import banner from "../../assets/auth/images/login-banner.png";
import icon_google from "../../assets/auth/icons/google-icon.svg";
import icon_house from "../../assets/auth/icons/mini_home-icon.svg";
import icon_phone from "../../assets/auth/icons/phone-icon.svg";

// Phone Validation Schema
const validationSchema = Yup.object({
    phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
        .required("Phone number is required"),
    agree: Yup.boolean().oneOf([true], "You must agree before continuing"),
});

// Login Component
function Login() {

    const navigate = useNavigate();
    const [step, setStep] = useState("mobile");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState(null);

    // ---------- Step 1: Mobile Number Form ----------
    const formik = useFormik({
        initialValues: { phone: "", agree: false },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const phone = values.phone;
                const otpCode = Math.floor(1000 + Math.random() * 9000);
                setGeneratedOtp(otpCode);
                console.log("Generated OTP:", otpCode);
                setPhoneNumber(phone);
                setStep("otp");
            } catch (error) {
                alert(
                    error.response?.data?.message ||
                    "Failed to verify phone number. Please try again."
                );
                console.error("OTP Request error:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    // ---------- Step 2: OTP Form ----------
    const otpFormik = useFormik({
        initialValues: { otp: "" },
        validationSchema: Yup.object({
            otp: Yup.string()
                .length(4, "OTP must be 4 digits")
                .required("OTP is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (parseInt(values.otp) !== generatedOtp) {
                    alert("Invalid OTP");
                    setSubmitting(false);
                    return;
                }
                // check already user is there or not 
                const response = await checkUserIsthere(phoneNumber);
                if (response.availability) {
                    const loginResult = await userLogin(response.email);
                    if (loginResult.user) {
                        // Clear old data
                        localStorage.removeItem("login_user_data");

                        // Set new data
                        localStorage.setItem("login_user_data", JSON.stringify(loginResult.user));
                    }

                    alert("Login success");
                    navigate("/");
                } else {
                    navigate("/register", { state: { phone: phoneNumber } });
                }
            } catch (error) {
                alert("OTP verification failed");
                console.error("OTP verify error:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            {/* ---------- Header ---------- */}
            <div className="bg-gradient-to-r from-[#242992] to-[#634A9A] p-4">
                <div className="max-w-[1440px] mx-auto">
                    <div className="px-6 ">
                        <a href="/">
                            <img src="/images/logo.png" alt="Logo" className="h-10" />
                        </a>
                    </div>
                </div>
            </div>

            {/* ---------- Main Layout ---------- */}
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row min-h-screen">
                    {/* Left Section */}
                    <div
                        className="w-full md:w-1/2 text-white pt-12 bg-cover bg-center"
                        style={{
                            backgroundImage: `linear-gradient(172deg, rgba(12,0,68,0.7), rgba(78,63,151,0.31)), url(${banner})`,
                        }}
                    >
                        <div className="px-6 ">
                            <h1 className="text-white text-2xl md:text-[32px] font-bold mb-6">
                                My Prop AI <span className="text-[#FFD300]">offer you</span>
                            </h1>
                            <ListItem icon={icon_house} text="Post your property for" highlight="Free." />
                            <ListItem icon={icon_house} text="Thousands of" highlight="New Listing daily." />
                            <ListItem icon={icon_house} text="Get accessed by more" highlight="1 lakhs buyers." />
                            <ListItem icon={icon_house} text="Get daily update of" highlight="Our property." />
                            <ListItem icon={icon_house} text="Get latest trends and" highlight="Market price." />
                            <ListItem icon={icon_house} text="Get Upcoming" highlight="Developing area status." />

                            <h2 className="text-[#FFD300] text-lg font-bold mt-10">
                                Buy your Dream Property
                            </h2>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/2 flex justify-center px-6 md:px-0">
                        <div className="bg-[#ECEAFF] rounded-[16px] p-6 md:p-8 w-full max-w-[400px] my-10 md:my-[68px]">

                            {/* ---------- Step 1: Mobile ---------- */}
                            {step === "mobile" && (
                                <>
                                    <h2 className="text-[#36334D] text-xl md:text-2xl font-semibold mb-6">
                                        Sign In / Sign Up
                                    </h2>

                                    <form onSubmit={formik.handleSubmit}>
                                        <InputField
                                            label="Phone Number"
                                            placeholder="Enter your phone number"
                                            icon={icon_phone}
                                            type="text"
                                            name="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.phone && formik.errors.phone}
                                            autoComplete="off"
                                            maxLength="10"
                                        />

                                        <p className="text-[#36334D] text-[13px] mb-4">
                                            OTP will be sent to this Number
                                        </p>

                                        {/* Terms */}
                                        <div className="text-xs text-[#555] mb-4 mt-4 flex items-start gap-2">
                                            <input
                                                type="checkbox"
                                                name="agree"
                                                checked={formik.values.agree}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="accent-[#FFD300] custom-checkbox"
                                            />
                                            <span>
                                                By signing up, I agree to My Prop AI{" "}
                                                <a href="/privacy" className="text-[#36334D] underline">
                                                    Privacy policy
                                                </a>{" "}
                                                and{" "}
                                                <a href="/terms" className="text-[#36334D] underline">
                                                    Terms & Conditions
                                                </a>
                                            </span>
                                        </div>

                                        {formik.touched.agree && formik.errors.agree && (
                                            <div className="text-red-600 text-sm mb-2">
                                                {formik.errors.agree}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={formik.isSubmitting || !formik.values.agree}
                                            className={`w-full bg-[#FFD300] text-[#36334D] font-semibold rounded-full py-2 
                        ${formik.isSubmitting || !formik.values.agree
                                                    ? "cursor-not-allowed opacity-60"
                                                    : "cursor-pointer"
                                                }`}
                                        >
                                            Continue
                                        </button>
                                    </form>

                                    {/* Divider & Google */}
                                    <div className="text-center text-sm text-gray-500 mt-4 mb-2">
                                        ——— Or ———
                                    </div>
                                    <button className="w-full text-[#36334D] font-semibold rounded-full py-2 mt-4 flex items-center justify-center gap-2">
                                        <img src={icon_google} alt="Google" className="w-4 h-4" />
                                        Continue with Google
                                    </button>
                                </>
                            )}

                            {/* ---------- Step 2: OTP ---------- */}
                            {step === "otp" && (
                                <>
                                    <h2 className="text-[#36334D] text-xl md:text-2xl font-semibold mb-6">
                                        Enter otp
                                    </h2>
                                    <div className="text-sm mb-6 text-gray-600">
                                        <p>We have sent an OTP to your mobile number</p>
                                    </div>

                                    <form onSubmit={otpFormik.handleSubmit} className="space-y-6">
                                        <p className="text-center text-gray-600">
                                            OTP sent to <span className="font-semibold">{phoneNumber}</span>{" "}
                                            <button
                                                type="button"
                                                onClick={() => setStep("mobile")}
                                                className="text-blue-600 underline ml-2"
                                            >
                                                Edit
                                            </button>
                                        </p>

                                        {/* OTP Inputs */}
                                        <div className="flex justify-center gap-3 sm:gap-4">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength="1"
                                                    autoComplete="off"
                                                    value={otpFormik.values.otp[index] || ""}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/[^0-9]/g, "");
                                                        let newOtp = otpFormik.values.otp.split("");
                                                        newOtp[index] = val;
                                                        otpFormik.setFieldValue("otp", newOtp.join(""));

                                                        if (val && index < 3) {
                                                            document.getElementById(`otp-${index + 1}`).focus();
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Backspace" &&
                                                            !otpFormik.values.otp[index] &&
                                                            index > 0
                                                        ) {
                                                            document.getElementById(`otp-${index - 1}`).focus();
                                                        }
                                                    }}
                                                    className="w-9 h-12 text-center bg-[#FFFFFF] text-xl rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            ))}
                                        </div>

                                        {otpFormik.touched.otp && otpFormik.errors.otp && (
                                            <div className="text-red-500 text-sm text-center">
                                                {otpFormik.errors.otp}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={otpFormik.isSubmitting}
                                            className="w-full bg-[#FFD300] text-[#36334D] font-semibold rounded-full py-2 cursor-pointer"
                                        >
                                            {otpFormik.isSubmitting ? "Verifying..." : "Continue"}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ===================
// Reusable Components
// ===================
function InputField({
    label,
    placeholder,
    icon,
    type = "tel",
    name,
    value,
    onChange,
    onBlur,
    error,
    autoComplete,
    maxLength,
}) {
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        setTouched(true);
        onChange && onChange(e);
    };

    return (
        <div className="mb-1">
            <label
                htmlFor={name}
                className="text-[#36334D] text-base font-medium leading-normal"
            >
                {label}
            </label>

            <div
                className={`flex items-center h-10 px-3 gap-2 rounded-[8px] mt-2 
          ${error
                        ? "border border-red-500 bg-[#FEE2E2]"
                        : touched
                            ? "border border-[#dddddd] bg-[#F8F8F8]"
                            : "bg-[#F8F8F8]"}
        `}
            >
                <img src={icon} alt="icon" className="w-4 h-4 md:w-5 md:h-5" />
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    className="bg-transparent border-none outline-none w-full text-sm md:text-base"
                />
            </div>

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
}

function ListItem({ icon, text, highlight }) {
    return (
        <p className="flex gap-2 text-base md:text-lg font-medium mb-5 items-center">
            <img src={icon} alt="icon" className="w-4 h-4 md:w-5 md:h-5" />
            <span>
                {text} <b>{highlight}</b>
            </span>
        </p>
    );
}

export default Login;
