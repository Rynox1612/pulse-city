import { useState, useEffect } from 'react';
import { getAdminAnalytics } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/SharedComponents';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-primary-50 text-primary-600 border-primary-100',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-emergency-50 text-emergency-700 border-emergency-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl border ${colorMap[color]} text-2xl`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{title}</h3>
        <p className="text-2xl font-bold text-neutral-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name}`}
        description={`Manage operations for ${user?.hospital?.name || 'your facility'}.`}
      />

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard title="Total Doctors" value={data.totalDoctors} icon="🩺" color="blue" />
          <StatCard title="Pending Requests" value={data.pendingRequests} icon="🚨" color="red" />
          <StatCard title="Active Requests" value={data.activeRequests} icon="⏳" color="yellow" />
          <StatCard title="Completed Requests" value={data.completedRequests} icon="✅" color="green" />

          {/* Quick Bed Availability Overview */}
          <StatCard title="ER Beds Available" value={data.erBeds} icon="🛏️" color={data.erBeds > 0 ? 'green' : 'red'} />
          <StatCard title="ICU Beds Available" value={data.icuBeds} icon="🫀" color="blue" />
        </div>
      )}

      {/* Quick Links Section */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {/* Add links when routes setup via react-router */}
           <div className="bg-white border rounded-xl p-5 hover:border-primary-400 hover:shadow-sm transition cursor-pointer">
              <span className="text-xl mb-2 block">🚑</span>
              <h4 className="font-semibold text-neutral-800">Update Resource Availability</h4>
              <p className="text-xs text-neutral-500 mt-1">Keep your live ER and Bed counts accurate.</p>
           </div>
           <div className="bg-white border rounded-xl p-5 hover:border-primary-400 hover:shadow-sm transition cursor-pointer">
              <span className="text-xl mb-2 block">📋</span>
              <h4 className="font-semibold text-neutral-800">View Incoming Requests</h4>
              <p className="text-xs text-neutral-500 mt-1">Check pending and active user emergencies.</p>
           </div>
           <div className="bg-white border rounded-xl p-5 hover:border-primary-400 hover:shadow-sm transition cursor-pointer">
              <span className="text-xl mb-2 block">👨‍⚕️</span>
              <h4 className="font-semibold text-neutral-800">Manage Doctors</h4>
              <p className="text-xs text-neutral-500 mt-1">Update doctor on-duty availability status.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
