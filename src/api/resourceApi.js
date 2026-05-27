import api from "./api";

/* ───────────────── RESOURCES ───────────────── */

/* ✅ Create Resource */
export const createResource = async (payload) => {
  const res = await api.post("/api/resources", payload);
  return res.data;
};

/* ✅ Allocate Resource */
export const allocateResource = async (resourceId, payload) => {
  const res = await api.put(`/api/resources/${resourceId}/allocate`, payload);
  return res.data;
};

/* ✅ Get all resources (FIXED ✅) */
export const getAllResources = async (params = {}) => {
  const res = await api.get("/api/resources", { params });
  return res.data?.content || [];  // Always return ARRAY
};

/* ✅ Get resource by ID */
export const getResourceById = async (resourceId) => {
  const res = await api.get(`/api/resources/${resourceId}`);
  return res.data;
};

/* ✅ Delete resource */
export const deleteResource = async (resourceId) => {
  const res = await api.delete(`/api/resources/${resourceId}`);
  return res.data;
};


/* ───────────────── INFRASTRUCTURE ───────────────── */

/* ✅ Create Infrastructure */
export const createInfrastructure = async (payload) => {
  const res = await api.post("/api/infrastructure", payload);
  return res.data;
};

/* ✅ Update Capacity */
export const updateInfrastructureCapacity = async (infraId, payload) => {
  const res = await api.put(
    `/api/infrastructure/${infraId}/capacity`,
    payload
  );
  return res.data;
};

/* ✅ Get all infrastructure (FIXED ✅) */
export const getAllInfrastructure = async (params = {}) => {
  const res = await api.get("/api/infrastructure", { params });
  return res.data?.content || [];  // Always return ARRAY
};

/* ✅ Get by ID */
export const getInfrastructureById = async (infraId) => {
  const res = await api.get(`/api/infrastructure/${infraId}`);
  return res.data;
};

/* ✅ Delete */
export const deleteInfrastructure = async (infraId) => {
  const res = await api.delete(`/api/infrastructure/${infraId}`);
  return res.data;
};