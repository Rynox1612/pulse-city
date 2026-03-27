import { useState, useEffect } from 'react';
import { getAdminHospital, updateAvailability } from '../../services/adminService';
import { PageHeader } from '../../components/SharedComponents';

const UpdateAvailabilityPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hospitalId, setHospitalId] = useState(null);

  const [form, setForm] = useState({
    emergencyAvailable: false,
    ambulanceAvailable: false,
    erBeds: 0,
    icuBeds: 0,
    generalBeds: 0,
    ventilators: 0,
  });

  useEffect(() => {
    getAdminHospital()
      .then((res) => {
        const h = res.data;
        setHospitalId(h._id);
        setForm({
          emergencyAvailable: h.emergencyAvailable || false,
          ambulanceAvailable: h.ambulanceAvailable || false,
          erBeds: h.erBeds || 0,
          icuBeds: h.icuBeds || 0,
          generalBeds: h.generalBeds || 0,
          ventilators: h.ventilators || 0,
        });
      })
      .catch(() => setError('Failed to load hospital resource data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await updateAvailability(hospitalId, form);
      setSuccess('Resource availability updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update availability. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <PageHeader
        title="Update Resource Availability"
        description="Keep your real-time bed and emergency capacity accurate to guide patients correctly."
      />

      <div className="max-w-3xl bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mt-6">
        {error && <div className="mb-6 p-4 bg-emergency-50 text-emergency-700 text-sm font-medium border border-emergency-200 rounded-lg">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-medium border border-green-200 rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Toggles */}
          <div className="space-y-4 border-b border-neutral-100 pb-8">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Emergency Status</h3>
            
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition">
              <input
                type="checkbox"
                name="emergencyAvailable"
                checked={form.emergencyAvailable}
                onChange={handleChange}
                className="w-5 h-5 accent-emergency-600 rounded bg-neutral-100 border-neutral-300 focus:ring-emergency-500"
              />
              <div>
                <span className="block font-bold text-neutral-900">Emergency Room (ER) Open</span>
                <span className="block text-xs text-neutral-500 mt-0.5">Toggle this off if ER is temporarily closed or under deep maintenance.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition">
              <input
                type="checkbox"
                name="ambulanceAvailable"
                checked={form.ambulanceAvailable}
                onChange={handleChange}
                className="w-5 h-5 accent-primary-600 rounded bg-neutral-100 border-neutral-300 focus:ring-primary-500"
              />
              <div>
                <span className="block font-bold text-neutral-900">Hospital Ambulance Available</span>
                <span className="block text-xs text-neutral-500 mt-0.5">Check if ambulance dispatch is currently operational for pickup.</span>
              </div>
            </label>
          </div>

          {/* Counters */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Current Bed & Resource Count</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {[
                  { label: "Available ER Beds", name: "erBeds", icon: "🏥" },
                  { label: "Available ICU Beds", name: "icuBeds", icon: "🫀" },
                  { label: "Available General Beds", name: "generalBeds", icon: "🛏️" },
                  { label: "Available Ventilators", name: "ventilators", icon: "💨" },
                ].map(field => (
                  <div key={field.name}>
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-700 mb-2">
                      <span>{field.icon}</span> {field.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 focus:bg-white text-lg font-semibold transition"
                    />
                  </div>
                ))}
             </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-neutral-100">
            <button
              type="submit"
              disabled={submitting || !hospitalId}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition"
            >
              {submitting ? 'Saving...' : 'Save Availability Data'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateAvailabilityPage;
