import axios from "axios";

// Uses REACT_APP_API_URL from .env (for production)
// Falls back to localhost for local development
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"
});

export const signupVendor = (data) =>
  API.post("/auth/signup", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const loginVendor = (data) =>
  API.post("/auth/login", data);

export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);

export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);

export const sendEmailOTP = (data) =>
  API.post("/auth/send-otp", data);

export const verifyEmailOTP = (data) =>
  API.post("/auth/verify-otp", data);
