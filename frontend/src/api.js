const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Store token in localStorage
export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");
export const isLoggedIn = () => !!localStorage.getItem("token");

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

export const logoutUser = () =>
  apiFetch('/api/auth/logout', { method: 'POST' }).finally(() => removeToken());

// Dashboard API
export const getDashboard = () => apiFetch('/api/dashboard');

// Projects API
export const getProjects = () => apiFetch('/api/projects');
export const createProject = (data) =>
  apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(data) });

// Scans API
export const getScans = () => apiFetch('/api/scans');
export const getScanById = (id) => apiFetch(`/api/scans/${id}`);
export const createScan = (data) =>
  apiFetch('/api/scans', { method: 'POST', body: JSON.stringify(data) });

// Reports API
export const getReports = () => apiFetch('/api/reports');
export const getReportById = (id) => apiFetch(`/api/reports/${id}`);

export const downloadReportFile = (id, format = 'json') => {
  const token = getToken();
  const url = `${API_URL}/api/reports/${id}/download?format=${format}`;

  fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `pluto_security_report_${id}.${format === 'md' ? 'md' : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
};

// Vulnerabilities & AI Fix API
export const getVulnerabilities = () => apiFetch('/api/vulnerabilities');
export const getVulnerabilityFix = (id) =>
  apiFetch(`/api/vulnerabilities/${id}/fix`, { method: 'POST' });

// AI Assistant Chat API
export const sendAIChat = (message, context = {}) =>
  apiFetch('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });

// Feedback API
export const submitFeedback = (data) =>
  apiFetch('/api/feedback', { method: 'POST', body: JSON.stringify(data) });

export const getReportFeedback = (reportId) =>
  apiFetch(`/api/feedback/report/${reportId}`);