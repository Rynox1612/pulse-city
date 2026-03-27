import axiosInstance from '../api/axiosInstance';

/**
 * User Service — wraps all /api/users/* and /api/emergency/* user endpoints.
 */

// ── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = async () => {
  const res = await axiosInstance.get('/users/profile');
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axiosInstance.put('/users/profile', data);
  return res.data;
};

// ── Medical Info ──────────────────────────────────────────────────────────────
export const getMedicalInfo = async () => {
  const res = await axiosInstance.get('/users/medical-info');
  return res.data;
};

export const updateMedicalInfo = async (data) => {
  const res = await axiosInstance.put('/users/medical-info', data);
  return res.data;
};

// ── Saved Hospitals ───────────────────────────────────────────────────────────
export const getSavedHospitals = async () => {
  const res = await axiosInstance.get('/users/saved-hospitals');
  return res.data;
};

export const saveHospital = async (hospitalId) => {
  const res = await axiosInstance.post(`/users/saved-hospitals/${hospitalId}`);
  return res.data;
};

export const removeSavedHospital = async (hospitalId) => {
  const res = await axiosInstance.delete(`/users/saved-hospitals/${hospitalId}`);
  return res.data;
};

