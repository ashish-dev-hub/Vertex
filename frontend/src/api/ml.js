import axios from "axios";

/**
 * React/Axios integration pattern specified in Vertex Specification Section 8 & 9.
 * Flow: React frontend -> Node/Express backend -> FastAPI ML service -> Node/Express response -> React frontend.
 *
 * Local backend base URL: http://localhost:5000
 * Base URL configuration: VITE_API_BASE_URL
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

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

/**
 * Helper to unwrap nested data if Node backend returns { success: true, data: result }
 * or directly returns the ML response object.
 */
export function extractData(response) {
  if (response && typeof response === "object") {
    if (response.data !== undefined && response.success !== undefined) {
      return response.data;
    }
  }
  return response;
}

/**
 * Standard error formatter adhering to Section 9 checklist:
 * - 422 / 400: Check required fields and formats.
 * - 500: Prediction service error. Try again later.
 * - Network/timeout: Unable to connect. Check connection.
 */
export function parseApiError(error) {
  if (error.message === "Please log in first.") {
    return {
      status: "unauthorized",
      statusCode: 401,
      message: "Please log in first.",
      details: "You need to be logged in to make this prediction."
    };
  }

  if (!error.response) {
    return {
      status: "network",
      statusCode: null,
      message: "Unable to connect. Check connection.",
      details: error.message || "Network timeout or connection refused."
    };
  }

  const statusCode = error.response.status;
  const resData = error.response.data;

  if (statusCode === 401) {
    return {
      status: "unauthorized",
      statusCode,
      message: "Please log in first.",
      details: resData?.message || "Authentication required."
    };
  }

  if (statusCode === 422 || statusCode === 400) {
    const errorMsg =
      resData?.message ||
      (Array.isArray(resData?.missingFields)
        ? `Missing fields: ${resData.missingFields.join(", ")}`
        : "Check required fields and formats.");
    return {
      status: "validation",
      statusCode,
      message: "Check required fields and formats.",
      details: errorMsg,
      fieldErrors: resData?.missingFields || resData?.invalidFields || null
    };
  }

  if (statusCode >= 500) {
    return {
      status: "server_error",
      statusCode,
      message: "Prediction service error. Try again later.",
      details: resData?.message || "Internal server error occurred."
    };
  }

  return {
    status: "error",
    statusCode,
    message: resData?.message || "Unexpected error occurred.",
    details: JSON.stringify(resData || {})
  };
}

/**
 * API 1 — Classification / Candidate Fit
 * POST /api/ml/classification
 */
export async function getClassification(payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/ml/classification`,
    payload,
    authConfig()
  );
  return response.data;
}

/**
 * API 2 — Regression / Salary Prediction
 * POST /api/ml/regression
 */
export async function getRegression(payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/ml/regression`,
    payload,
    authConfig()
  );
  return response.data;
}

/**
 * API 3 — Recommendation / Similar Jobs
 * POST /api/ml/recommendation
 */
export async function getRecommendation(payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/ml/recommendation`,
    payload,
    authConfig()
  );
  return response.data;
}

/**
 * API 4 — Final Match
 * POST /api/ml/final-match
 */
export async function getFinalMatch(payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/ml/final-match`,
    payload,
    authConfig()
  );
  return response.data;
}
