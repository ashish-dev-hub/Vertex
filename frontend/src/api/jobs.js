 
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

// 1. GET: Saari jobs fetch
export const getJobs = () =>
  axios.get(`${API_URL}/api/jobs`, authConfig());

// 2. GET: Single job ki details
export const getJobById = (jobId) =>
  axios.get(`${API_URL}/api/jobs/${jobId}`, authConfig());

// 3. POST: Nayi job create
export const createJob = (jobData) =>
  axios.post(`${API_URL}/api/jobs`, jobData, authConfig());

// 4. PUT: Job update
export const updateJob = (jobId, jobData) =>
  axios.put(
    `${API_URL}/api/jobs/${jobId}`,
    jobData,
    authConfig()
  );

// 5. DELETE: Job delete
export const deleteJob = (jobId) =>
  axios.delete(`${API_URL}/api/jobs/${jobId}`, authConfig());

// 6. PATCH: Job open/close
export const updateJobStatus = (jobId, status) =>
  axios.patch(
    `${API_URL}/api/jobs/${jobId}/status`,
    { status },
    authConfig()
  );

