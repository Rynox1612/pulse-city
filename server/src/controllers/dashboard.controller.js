const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const EmergencyRequest = require('../models/EmergencyRequest');
const asyncHandler = require('../utils/asyncHandler');
const { REQUEST_STATUS } = require('../config/appConstants');

// ─── City-Wide Dashboard Stats ────────────────────────────────────────────────
// GET /api/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalHospitals,
    emergencyHospitals,
    availableDoctors,
    activeRequests,
  ] = await Promise.all([
    Hospital.countDocuments(),
    Hospital.countDocuments({ emergencyAvailable: true }),
    Doctor.countDocuments({ availabilityStatus: 'available' }),
    EmergencyRequest.countDocuments({ status: { $in: [REQUEST_STATUS.PENDING, REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.IN_PROGRESS] } }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Dashboard stats fetched.',
    data: { totalHospitals, emergencyHospitals, availableDoctors, activeRequests },
  });
});

// ─── City Overview (Group by City) ───────────────────────────────────────────
// GET /api/dashboard/city-overview
const getCityOverview = asyncHandler(async (req, res) => {
  const cityStats = await Hospital.aggregate([
    {
      $group: {
        _id: '$city',
        totalHospitals: { $sum: 1 },
        emergencyAvailable: { $sum: { $cond: ['$emergencyAvailable', 1, 0] } },
        totalERBeds: { $sum: '$erBeds' },
        totalICUBeds: { $sum: '$icuBeds' },
      },
    },
    { $sort: { totalHospitals: -1 } },
  ]);

  res.status(200).json({ success: true, message: 'City overview fetched.', data: cityStats });
});

// ─── Live System Status ───────────────────────────────────────────────────────
// GET /api/dashboard/live-status
const getLiveStatus = asyncHandler(async (req, res) => {
  const [pendingRequests, hospitalsWithER, hospitalsWithICU, ambulanceReady] = await Promise.all([
    EmergencyRequest.countDocuments({ status: REQUEST_STATUS.PENDING }),
    Hospital.countDocuments({ emergencyAvailable: true, erBeds: { $gt: 0 } }),
    Hospital.countDocuments({ icuBeds: { $gt: 0 } }),
    Hospital.countDocuments({ ambulanceAvailable: true }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Live system status.',
    data: {
      pendingEmergencies: pendingRequests,
      hospitalsWithOpenER: hospitalsWithER,
      hospitalsWithOpenICU: hospitalsWithICU,
      ambulanceAvailableAt: ambulanceReady,
      systemStatus: pendingRequests > 10 ? 'HIGH_LOAD' : 'OPERATIONAL',
    },
  });
});

module.exports = { getStats: getDashboardStats, getCityOverview, getLiveStatus };
