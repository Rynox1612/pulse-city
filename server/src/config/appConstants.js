/**
 * Backend Application Constants
 * Reusable constants representing static labels, roles, and status enums.
 * NO secrets or environment variables should be stored here.
 */

const ROLES = {
  USER: 'user',
  HOSPITAL_ADMIN: 'hospital_admin',
};

const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

const HOSPITAL_TYPES = {
  GENERAL: 'general',
  SPECIALTY: 'specialty',
  TRAUMA: 'trauma_center',
  CLINIC: 'clinic',
};

module.exports = {
  ROLES,
  SEVERITY_LEVELS,
  REQUEST_STATUS,
  HOSPITAL_TYPES
};
