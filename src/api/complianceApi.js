import api from "./api";

// Create compliance record
export const createCompliance = async (payload, officerUserId) => {
  const res = await api.post("/api/compliance", payload, {
    params: { officerUserId },
  });
  return res.data;
};

// Get compliance by subject (PROJECT or APPLICATION)
export const getComplianceBySubject = async (subjectType, subjectId) => {
  const res = await api.get("/api/compliance/subject", {
    params: { subjectType, subjectId },
  });
  return res.data;
};

// Get compliance records by participant
export const getComplianceByParticipant = async (participantId) => {
  const res = await api.get(`/api/compliance/participant/${participantId}`);
  return res.data;
};
