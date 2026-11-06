import React, { useState, useEffect } from 'react';
import { REFLECT_PROMPTS } from '../utils/ratiosNarration';
import { sounds, playNarration } from '../utils/audio';

export default function ReflectCheck({
  initialNotes = {},
  onSaveReflection,
  onNextPhase
}) {
  const [notes, setNotes] = useState({
    onePart: initialNotes.onePart || '',
    addingMisconception: initialNotes.addingMisconception || '',
    realWorld: initialNotes.realWorld || '',
    confidence: initialNotes.confidence || 4
  });

  useEffect(() => {
    playNarration(
      "Think about today's discoveries. Where would a wrong ratio cause a problem in real life?",
      'thinking'
    );
  }, []);

  const handleChange = (field, val) => {
    setNotes(prev => ({ ...prev, [field]: val }));
  };

  const handleFinish = () => {
    sounds.fanfare();
    onSaveReflection(notes);
    onNextPhase();
  };

  const isFormFilled = notes.onePart.trim() || notes.addingMisconception.trim() || notes.realWorld.trim();

  return (
    <div className="reflect-phase-container">
      {/* Header */}
      <div className="reflect-header-box">
        <div className="curriculum-badge-sm">
          <span>📓 Reflection Phase</span>
        </div>
        <h2 className="reflect-main-title">
          Maya & Ravi's Learning Log
        </h2>
        <p className="reflect-sub-desc">
          Capture what you discovered today. Connecting math to real life makes concepts stick forever!
        </p>
      </div>

      {/* Prompts Cards */}
      <div className="reflect-prompts-grid">
        {REFLECT_PROMPTS.map((p) => (
          <div key={p.id} className="reflect-prompt-card">
            <h4 className="prompt-title">
              💡 {p.prompt}
            </h4>
            <textarea
              className="reflect-textarea"
              placeholder={p.placeholder}
              value={notes[p.id]}
              onChange={(e) => handleChange(p.id, e.target.value)}
              rows={3}
            />
          </div>
        ))}

        {/* Confidence rating */}
        <div className="reflect-confidence-card">
          <h4 className="prompt-title">
            🌟 How confident do you feel solving ratio problems in real life?
          </h4>
          <div className="confidence-buttons-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-rating-btn ${notes.confidence >= star ? 'active' : ''}`}
                onClick={() => { sounds.pop(); handleChange('confidence', star); }}
              >
                ★
              </button>
            ))}
            <span className="confidence-label">
              {notes.confidence === 5 ? 'Ratio Master 🚀' : notes.confidence >= 4 ? 'Very Confident 💪' : 'Getting There 🌱'}
            </span>
          </div>
        </div>
      </div>

      {/* Submit / Continue Button */}
      <div className="reflect-footer-bar">
        <button
          className="btn-gold"
          onClick={handleFinish}
          style={{ padding: '14px 42px' }}
        >
          <span>Complete Log & Claim Badge 🏆</span>
        </button>
      </div>
    </div>
  );
}
