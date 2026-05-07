import api from "./api";

// Register participant (citizen/business)
export const registerParticipant = async (payload) => {
  const res = await api.post("/api/participants/register", payload);
  return res.data;
};

// Get participant by ID
export const getParticipantById = async (participantId) => {
  const res = await api.get(`/api/participants/${participantId}`);
  return res.data;
};

// Update participant profile
export const updateParticipant = async (participantId, payload) => {
  const res = await api.put(`/api/participants/${participantId}`, payload);
  return res.data;
};

// Get participant documents
export const getParticipantDocuments = async (participantId) => {
  const res = await api.get(`/api/participants/${participantId}/documents`);
  return res.data;
};

// Upload document
export const uploadDocument = async (participantId, payload) => {
  const res = await api.post(
    `/api/participants/${participantId}/documents`,
    payload
  );
  return res.data;
};

// Update document status
export const updateDocumentStatus = async (
  participantId,
  documentId,
  status
) => {
  const res = await api.put(
    `/api/participants/${participantId}/documents/${documentId}/status`,
    { status }
  );
  return res.data;
};

// Update participant verification status
export const updateParticipantVerificationStatus = async (
  participantId,
  status
) => {
  const res = await api.put(
    `/api/participants/${participantId}/verification-status`,
    { status }
  );
  return res.data;
};
