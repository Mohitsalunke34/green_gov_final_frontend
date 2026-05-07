import api from "./api";

// Apply for a program
export const applyForProgram = async (applicantId, programId) => {
  const res = await api.post("/api/applications/apply", {
    applicantId,
    programId,
  });
  return res.data;
};

// Fetch all applications
export const fetchAllApplications = async () => {
  const res = await api.get("/api/applications/fetchAll");
  return res.data;
};

// Update application status (approve/reject)
export const updateApplicationStatus = async (applicationId, action) => {
  const res = await api.patch(
    `/api/applications/updateApplicationStatus/${applicationId}/${action}`
  );
  return res.data;
};

// Get application by ID
export const getApplicationById = async (applicationId) => {
  const res = await api.get(`/api/applications/fetchById/${applicationId}`);
  return res.data;
};
