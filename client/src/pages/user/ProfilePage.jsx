import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../services/userService';
import { PageHeader } from '../../components/SharedComponents';

const ProfilePage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', age: '', gender: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const { name = '', email = '', phone = '', age = '', gender = '' } = res.data;
        setForm({ name, email, phone, age: age || '', gender: gender || '' });
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-neutral-50";

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your personal account information." />

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-2xl">
        {success && <div className="mb-5 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{success}</div>}
        {error && <div className="mb-5 p-3 bg-emergency-50 text-emergency-600 text-sm rounded-lg border border-emergency-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} disabled className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} min="1" max="120" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
