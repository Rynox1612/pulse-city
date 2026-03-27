import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chatWithAssistant } from '../../services/chatbotService';
import { ROUTES } from '../../config/appConstants';
import { useAuth } from '../../context/AuthContext';

const PRESET_SYMPTOMS = [
  'Chest pain', 'Difficulty breathing', 'High fever', 'Severe headache',
  'Bleeding', 'Stomach pain', 'Dizziness', 'Persistent cough'
];

const URGENCIES = {
  critical: { color: 'bg-emergency-50', text: 'text-emergency-700', border: 'border-emergency-200' },
  high: { color: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  medium: { color: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  low: { color: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

const AIAssistantPage = () => {
  const { isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse(null);
    setError('');

    try {
      const res = await chatWithAssistant(input);
      setResponse(res.data);
    } catch {
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setInput('');
    setResponse(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-3xl font-bold text-neutral-900">AI Symptom Assistant</h1>
          <p className="mt-2 text-neutral-500 max-w-lg mx-auto">
            Describe how you are feeling to receive an immediate urgency classification and first-level medical guidance.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
          
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-sm font-semibold text-neutral-700 mb-2">What are your symptoms?</label>
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I have a high fever and a persistent headache since yesterday..."
              className="w-full p-4 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none bg-neutral-50 focus:bg-white"
            />
            
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_SYMPTOMS.map((sym, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput((prev) => prev ? `${prev}, ${sym}` : sym)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs rounded-full transition"
                >
                  +{sym}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
            {error && <p className="mt-3 text-sm text-center text-emergency-500 font-medium">{error}</p>}
          </form>

          {/* Results Area */}
          {response && (
            <div className="border-t border-neutral-100 pt-6 animate-fade-in">
              <div className={`p-5 rounded-xl border ${URGENCIES[response.urgencyLevel]?.color} ${URGENCIES[response.urgencyLevel]?.border}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold bg-white uppercase tracking-wider ${URGENCIES[response.urgencyLevel]?.text}`}>
                    Urgency: {response.urgencyLevel}
                  </span>
                </div>
                
                <p className="text-neutral-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {response.reply}
                </p>

                {/* Smart Action Buttons */}
                <div className="mt-5 pt-5 border-t border-black/5 flex flex-wrap gap-3">
                  {(response.urgencyLevel === 'critical' || response.urgencyLevel === 'high') && (
                    <>
                      <Link
                        to={isAuthenticated ? '/user/create-request' : ROUTES.LOGIN}
                        className="bg-emergency-600 hover:bg-emergency-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition inline-flex items-center"
                      >
                        🚨 Request Emergency Help Now
                      </Link>
                      <Link
                        to={ROUTES.EMERGENCY_MAP}
                        className="bg-white border border-emergency-200 text-emergency-700 hover:bg-emergency-50 px-5 py-2.5 rounded-lg text-sm font-semibold transition inline-flex items-center"
                      >
                        📍 Find Nearest Hospital
                      </Link>
                    </>
                  )}
                  {(response.urgencyLevel === 'medium' || response.urgencyLevel === 'low') && (
                     <Link
                       to={ROUTES.DOCTORS}
                       className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition inline-flex items-center"
                     >
                       🩺 Find a Doctor
                     </Link>
                  )}
                  <button onClick={clearChat} className="px-5 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition ml-auto">
                    Clear & Start Over
                  </button>
                </div>
              </div>
              
              {!isAuthenticated && (
                <p className="mt-4 text-xs text-center text-neutral-400">
                  <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline">Log in</Link> to save your symptom history automatically.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
