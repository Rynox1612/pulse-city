import axiosInstance from '../api/axiosInstance';

/**
 * Hospital Admin Service — wraps all /api/admin/* endpoints
 * and other admin-specific actions.
 */

// Auth
export const adminLoginApi = async (credentials) => {
  const res = await axiosInstance.post('/auth/admin/login', credentials);
  return res.data;
};

// Profile & Hospital Management
export const getAdminProfile = async () => {
  const res = await axiosInstance.get('/admin/profile');
  return res.data;
};

export const updateAdminProfile = async (data) => {
  const res = await axiosInstance.put('/admin/profile', data);
  return res.data;
};

export const getAdminHospital = async () => {
  const res = await axiosInstance.get('/admin/hospital');
  return res.data;
};

export const updateAdminHospital = async (data) => {
  const res = await axiosInstance.put('/admin/hospital', data);
  return res.data;
};

// Analytics & Requests Dashboard
export const getAdminAnalytics = async () => {
  const res = await axiosInstance.get('/admin/analytics');
  return res.data;
};

export const getIncomingRequests = async (status = '') => {
  const res = await axiosInstance.get('/admin/emergency-requests', { params: { status } });
  return res.data;
};

export const updateRequestStatus = async (id, status) => {
  const res = await axiosInstance.put(`/emergency/${id}/status`, { status });
  return res.data;
};

// Doctors (hospital admin only actions)
export const addDoctor = async (data) => {
  const res = await axiosInstance.post('/doctors', data);
  return res.data;
};

export const updateDoctor = async (id, data) => {
  const res = await axiosInstance.put(`/doctors/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await axiosInstance.delete(`/doctors/${id}`);
  return res.data;
};

// Availability
export const updateAvailability = async (hospitalId, data) => {
  const res = await axiosInstance.put(`/availability/${hospitalId}`, data);
  return res.data;
};
