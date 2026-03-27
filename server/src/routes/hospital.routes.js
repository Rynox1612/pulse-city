const express = require('express');
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  searchHospitals,
  getNearbyHospitals,
  getHospitalsBySpeciality,
  getHospitalsByCity
} = require('../controllers/hospital.controller');

// IMPORTANT: Specific named routes must be declared BEFORE /:id
// to prevent Express from matching them as an ID parameter.

// GET /api/hospitals/search — Full-text search with query params
router.get('/search', searchHospitals);

// GET /api/hospitals/nearby — Filter by lat/lng proximity
router.get('/nearby', getNearbyHospitals);

// GET /api/hospitals/speciality/:speciality — Filter by medical specialty
router.get('/speciality/:speciality', getHospitalsBySpeciality);

// GET /api/hospitals/city/:city — Filter by city name
router.get('/city/:city', getHospitalsByCity);

// GET /api/hospitals — List all hospitals (supports ?city=, ?specialty= query)
router.get('/', getAllHospitals);

// GET /api/hospitals/:id — Single hospital details
router.get('/:id', getHospitalById);

module.exports = router;
