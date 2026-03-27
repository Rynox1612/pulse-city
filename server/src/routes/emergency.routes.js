const express = require('express');
const router = express.Router();
const {
  createRequest, getMyRequests, getRequestById,
  updateRequestStatus, getRequestsByHospital, cancelRequest
} = require('../controllers/emergency.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// POST /api/emergency/request — user must be logged in
router.post('/request', protect, createRequest);

// GET /api/emergency/my-requests — logged-in user's own requests
router.get('/my-requests', protect, getMyRequests);

// GET /api/emergency/hospital/:hospitalId — admin only view
router.get('/hospital/:hospitalId', protect, authorizeRoles('hospital_admin'), getRequestsByHospital);

// GET /api/emergency/:id — any authenticated user (user sees their own, admin sees any)
router.get('/:id', protect, getRequestById);

// PUT /api/emergency/:id/status — only hospital admin can change status
router.put('/:id/status', protect, authorizeRoles('hospital_admin'), updateRequestStatus);

// DELETE /api/emergency/:id/cancel — user cancels their own pending request
router.delete('/:id/cancel', protect, cancelRequest);

module.exports = router;
