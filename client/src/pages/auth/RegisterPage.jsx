import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, APP_NAME } from '../../config/appConstants';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', age: '', gender: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate(ROUTES.PROFILE);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Create your account</h1>
          <p className="mt-2 text-neutral-500">Join {APP_NAME} for fast emergency healthcare access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {error && (
            <div className="mb-5 p-4 bg-emergency-50 border border-emergency-200 rounded-lg text-sm text-emergency-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-name">Full Name *</label>
                <input id="reg-name" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Jayesh Kumar" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-phone">Phone</label>
                <input id="reg-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9999999999" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-email">Email Address *</label>
              <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-age">Age</label>
                <input id="reg-age" type="number" name="age" value={form.age} onChange={handleChange} placeholder="25" min="1" max="120" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-gender">Gender</label>
                <select id="reg-gender" name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-password">Password *</label>
                <input id="reg-password" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min. 8 characters" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reg-confirm">Confirm Password *</label>
                <input id="reg-confirm" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat password" className={inputClass} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
