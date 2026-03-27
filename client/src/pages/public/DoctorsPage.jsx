import { useState, useEffect } from 'react';
import { getAllDoctors, getAvailableDoctors } from '../../services/doctorService';
import DoctorCard from '../../components/DoctorCard';

const SPECIALTIES = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Emergency Medicine', 'General Surgery', 'Dermatology'];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        let data = [];
        if (availableOnly) {
          const res = await getAvailableDoctors();
          data = res.data || [];
        } else {
          const res = await getAllDoctors();
          data = res.data || [];
        }

        if (specialtyFilter) {
          data = data.filter((d) => d.specialization?.toLowerCase() === specialtyFilter.toLowerCase());
        }

        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialtyFilter, availableOnly]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-neutral-900">Find Specialists</h1>
          <p className="mt-1 text-neutral-500">Discover doctors and check their real-time availability</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-800">Filters</h2>
                {(specialtyFilter || availableOnly) && (
                  <button onClick={() => { setSpecialtyFilter(''); setAvailableOnly(false); }} className="text-xs text-primary-600 hover:underline">Clear all</button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Specialty</label>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="w-full text-sm border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Specialties</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-4 h-4 accent-green-600 border-neutral-300 rounded"
                  />
                  <span className="text-xs font-medium text-neutral-700">Available Now</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-neutral-500">
                {loading ? 'Loading...' : `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-neutral-200 h-40 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-16">
                <p className="text-emergency-500 font-medium">{error}</p>
              </div>
            )}

            {!loading && !error && doctors.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
                <div className="text-5xl mb-4">🩺</div>
                <h3 className="text-lg font-semibold text-neutral-700">No doctors found</h3>
                <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters.</p>
              </div>
            )}

            {!loading && !error && doctors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {doctors.map((doc) => (
                  <DoctorCard key={doc._id} doctor={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
