import { useState, useEffect } from 'react';
import { getAdminHospital, updateAdminHospital } from '../../services/adminService';
import { PageHeader } from '../../components/SharedComponents';

const SPECIALTY_OPTIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 
  'Emergency Medicine', 'General Surgery', 'Dermatology', 'Obstetrics'
];

const HospitalProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    contactNumber: '',
    hospitalType: 'private',
    is24x7: false,
    specialties: [],
  });

  useEffect(() => {
    getAdminHospital()
      .then((res) => setForm(res.data))
      .catch(() => setError('Failed to load profile data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSpecialtyToggle = (spec) => {
    setForm((prev) => {
      const exists = prev.specialties.includes(spec);
      return {
        ...prev,
        specialties: exists ? prev.specialties.filter(s => s !== spec) : [...prev.specialties, spec],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await updateAdminHospital(form);
      setSuccess('Hospital profile successfully updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update hospital profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full p-3 border border-neutral-300 rounded-xl text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition";

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <PageHeader 
        title="Hospital Profile Settings" 
        description="Manage the core information visible to patients when they browse Pulse City." 
      />

      <div className="max-w-3xl bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mt-6">
        {error && <div className="mb-6 p-4 bg-emergency-50 text-emergency-700 text-sm font-medium border border-emergency-200 rounded-lg">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-medium border border-green-200 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-neutral-800 mb-1.5">Hospital Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-neutral-800 mb-1.5">Address Line *</label>
              <input name="address" value={form.address} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-1.5">City *</label>
              <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-1.5">Contact Number *</label>
              <input name="contactNumber" value={form.contactNumber} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-1.5">Hospital Type *</label>
              <select name="hospitalType" value={form.hospitalType} onChange={handleChange} className={inputClass}>
                <option value="private">Private Hospital</option>
                <option value="government">Government Hospital</option>
                <option value="clinic">Clinic / Outpatient</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer p-3 w-full border border-neutral-200 rounded-xl hover:bg-neutral-50 transition">
                <input
                  type="checkbox"
                  name="is24x7"
                  checked={form.is24x7}
                  onChange={handleChange}
                  className="w-5 h-5 accent-green-600 rounded"
                />
                <span className="font-bold text-sm text-neutral-900">Operates 24/7</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
             <label className="block text-sm font-bold text-neutral-800 mb-3">Available Departments / Specialties</label>
             <div className="flex flex-wrap gap-2">
                {SPECIALTY_OPTIONS.map((spec) => {
                  const isActive = form.specialties.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecialtyToggle(spec)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition font-medium border ${
                        isActive 
                        ? 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100' 
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {isActive ? '✓ ' : '+ '}{spec}
                    </button>
                  );
                })}
             </div>
          </div>
          
          <div className="pt-6 border-t border-neutral-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition"
            >
              {submitting ? 'Saving changes...' : 'Save Profile Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalProfilePage;
