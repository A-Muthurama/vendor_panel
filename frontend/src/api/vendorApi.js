import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Add Interceptor for Token
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const getProfile = () => API.get("/protected/profile");
export const getStats = () => API.get("/protected/stats");
export const getOffers = () => API.get("/protected/offers");
export const createOffer = (data) => API.post("/protected/offers", data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteOffer = (id) => API.delete(`/protected/offers/${id}`);
export const createOrder = (data) => API.post("/protected/create-order", data);
export const subscribePlan = (data) => API.post("/protected/subscribe", data);
export const getPlans = () => API.get("/protected/plans");
export const updateProfilePicture = (data) => API.put("/protected/profile/picture", data, { headers: { "Content-Type": "multipart/form-data" } });
