const Doctor = require('../models/Doctor');
const asyncHandler = require('../utils/asyncHandler');

// ─── Get All Doctors ──────────────────────────────────────────────────────────
// GET /api/doctors
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find().populate('hospitalId', 'name city').sort({ name: 1 });
  res.status(200).json({ success: true, message: 'All doctors fetched.', data: doctors });
});

// ─── Get Doctor By ID ─────────────────────────────────────────────────────────
// GET /api/doctors/:id
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('hospitalId', 'name city address contactNumber');
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.', data: {} });
  res.status(200).json({ success: true, message: 'Doctor details fetched.', data: doctor });
});

// ─── Get Doctors by Hospital ──────────────────────────────────────────────────
// GET /api/doctors/hospital/:hospitalId
const getDoctorsByHospital = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ hospitalId: req.params.hospitalId }).sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Doctors for hospital fetched.', data: doctors });
});

// ─── Get Doctors by Specialization ───────────────────────────────────────────
// GET /api/doctors/specialization/:specialization
const getDoctorsBySpecialization = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({
    specialization: { $regex: req.params.specialization, $options: 'i' },
  }).populate('hospitalId', 'name city').sort({ name: 1 });
  res.status(200).json({ success: true, message: `Doctors with specialization: ${req.params.specialization}.`, data: doctors });
});

// ─── Get Available Doctors ────────────────────────────────────────────────────
// GET /api/doctors/available
const getAvailableDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ availabilityStatus: 'available' })
    .populate('hospitalId', 'name city').sort({ name: 1 });
  res.status(200).json({ success: true, message: 'Available doctors fetched.', data: doctors });
});

// ─── Create Doctor (Admin) ────────────────────────────────────────────────────
// POST /api/doctors
const createDoctor = asyncHandler(async (req, res) => {
  const { name, specialization, hospitalId, shiftStart, shiftEnd, contactInfo } = req.body;
  if (!name || !specialization || !hospitalId) {
    return res.status(400).json({ success: false, message: 'Name, specialization, and hospitalId are required.', data: {} });
  }
  const doctor = await Doctor.create({ name, specialization, hospitalId, shiftStart, shiftEnd, contactInfo });
  res.status(201).json({ success: true, message: 'Doctor created successfully.', data: doctor });
});

// ─── Update Doctor (Admin) ────────────────────────────────────────────────────
// PUT /api/doctors/:id
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.', data: {} });
  res.status(200).json({ success: true, message: 'Doctor updated.', data: doctor });
});

// ─── Delete Doctor (Admin) ────────────────────────────────────────────────────
// DELETE /api/doctors/:id
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.', data: {} });
  res.status(200).json({ success: true, message: 'Doctor deleted.', data: {} });
});

module.exports = { getAllDoctors, getDoctorById, getDoctorsByHospital, getDoctorsBySpecialization, getAvailableDoctors, createDoctor, updateDoctor, deleteDoctor };
