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

// 1. Student applies to a job
// Body: { jobId: "<mongoId>" }
export const applyToJob = (jobId) => {
  return axios.post(
    `${API_URL}/api/applications`,
    { jobId },
    authConfig()
  );
};

// 2. Student's own applications
export const getMyApplications = () => {
  return axios.get(
    `${API_URL}/api/applications/my`,
    authConfig()
  );
};

// 3. Get a single application by ID
export const getApplicationById = (applicationId) => {
  return axios.get(
    `${API_URL}/api/applications/${applicationId}`,
    authConfig()
  );
};

// 4. Recruiter: get all applicants for a specific job
export const getApplicantsForJob = (jobId) => {
  return axios.get(
    `${API_URL}/api/applications/job/${jobId}`,
    authConfig()
  );
};

// 5. Recruiter: update application status
// status: "pending" | "shortlisted" | "accepted" | "rejected"
export const updateApplicationStatus = (applicationId, status) => {
  return axios.patch(
    `${API_URL}/api/applications/${applicationId}/status`,
    { status },
    authConfig()
  );
};
