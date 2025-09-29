// -------------------- Imports --------------------
import axios from "axios";
import { userLogin, loginUserData_email } from "./auth";

// --------------------- Env Keys --------------------
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
export const PINCODE_KEY = import.meta.env.VITE_LOCATION_PINCODE_KEY;

// -------------------- Token Keys --------------------
const ADMIN_TOKEN_KEY = "admin_token";
const USER_TOKEN_KEY = "user_token";

// -------------------- Axios Instance --------------------
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// -------------------- Admin Token Helpers --------------------
export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

// -------------------- User Token Helpers --------------------
export const getUserToken = () => localStorage.getItem(USER_TOKEN_KEY);
export const setUserToken = (token) => localStorage.setItem(USER_TOKEN_KEY, token);
export const clearUserToken = () => localStorage.removeItem(USER_TOKEN_KEY);

// -------------------- Token Fetchers --------------------
export const fetchNewAdminToken = async () => {
  const { data } = await axios.post(`${BASE_URL}/api/auth/admin-login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const token = data?.data?.token;
  if (token) setAdminToken(token);
  return token;
};

export const fetchNewUserToken = async () => {
  const email = loginUserData_email();
  if (!email) throw new Error("User's email not found in Storage. Please log in again.");
  const res = await userLogin(email);
  const token = res?.token;
  if (token) setUserToken(token);
  return token;
};

// -------------------- Axios Interceptors --------------------
api.interceptors.request.use(
  async (config) => {
    let token;
    if (
      config.url?.startsWith("/api/auth/profile") ||
      config.url?.startsWith("/api/auth/profile/update") ||
      config.url?.startsWith("/api/wishlist/create") ||
      config.url?.startsWith("/api/wishlist/my-wishlist")
    ) {
      token = getUserToken() || (await fetchNewUserToken());
    } else {
      token = getAdminToken() || (await fetchNewAdminToken());
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["ngrok-skip-browser-warning"] = "true";
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errMsg = error.response?.data?.message || error.message;

    if (
      (error.response?.status === 401 ||
        errMsg.includes("Authorization header missing or invalid")) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (
        originalRequest.url?.startsWith("/api/auth/profile") ||
        originalRequest.url?.startsWith("/api/auth/profile/update") ||
        originalRequest.url?.startsWith("/api/wishlist/create") ||
        originalRequest.url?.startsWith("/api/wishlist/my-wishlist")
      ) {
        clearUserToken();
        const newUserToken = await fetchNewUserToken();
        originalRequest.headers.Authorization = `Bearer ${newUserToken}`;
      } else {
        clearAdminToken();
        const newAdminToken = await fetchNewAdminToken();
        originalRequest.headers.Authorization = `Bearer ${newAdminToken}`;
      }

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
