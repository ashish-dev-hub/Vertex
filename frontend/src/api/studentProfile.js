import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. Profile create/save
export const createStudentProfile = (data) => {
  return axios.post(
    `${API_URL}/api/student/profile`,
    data,
    getAuthConfig(),
    {withCredentials:true}
  );
};

// 2. Profile fetch
export const getStudentProfile = () => {
  return axios.get(
    `${API_URL}/api/student/profile`,
    getAuthConfig(),
    {withCredentials:true}
  );
};

// 3. Profile update
export const updateStudentProfile = (data) => {
  return axios.put(
    `${API_URL}/api/student/profile`,
    data,
    getAuthConfig(),
    {withCredentials:true}
  );
};