import { useState, useEffect } from 'react';
import { getAdminHospital, addDoctor, updateDoctor, deleteDoctor } from '../../services/adminService';
import { getDoctorsByHospital } from '../../services/doctorService';
import { PageHeader, StatusBadge } from '../../components/SharedComponents';

const STATUS_OPTS = ['available', 'in_surgery', 'off_duty'];

const AdminDoctorModal = ({ doctor, hospitalId, onClose, onRefresh }) => {
  const isEditing = !!doctor;
  const [form, setForm] = useState(
    doctor || {
      name: '', specialization: '', availabilityStatus: 'available',
      shiftStart: '', shiftEnd: '', contactInfo: { phone: '' }
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhone = (e) => setForm({ ...form, contactInfo: { phone: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEditing) {
        await updateDoctor(doctor._id, form);
      } else {
        await addDoctor({ ...form, hospitalId });
      }
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save doctor.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-2.5 border border-neutral-300 rounded-lg text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition";

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden p-6 relative">
        <h2 className="text-xl font-bold text-neutral-900 mb-5">{isEditing ? 'Edit Doctor' : 'Add New Doctor'}</h2>
        {error && <div className="mb-4 text-xs font-semibold text-emergency-600 bg-emergency-50 p-2 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Doctor Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Specialization *</label>
            <input name="specialization" value={form.specialization} onChange={handleChange} required className={inputClass} placeholder="Cardiology" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Duty Status *</label>
            <select name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} className={inputClass}>
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Shift Start</label>
              <input type="time" name="shiftStart" value={form.shiftStart} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Shift End</label>
              <input type="time" name="shiftEnd" value={form.shiftEnd} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Direct Contact Number</label>
            <input name="phone" value={form.contactInfo?.phone} onChange={handlePhone} className={inputClass} placeholder="+91 99999..." />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-neutral-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitalId, setHospitalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDoc, setEditDoc] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const hRes = await getAdminHospital();
      setHospitalId(hRes.data._id);
      
      const dRes = await getDoctorsByHospital(hRes.data._id);
      setDoctors(dRes.data || []);
    } catch { /* Handle error silently for now */ } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor from the roster?')) return;
    try {
      await deleteDoctor(id);
      setDoctors(prev => prev.filter(d => d._id !== id));
    } catch { alert('Failed to delete doctor.'); }
  };

  const openEdit = (doctor) => {
    setEditDoc(doctor);
    setIsModalOpen(true);
  };
  
  const openAdd = () => {
    setEditDoc(null);
    setIsModalOpen(true);
  };

  // Status Colors
  const statusColorMap = {
    available: 'success',
    in_surgery: 'warning',
    off_duty: 'default'
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader title="Manage Doctors" description="Add specialists and update their realtime duty status." />
        <button onClick={openAdd} disabled={!hospitalId} className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50 text-sm whitespace-nowrap">
          + Add New Doctor
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-neutral-500">
           No doctors registered yet. Add some to get started. 
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4">Doctor Name</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Shift</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {doctors.map(doc => (
                  <tr key={doc._id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 font-bold text-neutral-900">Dr. {doc.name}</td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">{doc.specialization}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={doc.availabilityStatus.replace('_', ' ').toUpperCase()} type={statusColorMap[doc.availabilityStatus]} />
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-medium text-xs">
                       {doc.shiftStart} - {doc.shiftEnd}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openEdit(doc)} className="text-primary-600 font-bold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(doc._id)} className="text-emergency-500 font-bold hover:underline">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <AdminDoctorModal
          doctor={editDoc}
          hospitalId={hospitalId}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};

export default ManageDoctorsPage;
