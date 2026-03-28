import axiosInstance from "../api/axiosInstance";

/**
 * Hospital Service — wraps all /api/hospitals/* endpoints.
 */

export const getAllHospitals = async (params = {}) => {
  const res = await axiosInstance.get("/hospitals", { params });
  return res.data;
};

export const getHospitalById = async (id) => {
  const res = await axiosInstance.get(`/hospitals/${id}`);
  return res.data;
};

export const searchHospitals = async (q) => {
  const res = await axiosInstance.get("/hospitals/search", { params: { q } });
  return res.data;
};

export const getNearbyHospitals = async (params = {}) => {
  const res = await axiosInstance.get("/hospitals/nearby", { params });
  return res.data;
};

export const getHospitalsByCity = async (city) => {
  const res = await axiosInstance.get(
    `/hospitals/city/${encodeURIComponent(city)}`,
  );
  return res.data;
};

export const getHospitalsBySpeciality = async (speciality) => {
  const res = await axiosInstance.get(
    `/hospitals/speciality/${encodeURIComponent(speciality)}`,
  );
  return res.data;
};
