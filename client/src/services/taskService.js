import api from "./api";

export const createTask = async (projectId, payload) => {
  const { data } = await api.post(`/tasks/project/${projectId}`, payload);
  return data;
};

export const updateTask = async (taskId, payload) => {
  const { data } = await api.put(`/tasks/${taskId}`, payload);
  return data;
};

export const deleteTask = async (taskId) => {
  const { data } = await api.delete(`/tasks/${taskId}`);
  return data;
};
