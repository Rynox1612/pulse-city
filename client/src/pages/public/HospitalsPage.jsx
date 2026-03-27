import { useState, useEffect, useCallback } from 'react';
import { getAllHospitals, searchHospitals } from '../../services/hospitalService';
import { getSavedHospitals } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/SharedComponents';
import HospitalCard from '../../components/HospitalCard';
import { ROUTES } from '../../config/appConstants';
import { Link } from 'react-router-dom';

// Static filter options — could be fetched dynamically later
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
const SPECIALTIES = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Emergency Medicine', 'General Surgery', 'Dermatology'];

const HospitalsPage = () => {
  const { isAuthenticated } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [is24x7Only, setIs24x7Only] = useState(false);

  // Fetch saved hospital IDs if logged in (for showing heart state)
  useEffect(() => {
    if (!isAuthenticated) return;
    getSavedHospitals()
      .then((res) => setSavedIds(new Set((res.data || []).map((h) => h._id))))
      .catch(() => {});
  }, [isAuthenticated]);

  // Main fetch — rebuilds whenever filters change
  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (searchTerm.trim().length > 1) {
        // Use search endpoint for keyword queries
        const res = await searchHospitals(searchTerm.trim());
        data = res.data || [];
      } else {
        // Use filter params on main listing endpoint
        const params = {};
        if (cityFilter) params.city = cityFilter;
        if (specialtyFilter) params.specialty = specialtyFilter;
        if (emergencyOnly) params.emergency = 'true';
        const res = await getAllHospitals(params);
        data = res.data || [];
      }

      // Apply 24x7 filter client-side (no backend param for it yet)
      if (is24x7Only) data = data.filter((h) => h.is24x7);

      setHospitals(data);
    } catch {
      setError('Failed to load hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cityFilter, specialtyFilter, emergencyOnly, is24x7Only]);

  useEffect(() => {
    const timer = setTimeout(fetchHospitals, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchHospitals]);

  const handleSaveToggle = (id, newSaved) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      newSaved ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchTerm(''); setCityFilter(''); setSpecialtyFilter('');
    setEmergencyOnly(false); setIs24x7Only(false);
  };

  const hasActiveFilters = searchTerm || cityFilter || specialtyFilter || emergencyOnly || is24x7Only;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <PageHeader 
              title="Browse Hospitals" 
              description="Find specialized care facilities and view available resources across the city." 
            />
            <Link
              to={ROUTES.EMERGENCY_MAP}
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition shrink-0 whitespace-nowrap"
            >
              📍 View on Map
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-5 relative max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, city, or specialty…"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ── Filters Sidebar ────────────────────────────────────────── */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-800">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Clear all</button>
                )}
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">City</label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full text-sm border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Cities</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Specialty */}
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

              {/* Toggle Filters */}
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="w-4 h-4 accent-emergency-500"
                  />
                  <span className="text-xs font-medium text-neutral-700">Emergency Available</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={is24x7Only}
                    onChange={(e) => setIs24x7Only(e.target.checked)}
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-xs font-medium text-neutral-700">Open 24/7</span>
                </label>
              </div>
            </div>
          </aside>

          {/* ── Hospitals Grid ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-neutral-500">
                {loading ? 'Searching…' : `${hospitals.length} hospital${hospitals.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-neutral-200 h-56 animate-pulse" />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-center py-16">
                <p className="text-emergency-500 font-medium">{error}</p>
                <button onClick={fetchHospitals} className="mt-3 text-sm text-primary-600 hover:underline">Try again</button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && hospitals.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🏥</div>
                <h3 className="text-lg font-semibold text-neutral-700">No hospitals found</h3>
                <p className="text-sm text-neutral-500 mt-1">Try adjusting your search or filters.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-4 text-sm text-primary-600 hover:underline">Clear filters</button>
                )}
              </div>
            )}

            {/* Hospital Grid */}
            {!loading && !error && hospitals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {hospitals.map((h) => (
                  <HospitalCard
                    key={h._id}
                    hospital={h}
                    isSaved={savedIds.has(h._id)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalsPage;
