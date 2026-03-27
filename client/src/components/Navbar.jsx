import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES, APP_NAME } from '../config/appConstants';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const navLink = "text-neutral-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="text-xl font-bold text-primary-600 tracking-tight">
            🏥 {APP_NAME}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to={ROUTES.HOME} className={navLink}>Home</Link>
            <Link to={ROUTES.HOSPITALS} className={navLink}>Hospitals</Link>
            <Link to={ROUTES.DOCTORS} className={navLink}>Doctors</Link>
            <Link to={ROUTES.EMERGENCY_MAP} className={navLink}>Map</Link>
            <Link to={ROUTES.AI_ASSISTANT} className={navLink}>AI Assistant</Link>

            {isAuthenticated ? (
              <>
                <Link to={ROUTES.PROFILE} className={navLink}>
                  Hi, {user?.name?.split(' ')[0] || 'User'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-600 hover:text-emergency-500 px-3 py-2 text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className={navLink}>Login</Link>
                <Link to={ROUTES.REGISTER} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Emergency CTA (always visible) */}
          <div className="hidden md:flex ml-4">
            <Link
              to={ROUTES.EMERGENCY_MAP}
              className="bg-emergency-500 hover:bg-emergency-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
            >
              🚨 Emergency
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-3 space-y-1">
          <Link to={ROUTES.HOME} className="block py-2 text-sm text-neutral-700" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to={ROUTES.HOSPITALS} className="block py-2 text-sm text-neutral-700" onClick={() => setMenuOpen(false)}>Hospitals</Link>
          <Link to={ROUTES.DOCTORS} className="block py-2 text-sm text-neutral-700" onClick={() => setMenuOpen(false)}>Doctors</Link>
          <Link to={ROUTES.EMERGENCY_MAP} className="block py-2 text-sm text-neutral-700" onClick={() => setMenuOpen(false)}>Emergency Map</Link>
          <Link to={ROUTES.AI_ASSISTANT} className="block py-2 text-sm text-neutral-700" onClick={() => setMenuOpen(false)}>AI Assistant</Link>
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.PROFILE} className="block py-2 text-sm text-primary-600 font-medium" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-emergency-500 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="block py-2 text-sm text-neutral-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to={ROUTES.REGISTER} className="block py-2 text-sm font-medium text-primary-600" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
