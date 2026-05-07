import api from "./api";

// Create a new incentive
export const createIncentive = async (payload, officerUserId) => {
  const config = {
    headers: {
      "X-Officer-User-Id": officerUserId,
    },
  };
  const res = await api.post("/api/incentives/create", payload, config);
  return res.data;
};

// Fetch all incentives
export const fetchAllIncentives = async () => {
  const res = await api.get("/api/incentives/fetchAllIncentives");
  return res.data;
};

// Get incentive by ID
export const getIncentiveById = async (incentiveId) => {
  const res = await api.get(`/api/incentives/fetchById/${incentiveId}`);
  return res.data;
};

// Get incentives by application ID
export const getIncentivesByApplicationId = async (applicationId) => {
  const res = await api.get(`/api/incentives/application/${applicationId}`);
  return res.data;
};

// Get incentives by beneficiary ID
export const getIncentivesByBeneficiaryId = async (beneficiaryId) => {
  const res = await api.get(`/api/incentives/beneficiary/${beneficiaryId}`);
  return res.data;
};

// Delete incentive
export const deleteIncentive = async (incentiveId) => {
  const res = await api.delete(`/api/incentives/deleteById/${incentiveId}`);
  return res.data;
};
