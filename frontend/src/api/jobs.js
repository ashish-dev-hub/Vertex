
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authConfig = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in first.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Saari jobs fetch karna
export const getJobs = () => {
  return axios.get(`${API_URL}/api/jobs`, authConfig());
};

// Single job fetch karna
export const getJobById = (jobId) => {
  return axios.get(
    `${API_URL}/api/jobs/${jobId}`,
    authConfig()
  );
};

// Nayi job post karna
export const createJob = (jobData) => {
  return axios.post(
    `${API_URL}/api/jobs`,
    jobData,
    authConfig()
  );
};

// Job update karna
export const updateJob = (jobId, jobData) => {
  return axios.put(
    `${API_URL}/api/jobs/${jobId}`,
    jobData,
    authConfig()
  );
};

// Job delete karna
export const deleteJob = (jobId) => {
  return axios.delete(
    `${API_URL}/api/jobs/${jobId}`,
    authConfig()
  );
};

// Job open/close karna
export const updateJobStatus = (jobId, status) => {
  return axios.patch(
    `${API_URL}/api/jobs/${jobId}/status`,
    { status },
    authConfig()
  );
};
