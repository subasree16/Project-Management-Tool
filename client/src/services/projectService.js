import api from "./api";

export const fetchDashboardSummary = async () => {
  const { data } = await api.get("/projects/summary/dashboard");
  return data;
};

export const fetchProjects = async (params) => {
  const { data } = await api.get("/projects", { params });
  return data;
};

export const fetchProject = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post("/projects", payload);
  return data;
};

export const updateProject = async (projectId, payload) => {
  const { data } = await api.put(`/projects/${projectId}`, payload);
  return data;
};

export const deleteProject = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data;
};

