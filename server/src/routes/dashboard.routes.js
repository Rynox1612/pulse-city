const express = require('express');
const router = express.Router();
const { getStats, getCityOverview, getLiveStatus } = require('../controllers/dashboard.controller');

// GET /api/dashboard/stats — Total hospital count, active ER hospitals, doctors available, request count
router.get('/stats', getStats);

// GET /api/dashboard/city-overview — City-level summary breakdown
router.get('/city-overview', getCityOverview);

// GET /api/dashboard/live-status — Live emergency system status snapshot
router.get('/live-status', getLiveStatus);

module.exports = router;
