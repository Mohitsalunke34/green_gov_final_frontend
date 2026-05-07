import api from "./api";

// Create audit
export const createAudit = async (payload, auditorUserId) => {
  const res = await api.post("/api/audits", payload, {
    params: { auditorUserId },
  });
  return res.data;
};

// Get audits by status
export const getAuditsByStatus = async (status) => {
  const res = await api.get("/api/audits", { params: { status } });
  return res.data;
};

// Get audits by compliance ID
export const getAuditsByComplianceId = async (complianceId) => {
  const res = await api.get(`/api/audits/by-compliance/${complianceId}`);
  return res.data;
};

// Get audits by officer ID
export const getAuditsByOfficerId = async (officerId) => {
  const res = await api.get(`/api/audits/by-officer/${officerId}`);
  return res.data;
};

// Close audit
export const closeAudit = async (auditId, status, auditorUserId) => {
  const res = await api.post(
    `/api/audits/${auditId}/close`,
    {},
    {
      params: { status, auditorUserId },
    }
  );
  return res.data;
};
