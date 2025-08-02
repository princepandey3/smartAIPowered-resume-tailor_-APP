export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  _id: string;
  name: string;
  email: string;
  message: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  keywordMatchPercentage: number;
  missingKeywords: string[];
}

export interface ResumeUploadData {
  file: File;
  jobDescription: string;
}

export interface ApiError {
  error?: string;
  message?: string;
}