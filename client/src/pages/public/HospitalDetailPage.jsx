import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHospitalById } from '../../services/hospitalService';
import { getDoctorsByHospital } from '../../services/doctorService';
import { getSavedHospitals, saveHospital, removeSavedHospital } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/appConstants';
import DoctorCard from '../../components/DoctorCard';

// Small stat box for bed/resource display
const StatBox = ({ label, value, color = 'blue', icon }) => (
  <div className={`bg-white rounded-xl border p-4 text-center ${color === 'red' ? 'border-emergency-100' : 'border-primary-100'}`}>
    <div className="text-2xl mb-1">{icon}</div>
    <div className={`text-2xl font-bold ${color === 'red' ? 'text-emergency-600' : 'text-primary-600'}`}>
      {value ?? '—'}
    </div>
    <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
  </div>
);

const HospitalDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hospRes, docRes] = await Promise.all([
          getHospitalById(id),
          getDoctorsByHospital(id).catch(() => ({ data: [] }))
        ]);
        setHospital(hospRes.data);
        setDoctors(docRes.data || []);
      } catch {
        setError('Hospital not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // Check if already saved
  useEffect(() => {
    if (!isAuthenticated) return;
    getSavedHospitals()
      .then((res) => {
        const ids = (res.data || []).map((h) => h._id);
        setIsSaved(ids.includes(id));
      })
      .catch(() => {});
  }, [isAuthenticated, id]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = ROUTES.LOGIN;
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await removeSavedHospital(id);
        setIsSaved(false);
      } else {
        await saveHospital(id);
        setIsSaved(true);
      }
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-64" />
          <div className="h-4 bg-neutral-100 rounded w-40" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-neutral-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🏥</div>
        <p className="text-emergency-500 font-medium">{error}</p>
        <Link to={ROUTES.HOSPITALS} className="mt-4 inline-block text-primary-600 hover:underline text-sm">← Back to hospitals</Link>
      </div>
    );
  }

  const {
    name, city, address, specialties = [], emergencyAvailable, icuBeds, erBeds,
    generalBeds, ventilators, ambulanceAvailable, contactNumber, hospitalType, is24x7,
  } = hospital;

  // Calculate Emergency Readiness Indicator
  let readinessLabel = 'Low Capacity';
  let readinessColor = 'bg-neutral-100 text-neutral-600 border-neutral-200';
  let readinessIcon = '⚠';

  if (emergencyAvailable && erBeds > 0) {
    readinessLabel = 'Emergency Ready';
    readinessColor = 'bg-emergency-50 text-emergency-700 border-emergency-200';
    readinessIcon = '🚨';
  } else if (emergencyAvailable && erBeds === 0) {
    readinessLabel = 'Limited Capacity (ER Full)';
    readinessColor = 'bg-warning-50 text-warning-700 border-warning-200'; // assume warning is defined in tailwind, else orange
    readinessIcon = '⏳';
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Banner */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link to={ROUTES.HOSPITALS} className="text-sm text-neutral-400 hover:text-neutral-600 mb-4 inline-block">
            ← All Hospitals
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-neutral-900">{name}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${readinessColor} shadow-sm inline-flex items-center gap-1.5`}>
                  {readinessIcon} {readinessLabel}
                </span>
              </div>
              <p className="text-neutral-500">📍 {address}, {city}</p>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {is24x7 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    ⏰ Open 24/7
                  </span>
                )}
                {ambulanceAvailable && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    🚑 Ambulance Available
                  </span>
                )}
                {hospitalType && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 capitalize">
                    {hospitalType.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>

            {/* Save + Contact */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={handleSaveToggle}
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  isSaved
                    ? 'bg-emergency-50 text-emergency-600 border-emergency-200 hover:bg-emergency-100'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-primary-400 hover:text-primary-600'
                }`}
              >
                {saving ? '…' : isSaved ? '❤️ Saved' : '🤍 Save Hospital'}
              </button>
              {contactNumber && (
                <a
                  href={`tel:${contactNumber}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white text-center transition"
                >
                  📞 {contactNumber}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Resource Stats Grid */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-neutral-800">Resource Availability</h2>
             <span className="text-xs text-neutral-400 sm:ml-auto">Live Status</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-neutral-700 text-sm leading-relaxed">{hospital.address}, {hospital.city}</p>
              </div>
              {hospital.coordinates?.lat && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition flex-shrink-0"
                >
                  📍 Get Directions
                </a>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox icon="🏥" label="ER Beds" value={erBeds} color="red" />
              <StatBox icon="🫀" label="ICU Beds" value={icuBeds} />
              <StatBox icon="🛏️" label="General Beds" value={generalBeds} />
              <StatBox icon="💨" label="Ventilators" value={ventilators} />
            </div>
          </div>
        </section>

        {/* Specialists at this Hospital */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-neutral-800">Doctors on Duty</h2>
             <Link to={ROUTES.DOCTORS} className="text-sm font-medium text-primary-600 hover:underline">View All Doctors</Link>
          </div>
          {doctors.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-6 rounded-xl text-center">
              <span className="text-3xl text-neutral-300 mb-2 block">🩺</span>
              <p className="text-sm text-neutral-500">No doctors are listed for this hospital right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.slice(0, 4).map((doc) => (
                <DoctorCard key={doc._id} doctor={{...doc, hospitalId: null}} /> // Hide hospital link from within hospital details
              ))}
            </div>
          )}
        </section>

        {/* Specialties */}
        {specialties.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Medical Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-100">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Emergency CTA */}
        <section className="bg-emergency-50 border border-emergency-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-emergency-700 text-lg">Having an emergency?</h3>
            <p className="text-emergency-600 text-sm mt-1">Submit an emergency request directly to this hospital.</p>
          </div>
          <Link
            to={isAuthenticated ? `${ROUTES.CREATE_REQUEST}?hospitalId=${id}` : ROUTES.LOGIN}
            className="bg-emergency-500 hover:bg-emergency-600 text-white font-bold px-6 py-3 rounded-lg text-sm transition flex-shrink-0 text-center"
          >
            🚨 Request Emergency Help
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HospitalDetailPage;
