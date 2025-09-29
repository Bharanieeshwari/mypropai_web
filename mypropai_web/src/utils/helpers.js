import { loginUserData_email } from "@/lib/auth";
import { useEffect, useRef } from "react";
/* -------------------- PRICE -------------------- */

/**
 * Convert large price numbers into human-readable format
 * 10,00,000 → 10.00 Lakh
 * 1,00,00,000 → 1.00 Cr
 */
export const shrinkedPrice = (price) => {
  if (!price) return "";
  if (price >= 1e7) return `${(price / 1e7).toFixed(2)} Cr`;
  if (price >= 1e5) return `${(price / 1e5).toFixed(2)} Lakh`;
  return price.toLocaleString("en-IN");
};

/**
 * Format currency with Indian locale
 * Example: 250000 → 2,50,000
 */
export const formatCurrency = (value) =>
  value
    ? new Intl.NumberFormat("en-IN", {
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value)
    : "";

/* -------------------- DATE -------------------- */

/**
 * Format date as DD/MM/YYYY
 */
export const postedDate = (dateInput) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  return isNaN(date) ? "-" : date.toLocaleDateString("en-GB");
};

/* -------------------- TEXT -------------------- */

/**
 * Compress long text with "..." if it exceeds maxLength
 */
export const compressedDescription = (text, showMore, maxLength = 800) =>
  !text
    ? null
    : showMore || text.length <= maxLength
    ? text
    : `${text.slice(0, maxLength)}...`;

/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (str = "") =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

/**
 * Mask phone number (hide digits except last 2)
 * Example: 9876543210 → ********10
 */
export const maskPhone = (phone = "") => phone.replace(/\d(?=\d{2})/g, "*");

/**
 * Mask email address
 * Example: testuser@gmail.com → t*****@gmail.com
 */
export const maskEmail = (email = "") => {
  if (!email.includes("@")) return email;
  const [name, domain] = email.split("@");
  return `${name[0]}*****@${domain}`;
};

/* -------------------- CALCULATIONS -------------------- */

/**
 * Calculate missing land dimension if area + one side is known
 * Example: area=1000, length=20 → breadth=50
 */
export const calculateMissingDimension = (area, length, breadth) => {
  const a = parseFloat(area) || 0;
  const l = parseFloat(length) || 0;
  const b = parseFloat(breadth) || 0;

  if (a > 0) {
    if (l > 0 && !b) return (a / l).toFixed(2);
    if (b > 0 && !l) return (a / b).toFixed(2);
  }
  return null;
};

/**
 * Custom React hook: Auto-calculate price per sq ft
 */
export const usePricePerSqFt = (landArea, price, updateFn, setValue) => {
  const lastRef = useRef("");

  useEffect(() => {
    const area = parseFloat(landArea || 0);
    const p = parseFloat(price || 0);
    if (area <= 0 || p <= 0) return;

    const formatted = Math.round(p / area);
    if (lastRef.current !== formatted) {
      lastRef.current = formatted;
      updateFn("area_sq_ft", formatted);
      setValue("area_sq_ft", formatted);
    }
  }, [landArea, price, updateFn, setValue]);
};

/* -------------------- OPTIONS -------------------- */

/**
 * Ensure custom value is included in options (for select fields)
 */
export const getOptionsWithCustomValue = (options = [], value, isEdit) => {
  if (!isEdit || !value) return options;
  const strValue = String(value);
  return options.map(String).includes(strValue)
    ? options
    : [...options, strValue];
};

/* -------------------- AUTH -------------------- */

/**
 * Get logged-in user profile from cookies + API
 */
export const getLoginUserData = () => {
  try {
    const token = localStorage.getItem("user_token");
    const login_user_data = localStorage.getItem("login_user_data");
    const parsedUserData = login_user_data ? JSON.parse(login_user_data) : null;
    const loginUserData = {
      token,
      user: parsedUserData,
    };

    return loginUserData;
  } catch (err) {
    console.error("Error while getting user data from storage:", err);
    return null;
  }
};

// login user check
export const isLoggedIn = () => {
  const login_user_data = JSON.parse(localStorage.getItem("login_user_data"));
  return login_user_data;
};
// validation flowFrom:
export const filterTextOnly = (input) => {
  return input.replace(/[^a-zA-Z\s]/g, "");
};

export const isValidMobile = (input) => {
  return (input
    .replace(/[^0-9]/g, "")
    .slice(0, 10)
    .match(/^[6-9][0-9]{0,9}$/) || [""])[0];
};

// converting pixelto image
export const getCroppedImg = (imageSrc, crop, index = 0) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");

      // Handle % crops
      let cropX = crop.x;
      let cropY = crop.y;
      let cropWidth = crop.width;
      let cropHeight = crop.height;

      if (crop.unit === "%") {
        cropX = (image.naturalWidth * crop.x) / 100;
        cropY = (image.naturalHeight * crop.y) / 100;
        cropWidth = (image.naturalWidth * crop.width) / 100;
        cropHeight = (image.naturalHeight * crop.height) / 100;
      }

      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        // ✅ Index inside filename
        blob.name = `property_cropped_${index}.jpeg`;
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = (err) => reject(err);
  });
};

export const trimmedLocaityNames = (name) => {
  if (!name) return "";
  return name
    .replace(/\b(SO|BO|S\.O)\b/gi, ",")
    .replace(/\s+,/g, "")
    .replace(/,+/g, "")
    .trim();
};
