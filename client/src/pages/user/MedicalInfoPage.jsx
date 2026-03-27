import { useState, useEffect } from 'react';
import { getMedicalInfo, updateMedicalInfo } from '../../services/userService';
import { PageHeader } from '../../components/SharedComponents';

// Small helper to display + edit tag/chip lists (for allergies & conditions)
const TagInput = ({ label, tags, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 p-2.5 border border-neutral-300 rounded-lg min-h-[44px] bg-white">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => onRemove(i)} className="ml-1.5 text-primary-400 hover:text-primary-700">×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter"
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
        />
      </div>
      <p className="text-xs text-neutral-400 mt-1">Press Enter after each entry</p>
    </div>
  );
};

const MedicalInfoPage = () => {
  const [form, setForm] = useState({ bloodGroup: '', allergies: [], chronicDiseases: [], emergencyContact: { name: '', phone: '', relation: '' } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMedicalInfo();
        const d = res.data;
        setForm({
          bloodGroup: d.bloodGroup || '',
          allergies: d.allergies || [],
          chronicDiseases: d.chronicDiseases || [],
          emergencyContact: d.emergencyContact || { name: '', phone: '', relation: '' }
        });
      } catch { setError('Failed to load medical info.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleECChange = (e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(''); setError('');
    try {
      await updateMedicalInfo(form);
      setSuccess('Medical information updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition";

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" /></div>;

  return (
    <div>
      <PageHeader title="Medical Information" description="Keep your health details up to date for faster emergency assistance." />

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-2xl">
        {success && <div className="mb-5 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{success}</div>}
        {error && <div className="mb-5 p-3 bg-emergency-50 text-emergency-600 text-sm rounded-lg border border-emergency-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputClass}>
              <option value="">Select blood group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <TagInput
            label="Allergies"
            tags={form.allergies}
            onAdd={(tag) => setForm({ ...form, allergies: [...form.allergies, tag] })}
            onRemove={(i) => setForm({ ...form, allergies: form.allergies.filter((_, idx) => idx !== i) })}
          />

          <TagInput
            label="Chronic Diseases / Conditions"
            tags={form.chronicDiseases}
            onAdd={(tag) => setForm({ ...form, chronicDiseases: [...form.chronicDiseases, tag] })}
            onRemove={(i) => setForm({ ...form, chronicDiseases: form.chronicDiseases.filter((_, idx) => idx !== i) })}
          />

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-neutral-100">
            <h3 className="text-sm font-semibold text-neutral-800 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Name</label>
                <input type="text" name="name" value={form.emergencyContact.name} onChange={handleECChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Phone</label>
                <input type="tel" name="phone" value={form.emergencyContact.phone} onChange={handleECChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Relation</label>
                <input type="text" name="relation" value={form.emergencyContact.relation} onChange={handleECChange} placeholder="e.g. Mother" className={inputClass} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition">
            {saving ? 'Saving…' : 'Save Medical Info'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalInfoPage;
