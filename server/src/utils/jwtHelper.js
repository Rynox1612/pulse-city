const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * generateToken — signs a JWT with the user's id and role.
 * @param {string} id   - Mongo document _id
 * @param {string} role - 'user' | 'hospital_admin'
 * @returns {string} signed JWT string
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

/**
 * sendTokenCookie — sends a JWT as an httpOnly cookie and returns it
 * in the JSON response for clients that prefer header-based auth.
 */
const sendTokenCookie = (res, token, statusCode, message, data = {}) => {
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };

  res
    .status(statusCode)
    .cookie('pulse_token', token, cookieOptions)
    .json({ success: true, message, token, data });
};

module.exports = { generateToken, sendTokenCookie };
