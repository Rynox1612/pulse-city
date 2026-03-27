import axiosInstance from '../api/axiosInstance';

/**
 * Auth Service — wraps all /api/auth/* endpoints.
 * Keeps API calls separate from UI components.
 */

export const registerUser = async (userData) => {
  const res = await axiosInstance.post('/auth/register', userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post('/auth/login', credentials);
  return res.data;
};

export const loginAdmin = async (credentials) => {
  const res = await axiosInstance.post('/auth/admin/login', credentials);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data;
};
