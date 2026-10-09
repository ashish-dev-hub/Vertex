
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
 

const authConfig = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in again. Token not found.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch recruiter profile
export const getRecruiterProfile = () => {
  return axios.get(
    `${API_URL}/api/recruiter/profile`,
    authConfig()
  );
};

// Create recruiter profile
export const createRecruiterProfile = (data) => {
  return axios.post(
    `${API_URL}/api/recruiter/profile`,
    data,
    authConfig()
  );
};

// Update recruiter profile
export const updateRecruiterProfile = (data) => {
  return axios.put(
    `${API_URL}/api/recruiter/profile`,
    data,
    authConfig()
  );
};

