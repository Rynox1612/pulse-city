import { useState, useEffect } from 'react';
import { getMyEmergencyRequests, cancelRequest } from '../../services/emergencyService';
import { PageHeader, StatusBadge } from '../../components/SharedComponents';

// Map status/severity to badge type for styling
const STATUS_TYPE = { pending: 'warning', accepted: 'success', rejected: 'danger', in_progress: 'success', completed: 'default' };
const SEVERITY_TYPE = { low: 'default', medium: 'warning', high: 'danger', critical: 'danger' };

const EmergencyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await getMyEmergencyRequests();
      setRequests(res.data || []);
    } catch { setError('Failed to load emergency requests.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this emergency request?')) return;
    setCancellingId(id);
    try {
      await cancelRequest(id);
      setRequests((prev) => prev.filter(r => r._id !== id));
    } catch {
      alert('Failed to cancel request. It may have already been processed.');
      fetchRequests(); // refresh state
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div>
      <PageHeader title="My Emergency Requests" description="Track the status of your submitted emergency requests." />

      {error && <div className="mb-5 p-3 bg-emergency-50 text-emergency-600 text-sm rounded-lg">{error}</div>}

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <div className="text-5xl mb-4">🚑</div>
          <h3 className="text-lg font-semibold text-neutral-700">No emergency requests</h3>
          <p className="text-sm text-neutral-500 mt-2">You have not submitted any emergency requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-sm transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-neutral-900">{req.hospitalId?.name || 'Hospital'}</h3>
                  <p className="text-sm text-neutral-500">{req.hospitalId?.city}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={req.severity?.toUpperCase()} type={SEVERITY_TYPE[req.severity] || 'default'} />
                  <StatusBadge status={req.status?.replace('_', ' ').toUpperCase()} type={STATUS_TYPE[req.status] || 'default'} />
                </div>
              </div>

              {req.symptoms?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {req.symptoms.map((s, i) => (
                    <span key={i} className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">{s}</span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 border-t border-neutral-100 pt-3">
                <p className="text-xs text-neutral-400">
                  Requested: {req.requestedAt ? new Date(req.requestedAt).toLocaleString() : '—'}
                </p>

                {req.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(req._id)}
                    disabled={cancellingId === req._id}
                    className="mt-3 sm:mt-0 text-xs font-semibold text-emergency-500 hover:text-emergency-700 disabled:opacity-50 transition"
                  >
                    {cancellingId === req._id ? 'Canceling...' : '✖ Cancel Request'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyRequestsPage;
