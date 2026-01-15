import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Update profile picture
export const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axios.put(
        `${API_URL}/protected/profile/picture`,
        formData,
        {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    return response.data;
};
