const Hospital = require('../models/Hospital');
const asyncHandler = require('../utils/asyncHandler');

// Resource fields we expose for availability queries
const AVAILABILITY_FIELDS = 'name city emergencyAvailable icuBeds erBeds generalBeds ventilators ambulanceAvailable';

// ─── Get All Hospital Availability ───────────────────────────────────────────
// GET /api/availability
const getAllAvailability = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find().select(AVAILABILITY_FIELDS).sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Availability snapshot fetched.', data: hospitals });
});

// ─── Get Availability for One Hospital ───────────────────────────────────────
// GET /api/availability/:hospitalId
const getAvailabilityByHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.hospitalId).select(AVAILABILITY_FIELDS);
  if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.', data: {} });
  res.status(200).json({ success: true, message: 'Hospital availability fetched.', data: hospital });
});

// ─── Update Availability (Admin Only) ────────────────────────────────────────
// PUT /api/availability/:hospitalId
const updateAvailability = asyncHandler(async (req, res) => {
  const allowed = ['emergencyAvailable', 'icuBeds', 'erBeds', 'generalBeds', 'ventilators', 'ambulanceAvailable'];
  const updates = {};
  allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  const hospital = await Hospital.findByIdAndUpdate(req.params.hospitalId, updates, { new: true, runValidators: true }).select(AVAILABILITY_FIELDS);
  if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.', data: {} });
  res.status(200).json({ success: true, message: 'Availability updated successfully.', data: hospital });
});

// ─── Hospitals with Open ER ───────────────────────────────────────────────────
// GET /api/availability/er/available
const getERAvailable = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({ emergencyAvailable: true, erBeds: { $gt: 0 } }).select(AVAILABILITY_FIELDS).sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Hospitals with open ER beds.', data: hospitals });
});

// ─── Hospitals with Open ICU ──────────────────────────────────────────────────
// GET /api/availability/icu/available
const getICUAvailable = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({ icuBeds: { $gt: 0 } }).select(AVAILABILITY_FIELDS).sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Hospitals with available ICU beds.', data: hospitals });
});

// ─── Hospitals with Ambulance ─────────────────────────────────────────────────
// GET /api/availability/ambulance/available
const getAmbulanceAvailable = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({ ambulanceAvailable: true }).select(AVAILABILITY_FIELDS).sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Hospitals with ambulance available.', data: hospitals });
});

module.exports = { getAllAvailability, getAvailabilityByHospital, updateAvailability, getERAvailable, getICUAvailable, getAmbulanceAvailable };
