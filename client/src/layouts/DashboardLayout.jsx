import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/appConstants';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const navItem = "block px-3 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition font-medium";
  const activeClass = "bg-primary-50 text-primary-700";

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-neutral-100 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg mb-2">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <p className="font-semibold text-neutral-900 text-sm truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-neutral-500 truncate">{user?.email || ''}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link to={ROUTES.PROFILE} className={navItem}>👤 Profile</Link>
          <Link to={ROUTES.MEDICAL_INFO} className={navItem}>🩺 Medical Info</Link>
          <Link to={ROUTES.SAVED_HOSPITALS} className={navItem}>🏥 Saved Hospitals</Link>
          <Link to={ROUTES.EMERGENCY_REQUESTS} className={navItem}>🚨 Emergency Requests</Link>
          <Link to={ROUTES.AI_ASSISTANT} className={navItem}>🤖 AI Assistant</Link>
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <Link to={ROUTES.HOME} className="block text-xs text-neutral-400 hover:text-neutral-600 mb-2">← Back to site</Link>
          <button onClick={handleLogout} className="w-full text-left text-xs text-emergency-500 hover:text-emergency-700 font-medium py-1">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
          <span className="font-semibold text-primary-700 text-sm">Dashboard</span>
          <button onClick={handleLogout} className="text-xs text-emergency-500 font-medium">Logout</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
