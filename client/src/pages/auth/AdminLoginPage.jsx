import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/appConstants';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await adminLogin({ email, password });
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-primary-900 p-8 text-center">
          <div className="text-4xl text-white mb-2">🏥</div>
          <h2 className="text-2xl font-bold text-white">Pulse City</h2>
          <p className="text-primary-200 mt-1 text-sm font-medium">Hospital Admin Portal</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1.5">Admin Email</label>
              <input
                type="email"
                placeholder="hospital@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition"
              />
            </div>

            {error && (
              <div className="bg-emergency-50 border border-emergency-200 text-emergency-700 text-sm p-3 rounded-lg font-medium text-center">
                 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition shadow-sm"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
