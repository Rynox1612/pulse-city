import axiosInstance from '../api/axiosInstance';

/**
 * Emergency Request Service — wraps all /api/emergency/* endpoints.
 */

export const createEmergencyRequest = async (data) => {
  const res = await axiosInstance.post('/emergency/request', data);
  return res.data;
};

export const getMyEmergencyRequests = async () => {
  const res = await axiosInstance.get('/emergency/my-requests');
  return res.data;
};

export const getRequestById = async (id) => {
  const res = await axiosInstance.get(`/emergency/${id}`);
  return res.data;
};

export const cancelRequest = async (id) => {
  const res = await axiosInstance.delete(`/emergency/${id}/cancel`);
  return res.data;
};
