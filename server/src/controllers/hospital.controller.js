const Hospital = require('../models/Hospital');
const asyncHandler = require('../utils/asyncHandler');

// ─── Get All Hospitals ────────────────────────────────────────────────────────
// GET /api/hospitals?city=&emergency=&specialty=
const getAllHospitals = asyncHandler(async (req, res) => {
  const { city, emergency, specialty } = req.query;
  const filter = {};
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (emergency === 'true') filter.emergencyAvailable = true;
  if (specialty) filter.specialties = { $in: [new RegExp(specialty, 'i')] };

  const hospitals = await Hospital.find(filter).sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Hospitals fetched.', data: hospitals });
});

// ─── Get Hospital By ID ───────────────────────────────────────────────────────
// GET /api/hospitals/:id
const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id).populate('createdByAdmin', 'name email');
  if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.', data: {} });
  res.status(200).json({ success: true, message: 'Hospital details fetched.', data: hospital });
});

// ─── Search Hospitals ─────────────────────────────────────────────────────────
// GET /api/hospitals/search?q=
const searchHospitals = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ success: false, message: 'Search query is required.', data: [] });

  const hospitals = await Hospital.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { city: { $regex: q, $options: 'i' } },
      { specialties: { $in: [new RegExp(q, 'i')] } },
      { address: { $regex: q, $options: 'i' } },
    ],
  });
  res.status(200).json({ success: true, message: `Search results for "${q}".`, data: hospitals });
});

// ─── Get Nearby Hospitals ─────────────────────────────────────────────────────
// GET /api/hospitals/nearby?city=  (simplified — filter by city as proxy for "nearby")
const getNearbyHospitals = asyncHandler(async (req, res) => {
  const { city, emergency } = req.query;
  const filter = {};
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (emergency === 'true') filter.emergencyAvailable = true;

  const hospitals = await Hospital.find(filter).limit(10).sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Nearby hospitals fetched.', data: hospitals });
});

// ─── Get By Speciality ────────────────────────────────────────────────────────
// GET /api/hospitals/speciality/:speciality
const getHospitalsBySpeciality = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({
    specialties: { $in: [new RegExp(req.params.speciality, 'i')] },
  }).sort({ name: 1 });
  res.status(200).json({ success: true, message: `Hospitals with specialty: ${req.params.speciality}.`, data: hospitals });
});

// ─── Get By City ──────────────────────────────────────────────────────────────
// GET /api/hospitals/city/:city
const getHospitalsByCity = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({
    city: { $regex: req.params.city, $options: 'i' },
  }).sort({ name: 1 });
  res.status(200).json({ success: true, message: `Hospitals in city: ${req.params.city}.`, data: hospitals });
});

module.exports = { getAllHospitals, getHospitalById, searchHospitals, getNearbyHospitals, getHospitalsBySpeciality, getHospitalsByCity };
