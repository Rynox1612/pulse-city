const express = require('express');
const router = express.Router();
const { register, login, adminLogin, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register — New user registration (public)
router.post('/register', register);

// POST /api/auth/login — User login (public)
router.post('/login', login);

// POST /api/auth/admin/login — Hospital admin login (public)
router.post('/admin/login', adminLogin);

// POST /api/auth/logout — Clear session token (protected so we know who is logging out)
router.post('/logout', protect, logout);

// GET /api/auth/me — Get currently authenticated user profile
router.get('/me', protect, getMe);

module.exports = router;
