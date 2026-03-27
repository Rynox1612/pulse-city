import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/appConstants';

/**
 * ProtectedRoute — renders child routes only if authenticated.
 * If the session is still loading (app just started), shows a spinner.
 * If not authenticated, redirects to /login preserving the original URL.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

/**
 * AdminRoute — renders child routes only if the user is a hospital_admin.
 * Non-admin authenticated users get redirected to their user profile.
 */
export const AdminRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  if (user?.role !== 'hospital_admin') return <Navigate to={ROUTES.PROFILE} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
