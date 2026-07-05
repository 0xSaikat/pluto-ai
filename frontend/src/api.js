const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Store token in localStorage
export const saveToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
export const isLoggedIn = () => !!getToken();

// Base fetch function
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth APIs
export const registerUser = (userData) =>
  apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) });

export const loginUser = (credentials) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });

// Dashboard API
export const getDashboard = () => apiFetch('/api/dashboard');

// Projects API
export const getProjects = () => apiFetch('/api/projects');
export const createProject = (data) =>
  apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(data) });

// Scans API
export const getScans = () => apiFetch('/api/scans');
export const createScan = (data) =>
  apiFetch('/api/scans', { method: 'POST', body: JSON.stringify(data) });

// Reports API
export const getReports = () => apiFetch('/api/reports');

// Vulnerabilities API
export const getVulnerabilities = () => apiFetch('/api/vulnerabilities');