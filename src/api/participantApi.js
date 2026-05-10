import api from "./api";

export const registerParticipant = async (payload) => {
  const res = await api.post("/api/participants/register", payload);
  return res.data;
};

export const getParticipantById = async (participantId) => {
  const res = await api.get(`/api/participants/${participantId}`);
  return res.data;
};

export const getParticipantByUserId = async (userId) => {
  const res = await api.get(`/api/participants/user/${userId}`);
  return res.data;
};

export const updateParticipant = async (participantId, payload) => {
  const res = await api.put(`/api/participants/${participantId}`, payload);
  return res.data;
};

export const getParticipantDocuments = async (participantId) => {
  const res = await api.get(`/api/participants/${participantId}/documents`);
  return res.data;
};

export const uploadDocument = async (participantId, payload) => {
  const res = await api.post(
    `/api/participants/${participantId}/documents`,
    payload
  );
  return res.data;
};

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