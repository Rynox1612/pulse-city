import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/authService';
import { adminLoginApi } from '../services/adminService';

// ── Context Creation ─────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Reducer ──────────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: localStorage.getItem('pulse_token') || null,
  isAuthenticated: false,
  loading: true,   // true on first mount while we verify session
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...initialState, loading: false, token: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Restore session on every app load.
   * Calls /api/auth/me using the httpOnly cookie (or stored token).
   */
  const restoreSession = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await getCurrentUser();
      if (res.success) {
        dispatch({ type: 'SET_USER', payload: res.data });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch {
      // No valid session — stay logged out silently
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ── Auth Actions ────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const res = await loginUser(credentials);
    if (res.token) {
      localStorage.setItem('pulse_token', res.token);
      dispatch({ type: 'SET_TOKEN', payload: res.token });
    }
    dispatch({ type: 'SET_USER', payload: res.data });
    return res;
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const res = await registerUser(userData);
    if (res.token) {
      localStorage.setItem('pulse_token', res.token);
      dispatch({ type: 'SET_TOKEN', payload: res.token });
    }
    dispatch({ type: 'SET_USER', payload: res.data });
    return res;
  };

  const adminLogin = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const res = await adminLoginApi(credentials);
    if (res.token) {
      localStorage.setItem('pulse_token', res.token);
      dispatch({ type: 'SET_TOKEN', payload: res.token });
    }
    dispatch({ type: 'SET_USER', payload: res.data });
    return res;
  };

  const logout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    localStorage.removeItem('pulse_token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom Hook ───────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
