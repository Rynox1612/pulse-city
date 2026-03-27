import axiosInstance from '../api/axiosInstance';

/**
 * Doctor Service — wraps all /api/doctors/* endpoints.
 */

export const getAllDoctors = async (params = {}) => {
  const res = await axiosInstance.get('/doctors', { params });
  return res.data;
};

export const getDoctorById = async (id) => {
  const res = await axiosInstance.get(`/doctors/${id}`);
  return res.data;
};

export const getDoctorsByHospital = async (hospitalId) => {
  const res = await axiosInstance.get(`/doctors/hospital/${hospitalId}`);
  return res.data;
};

export const getDoctorsBySpecialization = async (specialization) => {
  const res = await axiosInstance.get(`/doctors/specialization/${encodeURIComponent(specialization)}`);
  return res.data;
};

export const getAvailableDoctors = async () => {
  const res = await axiosInstance.get('/doctors/available');
  return res.data;
};
