const { SEVERITY_LEVELS } = require('../config/appConstants');

/**
 * analyzeSymptomText — simple rule-based triage engine.
 * Classifies urgency level and returns first-level health guidance.
 *
 * @param {string} symptomsText - Raw symptom description from user
 * @returns {{ urgencyLevel, guidance, action }}
 */
const CRITICAL_KEYWORDS = [
  'chest pain', 'heart attack', 'can\'t breathe', 'not breathing',
  'unconscious', 'unresponsive', 'severe bleeding', 'stroke',
  'paralysis', 'seizure', 'overdose', 'poisoning', 'anaphylaxis'
];

const HIGH_KEYWORDS = [
  'difficulty breathing', 'shortness of breath', 'high fever',
  'persistent vomiting', 'heavy bleeding', 'severe headache',
  'broken bone', 'fracture', 'deep wound', 'fainting', 'dizziness'
];

const MEDIUM_KEYWORDS = [
  'fever', 'vomiting', 'stomach pain', 'abdominal pain', 'infection',
  'sprain', 'moderate pain', 'cough', 'sore throat', 'earache',
  'rash', 'nausea', 'dehydration', 'minor cut'
];

const analyzeSymptomText = (symptomsText) => {
  const lower = symptomsText.toLowerCase();

  const isCritical = CRITICAL_KEYWORDS.some((kw) => lower.includes(kw));
  const isHigh = HIGH_KEYWORDS.some((kw) => lower.includes(kw));
  const isMedium = MEDIUM_KEYWORDS.some((kw) => lower.includes(kw));

  if (isCritical) {
    return {
      urgencyLevel: SEVERITY_LEVELS.CRITICAL,
      guidance: '🚨 CRITICAL: Your symptoms may indicate a life-threatening emergency. Call emergency services (108/112) immediately or go to the nearest ER right now. Do NOT wait.',
      action: 'go_to_er_immediately',
    };
  }

  if (isHigh) {
    return {
      urgencyLevel: SEVERITY_LEVELS.HIGH,
      guidance: '⚠️ HIGH URGENCY: Your symptoms require prompt medical attention. Please visit the Emergency Room or call a doctor immediately. Do not ignore these signs.',
      action: 'visit_er_soon',
    };
  }

  if (isMedium) {
    return {
      urgencyLevel: SEVERITY_LEVELS.MEDIUM,
      guidance: '🔶 MODERATE: Your symptoms suggest you should consult a doctor. Book an appointment or visit a clinic. Stay hydrated and rest.',
      action: 'visit_doctor',
    };
  }

  return {
    urgencyLevel: SEVERITY_LEVELS.LOW,
    guidance: '✅ LOW URGENCY: Your symptoms appear mild. Rest at home, stay hydrated, and monitor for any worsening. Consult a doctor if symptoms persist for more than 48 hours.',
    action: 'rest_at_home',
  };
};

const DISCLAIMER = '⚕️ DISCLAIMER: This is first-level guidance ONLY and is NOT a medical diagnosis. It does NOT replace a licensed doctor or emergency services. If in doubt, always seek immediate professional help.';

module.exports = { analyzeSymptomText, DISCLAIMER };
