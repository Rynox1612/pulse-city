import env from './env';

// Global application name pulled cleanly from central config logic
export const APP_NAME = env.APP_NAME;

export const ROLES = {
  USER: 'user',
  ADMIN: 'hospital_admin',
};

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  HOSPITALS: '/hospitals',
  DOCTORS: '/doctors',
  EMERGENCY_MAP: '/map',
  AI_ASSISTANT: '/assistant',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin/login',
  // User Routes
  PROFILE: '/user/profile',
  MEDICAL_INFO: '/user/medical-info',
  SAVED_HOSPITALS: '/user/saved-hospitals',
  EMERGENCY_REQUESTS: '/user/requests',
  CREATE_REQUEST: '/user/create-request',
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  HOSPITAL_PROFILE: '/admin/profile',
  MANAGE_DOCTORS: '/admin/doctors',
  UPDATE_AVAILABILITY: '/admin/availability',
  INCOMING_REQUESTS: '/admin/requests',
};
