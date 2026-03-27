import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  if (!doctor) return null;

  const {
    _id, name, specialization, hospitalId, availabilityStatus,
    shiftStart, shiftEnd, contactInfo
  } = doctor;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_surgery': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'off_duty': return 'bg-neutral-50 text-neutral-600 border-neutral-200';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available Now';
      case 'in_surgery': return 'In Surgery';
      case 'off_duty': return 'Off Duty';
      default: return status.replace('_', ' ');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 text-lg">Dr. {name}</h3>
          <p className="text-primary-600 text-sm font-medium">{specialization}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(availabilityStatus)}`}>
          {getStatusLabel(availabilityStatus)}
        </span>
      </div>

      <div className="text-sm text-neutral-600 mt-2 space-y-1.5 flex-1">
        {hospitalId && (
          <div className="flex items-start gap-2">
            <span className="text-neutral-400">🏥</span>
            <Link to={`/hospitals/${hospitalId._id}`} className="hover:text-primary-600 hover:underline line-clamp-1">
              {hospitalId.name || 'Hospital'}
            </Link>
          </div>
        )}
        {(shiftStart || shiftEnd) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">⏰</span>
            <span>Shift: {shiftStart || '?'} - {shiftEnd || '?'}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
        {contactInfo?.phone ? (
          <a href={`tel:${contactInfo.phone}`} className="text-xs font-medium text-neutral-500 hover:text-primary-600 transition">
            📞 {contactInfo.phone}
          </a>
        ) : (
          <span className="text-xs text-neutral-400">No contact info</span>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
