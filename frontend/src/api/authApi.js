import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const signupVendor = (data) =>
  API.post("/auth/signup", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const loginVendor = (data) =>
  API.post("/auth/login", data);
