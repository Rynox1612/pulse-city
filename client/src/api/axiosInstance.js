import axios from 'axios';
import env from '../config/env';

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Send httpOnly cookies automatically
});

/**
 * Request Interceptor — attaches JWT token from localStorage to every request.
 * The server reads from either the Authorization header OR the httpOnly cookie.
 * Using both ensures compatibility in all scenarios.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor — on 401, clear stale tokens and redirect to login.
 * This prevents the app from silently staying in a broken authenticated state.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pulse_token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
