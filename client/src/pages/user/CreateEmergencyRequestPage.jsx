import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllHospitals } from '../../services/hospitalService';
import { createEmergencyRequest } from '../../services/emergencyService';
import { ROUTES } from '../../config/appConstants';
import { PageHeader } from '../../components/SharedComponents';

const SEVERITIES = ['low', 'medium', 'high', 'critical'];

const CreateEmergencyRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedHospital = searchParams.get('hospitalId') || '';

  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    hospitalId: preselectedHospital,
    symptoms: '',
    severity: 'high',
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch if not firmly locked to one — although here we'll just fetch all so user can choose
    setLoading(true);
    getAllHospitals()
      .then(res => setHospitals(res.data || []))
      .catch(() => setError('Failed to load hospitals.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Split symptoms by comma and trim
    const symptomArray = form.symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    if (symptomArray.length === 0) {
      setError('Please provide at least one symptom.');
      setSubmitting(false);
      return;
    }

    try {
      await createEmergencyRequest({
        hospitalId: form.hospitalId,
        symptoms: symptomArray,
        severity: form.severity,
      });
      // Redirect to history on success
      navigate(ROUTES.EMERGENCY_REQUESTS);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request.');
      setSubmitting(false);
    }
  };

  const inputClass = "w-full p-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emergency-500 bg-white transition";

  return (
    <div>
      <PageHeader
        title="Request Emergency Help"
        description="Submit an urgent request to a hospital. For life-threatening situations, call 108 immediately."
      />

      <div className="max-w-2xl bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        {error && <div className="mb-6 p-4 bg-emergency-50 text-emergency-700 text-sm font-medium border border-emergency-200 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Hospital Selection */}
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">Select Target Hospital *</label>
            {loading ? (
              <div className="h-12 bg-neutral-100 animate-pulse rounded-lg border border-neutral-200" />
            ) : (
              <select
                name="hospitalId"
                value={form.hospitalId}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">-- Choose a Hospital --</option>
                {hospitals.map(h => (
                  <option key={h._id} value={h._id}>
                    {h.name} - {h.city} {h.emergencyAvailable ? '(🚨 ER Ready)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">Urgency Level *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SEVERITIES.map(sev => (
                <label
                  key={sev}
                  className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition ${
                    form.severity === sev
                      ? sev === 'critical' ? 'bg-emergency-50 border-emergency-500 text-emergency-700'
                        : sev === 'high' ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : sev === 'medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                        : 'bg-green-50 border-green-500 text-green-700'
                      : 'border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={sev}
                    checked={form.severity === sev}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold capitalize">{sev}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-2">Symptoms *</label>
            <textarea
              name="symptoms"
              value={form.symptoms}
              onChange={handleChange}
              required
              rows={3}
              placeholder="e.g. Chest pain, high fever, difficulty breathing (comma separated)"
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1.5 text-xs text-neutral-500">Provide comma-separated symptoms so the emergency room can prepare.</p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 text-sm font-bold text-neutral-500 hover:bg-neutral-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading || !form.hospitalId || !form.symptoms}
              className="bg-emergency-600 hover:bg-emergency-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition shadow-sm"
            >
              {submitting ? 'Submitting...' : '🚨 Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmergencyRequestPage;
