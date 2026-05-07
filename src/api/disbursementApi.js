import api from "./api";

// Create a new disbursement
export const createDisbursement = async (payload, officerUserId) => {
  const config = {
    headers: {
      "X-Officer-User-Id": officerUserId,
    },
  };
  const res = await api.post("/api/disbursements", payload, config);
  return res.data;
};

// Get disbursement history by incentive ID
export const getDisbursementsByIncentiveId = async (
  incentiveId,
  officerUserId
) => {
  const config = {
    headers: {
      "X-Officer-User-Id": officerUserId,
    },
  };
  const res = await api.get(
    `/api/disbursements/by-incentive/${incentiveId}`,
    config
  );
  return res.data;
};

// Get disbursement by incentive ID and disbursement ID
export const getDisbursementByIds = async (
  incentiveId,
  disbursementId,
  officerUserId
) => {
  const config = {
    headers: {
      "X-Officer-User-Id": officerUserId,
    },
  };
  const res = await api.get(
    `/api/disbursements/fetchByIncentiveId&disbursementId/${incentiveId}/${disbursementId}`,
    config
  );
  return res.data;
};
