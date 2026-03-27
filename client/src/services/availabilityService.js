import axiosInstance from '../api/axiosInstance';

/**
 * Availability Service — wraps all /api/availability/* endpoints.
 */

export const getAllAvailability = async () => {
  const res = await axiosInstance.get('/availability');
  return res.data;
};

export const getHospitalAvailability = async (hospitalId) => {
  const res = await axiosInstance.get(`/availability/${hospitalId}`);
  return res.data;
};

export const getAvailableERHospitals = async () => {
  const res = await axiosInstance.get('/availability/er/available');
  return res.data;
};

export const getAvailableICUHospitals = async () => {
  const res = await axiosInstance.get('/availability/icu/available');
  return res.data;
};

export const getAvailableAmbulanceHospitals = async () => {
  const res = await axiosInstance.get('/availability/ambulance/available');
  return res.data;
};
