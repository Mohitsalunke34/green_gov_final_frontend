import api from "./api";

// Approve officer
export const approveOfficer = async (officerId) => {
  const res = await api.post(`/api/admin/officers/${officerId}/approve`);
  return res.data;
};
