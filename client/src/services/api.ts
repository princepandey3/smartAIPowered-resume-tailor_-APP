import axios from "axios";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  ResumeUploadData,
  ResumeAnalysis,
} from "../types";

const API_BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "";

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? API_BASE_URL : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

// Resume API calls
export const resumeAPI = {
  uploadAndAnalyze: async (
    data: ResumeUploadData
  ): Promise<{ message: string; atsResult: ResumeAnalysis }> => {
    const formData = new FormData();
    formData.append("resume", data.file);
    formData.append("jobDescription", data.jobDescription);

    const response = await api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
