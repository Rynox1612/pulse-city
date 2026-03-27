const EmergencyRequest = require('../models/EmergencyRequest');
const Hospital = require('../models/Hospital');
const asyncHandler = require('../utils/asyncHandler');
const { REQUEST_STATUS, SEVERITY_LEVELS } = require('../config/appConstants');

// ─── Create Emergency Request ─────────────────────────────────────────────────
// POST /api/emergency/request
const createRequest = asyncHandler(async (req, res) => {
  const { hospitalId, symptoms, severity, liveLocation } = req.body;
  const userId = req.user.id;

  if (!hospitalId || !symptoms) {
    return res.status(400).json({ success: false, message: 'Hospital and symptoms are required.', data: {} });
  }

  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found.', data: {} });

  const request = await EmergencyRequest.create({
    userId,
    hospitalId,
    symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
    severity: severity || SEVERITY_LEVELS.MEDIUM,
    status: REQUEST_STATUS.PENDING,
    liveLocation: liveLocation || {},
  });

  res.status(201).json({ success: true, message: 'Emergency request submitted.', data: request });
});

// ─── Get My Requests ──────────────────────────────────────────────────────────
// GET /api/emergency/my-requests
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await EmergencyRequest.find({ userId: req.user.id })
    .populate('hospitalId', 'name city contactNumber')
    .sort({ requestedAt: -1 });
  res.status(200).json({ success: true, message: 'Your emergency requests.', data: requests });
});

// ─── Get Request By ID ────────────────────────────────────────────────────────
// GET /api/emergency/:id
const getRequestById = asyncHandler(async (req, res) => {
  const request = await EmergencyRequest.findById(req.params.id)
    .populate('userId', 'name email phone bloodGroup')
    .populate('hospitalId', 'name city contactNumber');
  if (!request) return res.status(404).json({ success: false, message: 'Emergency request not found.', data: {} });
  res.status(200).json({ success: true, message: 'Emergency request details.', data: request });
});

// ─── Update Request Status (Admin) ────────────────────────────────────────────
// PUT /api/emergency/:id/status
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Object.values(REQUEST_STATUS).includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Valid: ${Object.values(REQUEST_STATUS).join(', ')}`, data: {} });
  }

  const request = await EmergencyRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!request) return res.status(404).json({ success: false, message: 'Request not found.', data: {} });
  res.status(200).json({ success: true, message: `Request status updated to "${status}".`, data: request });
});

// ─── Get Hospital's Requests (Admin) ─────────────────────────────────────────
// GET /api/emergency/hospital/:hospitalId
const getRequestsByHospital = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { hospitalId: req.params.hospitalId };
  if (status) filter.status = status;

  const requests = await EmergencyRequest.find(filter)
    .populate('userId', 'name email phone bloodGroup emergencyContact')
    .sort({ requestedAt: -1 });
  res.status(200).json({ success: true, message: 'Hospital emergency requests.', data: requests });
});

// ─── Cancel Request ───────────────────────────────────────────────────────────
// DELETE /api/emergency/:id/cancel
const cancelRequest = asyncHandler(async (req, res) => {
  const request = await EmergencyRequest.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id, status: REQUEST_STATUS.PENDING },
    { status: REQUEST_STATUS.REJECTED },
    { new: true }
  );
  if (!request) return res.status(404).json({ success: false, message: 'Request not found or cannot be cancelled.', data: {} });
  res.status(200).json({ success: true, message: 'Emergency request cancelled.', data: request });
});

module.exports = { createRequest, getMyRequests, getRequestById, updateRequestStatus, getRequestsByHospital, cancelRequest };
