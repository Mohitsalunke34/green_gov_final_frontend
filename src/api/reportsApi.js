import api from "./api";

// Generate a report by type (COMPLIANCE, PROJECT, etc.)
export const generateReport = async (type) => {
  const res = await api.post(`/api/reports/generate/${type}`);
  return res.data;
};

// Get reports by scope (PROJECT, APPLICATION, etc.)
export const getReportsByScope = async (scope) => {
  const res = await api.get(`/api/reports/scope/${scope}`);
  return res.data;
};

// Fetch report by ID
export const getReportById = async (id) => {
  const res = await api.get(`/api/reports/fetchById/${id}`);
  return res.data;
};

// Fetch analytics overview
export const getAnalytics = async () => {
  const res = await api.get("/api/reports/analytics");
  return res.data;
};

// Fetch reports summary
export const getReportsSummary = async () => {
  const res = await api.get("/api/reports/fetchBySummary/summary");
  return res.data;
};
