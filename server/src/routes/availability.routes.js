const express = require('express');
const router = express.Router();
const {
  getAllAvailability, getAvailabilityByHospital, updateAvailability,
  getERAvailable, getICUAvailable, getAmbulanceAvailable
} = require('../controllers/availability.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ── Specific named routes FIRST (before /:hospitalId) ────────────────────────

// GET /api/availability/er/available — public
router.get('/er/available', getERAvailable);

// GET /api/availability/icu/available — public
router.get('/icu/available', getICUAvailable);

// GET /api/availability/ambulance/available — public
router.get('/ambulance/available', getAmbulanceAvailable);

// ── General routes ────────────────────────────────────────────────────────────

// GET /api/availability — public snapshot of all hospitals
router.get('/', getAllAvailability);

// GET /api/availability/:hospitalId — public
// PUT /api/availability/:hospitalId — admin only
router.get('/:hospitalId', getAvailabilityByHospital);
router.put('/:hospitalId', protect, authorizeRoles('hospital_admin'), updateAvailability);

module.exports = router;
