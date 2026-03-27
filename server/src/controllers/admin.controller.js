const HospitalAdmin = require('../models/HospitalAdmin');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const EmergencyRequest = require('../models/EmergencyRequest');
const asyncHandler = require('../utils/asyncHandler');
const { REQUEST_STATUS } = require('../config/appConstants');

// ─── Get Admin Profile ────────────────────────────────────────────────────────
// GET /api/admin/profile
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await HospitalAdmin.findById(req.user.id).select('-password').populate('hospitalId', 'name city');
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.', data: {} });
  res.status(200).json({ success: true, message: 'Admin profile fetched.', data: admin });
});

// ─── Update Admin Profile ─────────────────────────────────────────────────────
// PUT /api/admin/profile
const updateAdminProfile = asyncHandler(async (req, res) => {
  const allowed = ['name'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const admin = await HospitalAdmin.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.', data: {} });
  res.status(200).json({ success: true, message: 'Profile updated.', data: admin });
});

// ─── Get Admin's Hospital ─────────────────────────────────────────────────────
// GET /api/admin/hospital
const getAdminHospital = asyncHandler(async (req, res) => {
  const admin = await HospitalAdmin.findById(req.user.id);
  if (!admin?.hospitalId) return res.status(404).json({ success: false, message: 'No hospital linked to this admin.', data: {} });

  const hospital = await Hospital.findById(admin.hospitalId);
  res.status(200).json({ success: true, message: 'Hospital details fetched.', data: hospital });
});

// ─── Update Admin's Hospital ──────────────────────────────────────────────────
// PUT /api/admin/hospital
const updateAdminHospital = asyncHandler(async (req, res) => {
  const admin = await HospitalAdmin.findById(req.user.id);
  if (!admin?.hospitalId) return res.status(404).json({ success: false, message: 'No hospital linked to this admin.', data: {} });

  const allowedFields = ['name', 'address', 'city', 'coordinates', 'specialties', 'emergencyAvailable', 'icuBeds', 'erBeds', 'generalBeds', 'ventilators', 'ambulanceAvailable', 'contactNumber', 'is24x7', 'hospitalType'];
  const updates = {};
  allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const hospital = await Hospital.findByIdAndUpdate(admin.hospitalId, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Hospital updated successfully.', data: hospital });
});

// ─── Get Emergency Requests for Admin's Hospital ──────────────────────────────
// GET /api/admin/emergency-requests
const getAdminEmergencyRequests = asyncHandler(async (req, res) => {
  const admin = await HospitalAdmin.findById(req.user.id);
  if (!admin?.hospitalId) return res.status(404).json({ success: false, message: 'No hospital linked.', data: {} });

  const { status } = req.query;
  const filter = { hospitalId: admin.hospitalId };
  if (status) filter.status = status;

  const requests = await EmergencyRequest.find(filter)
    .populate('userId', 'name phone bloodGroup allergies emergencyContact')
    .sort({ requestedAt: -1 });
  res.status(200).json({ success: true, message: 'Emergency requests fetched.', data: requests });
});

// ─── Get Admin Analytics ──────────────────────────────────────────────────────
// GET /api/admin/analytics
const getAdminAnalytics = asyncHandler(async (req, res) => {
  const admin = await HospitalAdmin.findById(req.user.id);
  if (!admin?.hospitalId) return res.status(404).json({ success: false, message: 'No hospital linked.', data: {} });

  const hospitalId = admin.hospitalId;
  const [totalDoctors, pendingRequests, acceptedRequests, completedRequests, hospital] = await Promise.all([
    Doctor.countDocuments({ hospitalId }),
    EmergencyRequest.countDocuments({ hospitalId, status: REQUEST_STATUS.PENDING }),
    EmergencyRequest.countDocuments({ hospitalId, status: REQUEST_STATUS.ACCEPTED }),
    EmergencyRequest.countDocuments({ hospitalId, status: REQUEST_STATUS.COMPLETED }),
    Hospital.findById(hospitalId).select('name emergencyAvailable erBeds icuBeds'),
  ]);

  res.status(200).json({
    success: true,
    message: 'Analytics fetched.',
    data: {
      hospital: hospital?.name,
      emergencyAvailable: hospital?.emergencyAvailable,
      erBeds: hospital?.erBeds,
      icuBeds: hospital?.icuBeds,
      totalDoctors,
      requests: { pending: pendingRequests, accepted: acceptedRequests, completed: completedRequests },
    },
  });
});

module.exports = { getAdminProfile, updateAdminProfile, getAdminHospital, updateAdminHospital, getAdminEmergencyRequests, getAdminAnalytics };
