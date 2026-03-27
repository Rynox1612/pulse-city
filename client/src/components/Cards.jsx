import { StatusBadge } from './SharedComponents';

export const HospitalCard = ({ name, type, address }) => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5 hover:shadow-md transition">
    <h3 className="text-lg font-semibold text-primary-700">{name || 'City General Hospital'}</h3>
    <StatusBadge status={type || 'Multi-Specialty'} type="default" />
    <p className="text-sm text-neutral-500 mt-3">{address || '123 Health Ave, Pulse City'}</p>
    <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
      <span className="text-sm font-medium text-emergency-600">ER Available</span>
      <button className="text-sm text-primary-600 font-medium hover:underline">View Logic &rarr;</button>
    </div>
  </div>
);

export const DoctorCard = ({ name, specialization, status }) => (
  <div className="bg-white rounded-lg p-4 border border-neutral-200">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
        {name ? name.charAt(0) : 'D'}
      </div>
      <div>
        <h4 className="font-semibold text-neutral-900">{name || 'Dr. Smith'}</h4>
        <p className="text-xs text-neutral-500">{specialization || 'Cardiologist'}</p>
      </div>
    </div>
    <div className="mt-3 flex justify-between items-center">
      <StatusBadge status={status || 'Available'} type="success" />
    </div>
  </div>
);
