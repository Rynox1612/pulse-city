import { PageHeader } from '../../components/SharedComponents';

export const ProfilePage = () => (
  <div>
    <PageHeader title="My Profile" description="Manage your account settings." />
    <p className="text-neutral-600 bg-white p-4 rounded shadow-sm">Basic details and avatar section.</p>
  </div>
);

export const MedicalInfoPage = () => (
  <div>
    <PageHeader title="Medical Information" description="Allergies, chronic conditions, and blood group." />
    <p className="text-neutral-600 bg-white p-4 rounded shadow-sm">Medical data form coming soon.</p>
  </div>
);

export const SavedHospitalsPage = () => (
  <div>
    <PageHeader title="Saved Hospitals" description="Quick access to your preferred facilities." />
    <p className="text-neutral-600 bg-white p-4 rounded shadow-sm">Saved hospital list rendering.</p>
  </div>
);

export const EmergencyRequestsPage = () => (
  <div>
    <PageHeader title="My Emergency Requests" description="History and live tracking of your requests." />
    <p className="text-neutral-600 bg-white p-4 rounded shadow-sm border-l-4 border-emergency-500">Live ticket tracker goes here.</p>
  </div>
);
