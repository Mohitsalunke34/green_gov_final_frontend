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


// Get disbursements by participant name
export const getDisbursementsByParticipantName = async (participantName, officerUserId) => {
  const config = {
    headers: {
      "X-Officer-User-Id": officerUserId,
    },
  };

};