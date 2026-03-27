import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveHospital, removeSavedHospital } from '../services/userService';
import { ROUTES } from '../config/appConstants';

/**
 * HospitalCard — displays a single hospital with key stats and actions.
 * Props:
 *   hospital     — the hospital object from the API
 *   isSaved      — boolean, whether this hospital is in the user's saved list
 *   onSaveToggle — callback(id, newSavedState) for parent to update its list
 */
const HospitalCard = ({ hospital, isSaved = false, onSaveToggle }) => {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  if (!hospital) return null;

  const {
    _id, name, city, address, specialties = [], emergencyAvailable,
    icuBeds = 0, erBeds = 0, hospitalType, is24x7, contactNumber,
  } = hospital;

  const handleSaveToggle = async (e) => {
    e.preventDefault(); // prevent card link navigation
    if (!isAuthenticated) {
      window.location.href = ROUTES.LOGIN;
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await removeSavedHospital(_id);
        setSaved(false);
        onSaveToggle?.(_id, false);
      } else {
        await saveHospital(_id);
        setSaved(true);
        onSaveToggle?.(_id, true);
      }
    } catch {
      // silently handle — could toast here later
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 hover:shadow-md hover:border-primary-200 transition-all duration-200 flex flex-col">
      {/* Top section */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 truncate text-base">{name}</h3>
            <p className="text-sm text-neutral-500 mt-0.5">📍 {city}</p>
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            title={saved ? 'Remove from saved' : 'Save hospital'}
            className={`flex-shrink-0 p-1.5 rounded-full transition ${saved ? 'text-emergency-500 hover:text-emergency-700' : 'text-neutral-300 hover:text-primary-500'}`}
          >
            {saved ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Badges row */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {emergencyAvailable && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emergency-50 text-emergency-600 border border-emergency-200">
              🚨 ER Available
            </span>
          )}
          {is24x7 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              ⏰ 24/7
            </span>
          )}
          {hospitalType && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 capitalize">
              {hospitalType.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Bed stats */}
        {(erBeds > 0 || icuBeds > 0) && (
          <div className="mt-3 flex gap-3 text-xs">
            {erBeds > 0 && (
              <span className="text-neutral-600">
                <span className="font-semibold text-primary-600">{erBeds}</span> ER Beds
              </span>
            )}
            {icuBeds > 0 && (
              <span className="text-neutral-600">
                <span className="font-semibold text-primary-600">{icuBeds}</span> ICU Beds
              </span>
            )}
          </div>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
            {specialties.length > 3 && (
              <span className="text-xs text-neutral-400">+{specialties.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom action strip */}
      <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs text-neutral-500 truncate">📞 {contactNumber || 'N/A'}</span>
        <Link
          to={`/hospitals/${_id}`}
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline flex-shrink-0 ml-2"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default HospitalCard;
