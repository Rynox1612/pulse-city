import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllHospitals } from '../../services/hospitalService';
import { useLeafletMap, isEmergencyReady } from '../../utils/mapHelper';
import { ROUTES } from '../../config/appConstants';
import HospitalCard from '../../components/HospitalCard';

const DEFAULT_CENTER = [28.6139, 77.2090]; // Default: Delhi (assuming general Indian coordinates for Pulse City context)
const DEFAULT_ZOOM = 11;

const EmergencyMapPage = () => {
  const mapReady = useLeafletMap();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeHospital, setActiveHospital] = useState(null);

  // 1. Fetch Hospitals
  useEffect(() => {
    getAllHospitals()
      .then((res) => {
        const validHospitals = (res.data || []).filter(h => h.coordinates && h.coordinates.lat);
        setHospitals(validHospitals);
      })
      .catch(() => setError('Failed to load map data. Please check connection.'))
      .finally(() => setLoading(false));
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (!mapReady || !mapRef.current || loading || error) return;

    if (!mapInstance.current) {
      const L = window.L;
      // Start map
      mapInstance.current = L.map(mapRef.current).setView(
        hospitals.length > 0 ? [hospitals[0].coordinates.lat, hospitals[0].coordinates.lng] : DEFAULT_CENTER,
        DEFAULT_ZOOM
      );

      // Tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance.current);
    }

    const L = window.L;
    const map = mapInstance.current;

    // Clear old markers if any
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // 3. Render Markers
    hospitals.forEach(h => {
      const isReady = isEmergencyReady(h);
      
      const markerColor = isReady ? '#dc2626' : '#2563eb'; // red-600 vs blue-600
      const fillColor = isReady ? '#fef2f2' : '#eff6ff'; // red-50 vs blue-50

      const marker = L.circleMarker([h.coordinates.lat, h.coordinates.lng], {
        radius: 8,
        color: markerColor,
        weight: 3,
        fillColor: markerColor,
        fillOpacity: 0.9,
      }).addTo(map);

      // Popup Content mapping to our frontend styles
      const popupHtml = `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #171717;">${h.name}</h3>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #525252;">📍 ${h.city}</p>
          
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
             ${isReady 
               ? `<span style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600;">🚨 ER Ready</span>` 
               : `<span style="background: #f5f5f5; color: #525252; border: 1px solid #e5e5e5; font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600;">Standard</span>`
             }
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 12px; font-size: 12px; text-align: center;">
             <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px;">
                <div style="font-weight: bold; color: #0f172a;">${h.erBeds}</div>
                <div style="font-size: 10px; color: #64748b;">ER Beds</div>
             </div>
             <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px;">
                <div style="font-weight: bold; color: #0f172a;">${h.icuBeds}</div>
                <div style="font-size: 10px; color: #64748b;">ICU Beds</div>
             </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false, className: 'custom-popup rounded-2xl shadow-lg' });
      
      // Setup events
      marker.on('click', () => {
        setActiveHospital(h);
        map.flyTo([h.coordinates.lat, h.coordinates.lng], 14, { duration: 0.5 });
      });

      markersRef.current[h._id] = marker;
    });

    // Auto-fit bounds if we have hospitals
    if (hospitals.length > 0) {
      const group = new L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

  }, [mapReady, loading, error, hospitals]);

  // Click handler from list
  const focusHospital = (h) => {
    setActiveHospital(h);
    const L = window.L;
    const map = mapInstance.current;
    if (map && markersRef.current[h._id]) {
      map.flyTo([h.coordinates.lat, h.coordinates.lng], 15, { duration: 0.5 });
      markersRef.current[h._id].openPopup();
    }
  };

  // GeoLocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert('Geolocation is not supported by your browser');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mapInstance.current) {
          mapInstance.current.flyTo([pos.coords.latitude, pos.coords.longitude], 12);
        }
      },
      () => alert('Unable to retrieve your location.')
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-neutral-50 relative">
      
      {/* Sidebar List */}
      <div className="w-full md:w-96 lg:w-[450px] bg-white border-r border-neutral-200 flex flex-col h-1/2 md:h-full z-10 shadow-sm shrink-0 order-2 md:order-1 overflow-hidden transition-all">
        <div className="p-5 border-b border-neutral-100 bg-white">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Emergency Map</h1>
          <p className="text-sm text-neutral-500 mb-4">Find nearby hospitals and real-time ER beds.</p>
          
          <button 
            onClick={handleLocateMe}
            className="w-full bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-lg font-semibold text-sm transition border border-primary-200"
          >
            📍 Center on my location
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
          {loading && <div className="text-center py-10 text-neutral-400">Loading hospitals...</div>}
          {!loading && error && <div className="text-center py-10 text-emergency-500">{error}</div>}
          
          {!loading && hospitals.map((h) => (
            <div 
              key={h._id} 
              onClick={() => focusHospital(h)}
              className={`cursor-pointer transition transform hover:-translate-y-0.5 ${activeHospital?._id === h._id ? 'ring-2 ring-primary-500 rounded-2xl shadow-md' : 'opacity-90 hover:opacity-100'}`}
            >
              <HospitalCard hospital={h} />
            </div>
          ))}

          {!loading && hospitals.length === 0 && (
            <div className="text-center py-10 text-neutral-500 font-medium text-sm">No hospitals have coordinates mapped yet.</div>
          )}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 w-full h-1/2 md:h-full relative order-1 md:order-2 bg-neutral-100">
        {!mapReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 z-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-full" />

        {/* Floating Action Box (when hospital selected) */}
        {activeHospital && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-white rounded-2xl shadow-xl border border-neutral-200 p-5 z-[400] animate-slide-up transition md:bottom-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-neutral-900 pr-4">{activeHospital.name}</h3>
              <button onClick={() => setActiveHospital(null)} className="text-neutral-400 hover:text-neutral-600 font-bold bg-neutral-100 rounded-full w-6 h-6 flex items-center justify-center">✕</button>
            </div>
            
            <p className="text-sm text-neutral-500 mb-4 truncate text-ellipsis">{activeHospital.address}, {activeHospital.city}</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to={`/hospitals/${activeHospital._id}`}
                className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold py-2.5 rounded-xl text-xs text-center border border-primary-200 transition"
              >
                View Details
              </Link>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeHospital.coordinates.lat},${activeHospital.coordinates.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-emergency-600 hover:bg-emergency-700 text-white font-bold py-2.5 rounded-xl text-xs text-center shadow-sm transition"
              >
                📍 Directions
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmergencyMapPage;
