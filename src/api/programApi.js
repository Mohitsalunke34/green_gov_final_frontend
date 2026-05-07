import api from "./api";

// Create a new program
export const createProgram = async (payload) => {
  const res = await api.post("/api/programs/create", payload);
  return res.data;
};

// Fetch all programs
export const fetchAllPrograms = async () => {
  const res = await api.get("/api/programs/fetchAll");
  return res.data;
};

// Update program status
export const updateProgramStatus = async (programId, status) => {
  const res = await api.patch(
    `/api/programs/updateProgramStatus/${programId}/status`,
    null,
    { params: { status } }
  );
  return res.data;
};

// Get program by ID
export const getProgramById = async (programId) => {
  const res = await api.get(`/api/programs/fetchById/${programId}`);
  return res.data;
};
