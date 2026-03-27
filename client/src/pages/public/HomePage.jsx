import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/appConstants';
import { getAllHospitals } from '../../services/hospitalService';
import { getAvailableDoctors } from '../../services/doctorService';
import HospitalCard from '../../components/HospitalCard';
import DoctorCard from '../../components/DoctorCard';

// Feature card
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-start">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
    <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
  </div>
);

const HomePage = () => {
  const [featuredHospitals, setFeaturedHospitals] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    getAllHospitals({ emergency: 'true' })
      .then((res) => setFeaturedHospitals((res.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingHospitals(false));

    getAvailableDoctors()
      .then((res) => setAvailableDoctors((res.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingDoctors(false));
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-emergency-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emergency-50 text-emergency-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-emergency-200 mb-5">
            🚨 Real-time Emergency Healthcare Platform
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-neutral-900 leading-tight tracking-tight">
            Healthcare, when every <br />
            <span className="text-emergency-500">second matters.</span>
          </h1>
          <p className="mt-6 text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Find available ER beds, check doctors on duty, and send emergency requests to the nearest hospitals — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to={ROUTES.EMERGENCY_MAP}
              className="bg-emergency-500 hover:bg-emergency-600 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-sm transition"
            >
              🚑 Emergency Map
            </Link>
            <Link
              to={ROUTES.HOSPITALS}
              className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 px-8 py-3.5 rounded-xl font-bold text-base shadow-sm transition"
            >
              🏥 Browse Hospitals
            </Link>
            <Link
              to={ROUTES.AI_ASSISTANT}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-sm transition"
            >
              🤖 AI Symptom Check
            </Link>
            <Link
              to={ROUTES.CREATE_REQUEST}
              className="bg-emergency-600 hover:bg-emergency-700 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-sm transition"
            >
              🚨 Request Help Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Feature Strips ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-10">Why Pulse City?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard icon="🏥" title="Live ER Status" desc="Real-time Emergency Room bed availability across all registered hospitals." />
            <FeatureCard icon="🩺" title="Doctor Availability" desc="Check which doctors are on-duty at each hospital right now." />
            <FeatureCard icon="🤖" title="AI Symptom Triage" desc="Get first-level health guidance before visiting a hospital." />
            <FeatureCard icon="🚑" title="Emergency Requests" desc="Submit a direct emergency request to the right hospital instantly." />
          </div>
        </div>
      </section>

      {/* ── Featured Emergency Hospitals ─────────────────────────── */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Emergency Ready Hospitals</h2>
              <p className="text-neutral-500 text-sm mt-1">Hospitals with active Emergency Room capacity</p>
            </div>
            <Link to={ROUTES.HOSPITALS} className="text-sm font-semibold text-primary-600 hover:underline">
              View all →
            </Link>
          </div>

          {loadingHospitals && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-neutral-200 h-52 animate-pulse" />)}
            </div>
          )}

          {!loadingHospitals && featuredHospitals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredHospitals.map((h) => (
                <HospitalCard key={h._id} hospital={h} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Available Doctors Preview ─────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Specialists Available Now</h2>
              <p className="text-neutral-500 text-sm mt-1">Doctors currently on duty across the city</p>
            </div>
            <Link to={ROUTES.DOCTORS} className="text-sm font-semibold text-primary-600 hover:underline">
              View all →
            </Link>
          </div>

          {loadingDoctors && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-neutral-200 h-40 animate-pulse" />)}
            </div>
          )}

          {!loadingDoctors && availableDoctors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableDoctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}

          {!loadingDoctors && availableDoctors.length === 0 && (
            <div className="text-center py-10 border border-neutral-100 rounded-xl bg-neutral-50 text-neutral-500 text-sm">
              No doctors currently listed as available.
            </div>
          )}
        </div>
      </section>

      {/* ── Emergency Banner ──────────────────────────────────────── */}
      <section className="bg-emergency-500 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold">Facing a medical emergency?</h2>
          <p className="mt-2 text-emergency-100 text-sm">
            Don't wait. Use our Emergency Map to find the closest available ER or call emergency services immediately.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to={ROUTES.EMERGENCY_MAP}
              className="bg-white text-emergency-600 hover:bg-emergency-50 px-6 py-3 rounded-xl font-bold text-sm transition"
            >
              Open Emergency Map
            </Link>
            <Link
              to={ROUTES.CREATE_REQUEST}
              className="bg-emergency-800 text-white hover:bg-emergency-900 border border-emergency-700 px-6 py-3 rounded-xl font-bold text-sm transition"
            >
              Request Hospital Help
            </Link>
            <a
              href="tel:108"
              className="border border-emergency-200 text-white hover:bg-emergency-600 px-6 py-3 rounded-xl font-bold text-sm transition"
            >
              Call 108 (Ambulance)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
