// -------------------- Imports --------------------
import api from "./api";
import { setUserToken, clearUserToken } from "./api";
export const password = import.meta.env.VITE_USER_PASSWORD;

// -------------------- Helpers --------------------
export const loginUserData_email = () => {
  const data = localStorage.getItem("login_user_data");
  return data ? JSON.parse(data).email : null;
};

// -------------------- Auth APIs --------------------

// Check if a user exists
export const checkUserIsthere = async (mobileNumber) => {
  const res = await api.get(`/api/auth/check-mobile/${mobileNumber}`);
  return res.data;
};

// User login
export const userLogin = async (email) => {
  clearUserToken();
  const res = await api.post("/api/auth/login", { email, password});
  if (res.data?.token) setUserToken(res.data.token);
  return res.data;
};

// User register
export const userRegister = async (values) => {
  const res = await api.post("/api/auth/register", values);
  return res.data;
};

// Get user profile
export const getUserProfile = async () => {
  const res = await api.get("/api/auth/profile");
  return res.data;
};

// Update user profile
export const UpdateUserProfile = async (token, updatedData) => {
  const form = new FormData();
  Object.keys(updatedData).forEach((key) => {
    if (updatedData[key]) form.append(key, updatedData[key]);
  });

  const res = await api.put("/api/auth/profile/update", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
