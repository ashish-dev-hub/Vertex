 import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("API URL:", API_URL);

// SIGNUP
export const signup = (data) => {
  return axios.post(`${API_URL}/api/auth/register`, data);
};

// LOGIN
export const login = async (data) => {
  const response = await axios.post(
    `${API_URL}/api/auth/login`,
    data
  );

  // Backend se JWT token
  const token = response.data.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  return response;
};

// GET CURRENT USER
export const getMe = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
};