const express = require('express');
const router = express.Router();
const {
  getAllDoctors, getDoctorById, getDoctorsByHospital,
  getDoctorsBySpecialization, getAvailableDoctors,
  createDoctor, updateDoctor, deleteDoctor
} = require('../controllers/doctor.controller');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ── Public read routes (no auth required) ────────────────────────────────────
router.get('/available', getAvailableDoctors);
router.get('/hospital/:hospitalId', getDoctorsByHospital);
router.get('/specialization/:specialization', getDoctorsBySpecialization);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// ── Admin-only write routes ───────────────────────────────────────────────────
// POST /api/doctors — Add a new doctor
router.post('/', protect, authorizeRoles('hospital_admin'), createDoctor);

// PUT    /api/doctors/:id — Update doctor
// DELETE /api/doctors/:id — Remove doctor
router.put('/:id', protect, authorizeRoles('hospital_admin'), updateDoctor);
router.delete('/:id', protect, authorizeRoles('hospital_admin'), deleteDoctor);

module.exports = router;
