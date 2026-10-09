const API_BASE_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const registerUser = (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = (loginData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};

export const getCurrentUser = () => {
  return apiRequest("/users/me");
};

export const getCompanies = () => {
  return apiRequest("/companies");
};

export const createCompany = (companyData) => {
  return apiRequest("/companies", {
    method: "POST",
    body: JSON.stringify(companyData),
  });
};

export const updateCompany = (id, companyData) => {
  return apiRequest(`/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(companyData),
  });
};

export const deleteCompany = (id) => {
  return apiRequest(`/companies/${id}`, {
    method: "DELETE",
  });
};

export const getApplications = () => {
  return apiRequest("/applications");
};

export async function getApplicationById(id) {
  return apiRequest(`/applications/${id}`);
}

export const createApplication = (applicationData) => {
  return apiRequest("/applications", {
    method: "POST",
    body: JSON.stringify(applicationData),
  });
};

export const updateApplication = (id, applicationData) => {
  return apiRequest(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(applicationData),
  });
};

export const deleteApplication = (id) => {
  return apiRequest(`/applications/${id}`, {
    method: "DELETE",
  });
};

export const getInterviews = () => {
  return apiRequest("/interviews");
};

export const createInterview = (interviewData) => {
  return apiRequest("/interviews", {
    method: "POST",
    body: JSON.stringify(interviewData),
  });
};

export const updateInterview = (id, interviewData) => {
  return apiRequest(`/interviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(interviewData),
  });
};

export const deleteInterview = (id) => {
  return apiRequest(`/interviews/${id}`, {
    method: "DELETE",
  });
};
