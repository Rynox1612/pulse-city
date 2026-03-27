import { useState, useEffect } from 'react';
import { getSavedHospitals, removeSavedHospital } from '../../services/userService';
import { PageHeader, StatusBadge } from '../../components/SharedComponents';

const SavedHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSaved = async () => {
    try {
      const res = await getSavedHospitals();
      setHospitals(res.data || []);
    } catch { setError('Failed to load saved hospitals.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleRemove = async (id) => {
    try {
      await removeSavedHospital(id);
      setHospitals((prev) => prev.filter((h) => h._id !== id));
    } catch { alert('Failed to remove hospital.'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div>
      <PageHeader title="Saved Hospitals" description="Your bookmarked hospitals for quick access." />

      {error && <div className="mb-5 p-3 bg-emergency-50 text-emergency-600 text-sm rounded-lg">{error}</div>}

      {hospitals.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <div className="text-5xl mb-4">🏥</div>
          <h3 className="text-lg font-semibold text-neutral-700">No saved hospitals yet</h3>
          <p className="text-sm text-neutral-500 mt-2">Browse hospitals and save ones you trust for quick access during emergencies.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((h) => (
            <div key={h._id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-sm transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-neutral-900">{h.name}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{h.city}</p>
                </div>
                <StatusBadge status={h.emergencyAvailable ? 'ER Open' : 'No ER'} type={h.emergencyAvailable ? 'danger' : 'default'} />
              </div>
              <p className="text-xs text-neutral-500 mt-3">📞 {h.contactNumber || 'N/A'}</p>
              <button
                onClick={() => handleRemove(h._id)}
                className="mt-4 text-xs text-emergency-500 hover:text-emergency-700 font-medium"
              >
                Remove from saved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedHospitalsPage;
