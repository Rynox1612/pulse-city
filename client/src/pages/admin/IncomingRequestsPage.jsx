import { useState, useEffect } from 'react';
import { getIncomingRequests, updateRequestStatus } from '../../services/adminService';
import { PageHeader, StatusBadge } from '../../components/SharedComponents';

const STATUS_OPTS = ['pending', 'accepted', 'rejected', 'in_progress', 'completed'];

// Status colors
const STATUS_TYPE = { pending: 'warning', accepted: 'success', rejected: 'danger', in_progress: 'success', completed: 'default' };
const SEVERITY_TYPE = { low: 'default', medium: 'warning', high: 'danger', critical: 'danger' };

const IncomingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  // Keep track of which request is actively mutating
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getIncomingRequests(filter);
      setRequests(res.data || []);
    } catch { /* display err internally if needed */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateRequestStatus(id, newStatus);
      // Optimistically update
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader title="Incoming Emergency Requests" description="Review patient emergency alerts and dispatch real-time status updates." />
        
        {/* Status Filter */}
        <div className="bg-white border text-sm border-neutral-200 rounded-lg p-1.5 flex shadow-sm shrink-0">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none font-semibold text-neutral-700 focus:ring-0 outline-none"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><div className="animate-spin h-8 w-8 border-4 border-emergency-500 border-t-transparent rounded-full" /></div>
      ) : requests.length === 0 ? (
         <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
            <div className="text-5xl mb-4">🩺</div>
            <h3 className="text-lg font-semibold text-neutral-700">No requests found</h3>
            <p className="text-sm text-neutral-500 mt-2">There are currently no matching emergency requests.</p>
         </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className={`bg-white rounded-xl border ${req.severity === 'critical' && req.status === 'pending' ? 'border-emergency-300 shadow-sm shadow-emergency-100' : 'border-neutral-200'} p-5 hover:border-primary-200 transition`}>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Info Block */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-neutral-900">{req.userId?.name || 'Unknown Patient'}</h3>
                    <StatusBadge status={req.severity?.toUpperCase()} type={SEVERITY_TYPE[req.severity] || 'default'} />
                  </div>
                  
                  <div className="text-sm font-medium text-neutral-600 space-y-1 mb-4">
                    <p>📞 {req.userId?.phone || 'No phone provided'}</p>
                    <p>🩸 Blood Group: {req.userId?.bloodGroup || 'Unknown'}</p>
                  </div>
                  
                  {/* Symptoms */}
                  <div className="flex flex-wrap gap-1.5">
                    {req.symptoms?.map((s, i) => (
                      <span key={i} className="text-xs font-semibold bg-neutral-100 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-neutral-400 mt-4">Requested at {new Date(req.requestedAt).toLocaleString()}</p>
                </div>

                {/* Status Update Actions */}
                <div className="w-full md:w-56 shrink-0 bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex flex-col justify-center">
                   <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 text-center">Current Status</p>
                   <div className="flex justify-center mb-4">
                     <StatusBadge status={req.status?.replace('_', ' ').toUpperCase()} type={STATUS_TYPE[req.status] || 'default'} />
                   </div>
                   
                   <label className="text-xs font-bold text-neutral-700 mb-1 block text-center">Update to:</label>
                   <select
                      value={req.status}
                      disabled={updatingId === req._id}
                      onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-sm focus:outline-none focus:border-primary-500 disabled:opacity-50 transition"
                   >
                     {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                   </select>

                   {updatingId === req._id && <p className="text-center text-xs text-primary-600 font-bold mt-2 animate-pulse">Syncing...</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingRequestsPage;
