import { TOKEN_KEY } from "../constants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const apiRequest = async (endpoint, { auth = true, ...options } = {}) => {
  const token = auth ? getToken() : null;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Unable to connect to the server.");
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // empty or non-JSON body
  }

  if (!response.ok) {
    if (response.status === 401 && token && unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const registerUser = (userData) =>
  apiRequest("/auth/register", { auth: false, ...json("POST", userData) });

export const loginUser = (loginData) =>
  apiRequest("/auth/login", { auth: false, ...json("POST", loginData) });

export const forgotPassword = (email) =>
  apiRequest("/auth/forgot-password", {
    auth: false,
    ...json("POST", { email }),
  });

export const resetPassword = (token, password) =>
  apiRequest("/auth/reset-password", {
    auth: false,
    ...json("POST", { token, password }),
  });

export const getCurrentUser = () => apiRequest("/users/me");

export const updateProfile = (profileData) =>
  apiRequest("/users/me", json("PUT", profileData));

export const changePassword = (currentPassword, newPassword) =>
  apiRequest("/users/me/password", json("PUT", { currentPassword, newPassword }));

export const getCompanies = () => apiRequest("/companies");
export const createCompany = (data) => apiRequest("/companies", json("POST", data));
export const updateCompany = (id, data) =>
  apiRequest(`/companies/${id}`, json("PUT", data));
export const deleteCompany = (id) =>
  apiRequest(`/companies/${id}`, { method: "DELETE" });

export const getApplications = () => apiRequest("/applications");
export const getApplicationById = (id) => apiRequest(`/applications/${id}`);
export const createApplication = (data) =>
  apiRequest("/applications", json("POST", data));
export const updateApplication = (id, data) =>
  apiRequest(`/applications/${id}`, json("PUT", data));
export const deleteApplication = (id) =>
  apiRequest(`/applications/${id}`, { method: "DELETE" });

export const getInterviews = () => apiRequest("/interviews");
export const createInterview = (data) =>
  apiRequest("/interviews", json("POST", data));
export const updateInterview = (id, data) =>
  apiRequest(`/interviews/${id}`, json("PUT", data));
export const deleteInterview = (id) =>
  apiRequest(`/interviews/${id}`, { method: "DELETE" });
