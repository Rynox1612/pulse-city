import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/appConstants';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? 'bg-primary-600 text-white font-semibold shadow-sm'
        : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-sm">{label}</span>
  </Link>
);

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-neutral-800">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-center flex-col gap-2">
           <div className="w-12 h-12 bg-primary-600 rounded-xl flex shadow-sm items-center justify-center text-2xl">
              🏥
           </div>
           <p className="font-bold tracking-wide mt-1">Provider Admin</p>
           <p className="text-xs text-neutral-500 font-medium px-2 text-center line-clamp-1">
             {user?.hospital?.name || 'Loading...'}
           </p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          <NavItem 
            to={ROUTES.ADMIN_DASHBOARD} 
            icon="📊" 
            label="Dashboard Overview" 
            isActive={location.pathname === ROUTES.ADMIN_DASHBOARD} 
          />
          <NavItem 
            to={ROUTES.INCOMING_REQUESTS} 
            icon="🚨" 
            label="Live Requests" 
            isActive={location.pathname === ROUTES.INCOMING_REQUESTS} 
          />
          <NavItem 
            to={ROUTES.UPDATE_AVAILABILITY} 
            icon="🛏️" 
            label="Update Capacity" 
            isActive={location.pathname === ROUTES.UPDATE_AVAILABILITY} 
          />
          <NavItem 
            to={ROUTES.MANAGE_DOCTORS} 
            icon="👨‍⚕️" 
            label="Manage Doctors" 
            isActive={location.pathname === ROUTES.MANAGE_DOCTORS} 
          />
          <NavItem 
            to={ROUTES.HOSPITAL_PROFILE} 
            icon="⚙️" 
            label="Hospital Profile" 
            isActive={location.pathname === ROUTES.HOSPITAL_PROFILE} 
          />
        </nav>
        
        <div className="p-4 border-t border-neutral-800">
           <button 
             onClick={handleLogout}
             className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-emergency-900/50 hover:text-emergency-500 transition"
           >
             <span className="text-xl">🚪</span>
             <span className="text-sm font-semibold">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-neutral-50">
        {/* Mobile Navbar */}
        <header className="md:hidden bg-neutral-900 text-white flex items-center justify-between px-4 py-3 shrink-0">
           <div className="flex items-center gap-2">
             <span className="text-xl">🏥</span>
             <span className="font-bold text-sm">Provider Panel</span>
           </div>
           <button onClick={handleLogout} className="text-xs font-semibold bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
             Logout
           </button>
        </header>

        {/* Content Outlet */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
