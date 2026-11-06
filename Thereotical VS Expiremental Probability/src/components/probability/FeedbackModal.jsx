/* =========================================================
   QUICK FORMULA REFERENCE / CHEAT SHEET MODAL
   ========================================================= */

import React from 'react';
import { sounds } from '../../utils/audio';

export default function FeedbackModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        border: '1.5px solid var(--border-gold)',
        boxShadow: '0 0 40px var(--gold-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--gold-300)', fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800 }}>
            ⚡ Probability Quick Reference Cheat Sheet
          </h3>
          <button
            onClick={() => { sounds.click(); onClose(); }}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
            <strong style={{ color: 'var(--teal-300)' }}>1. Theoretical Probability:</strong><br />
            <code>P(E) = favourable outcomes / total equally likely outcomes</code><br />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Calculated with pure math before any experiment begins!</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
            <strong style={{ color: 'var(--coral-300)' }}>2. Experimental Probability (Relative Frequency):</strong><br />
            <code>P(E) = observed frequency / total trials conducted</code><br />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Based on actual real-world experiment trials!</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
            <strong style={{ color: 'var(--gold-300)' }}>3. Law of Large Numbers:</strong><br />
            <code>As trials → ∞, Experimental Probability → Theoretical Probability</code><br />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Small experiments have natural fluctuations; large trials reveal the true probability!</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
            <strong style={{ color: 'var(--emerald-300)' }}>4. Probability Scale:</strong><br />
            <code>0 (Impossible) ≤ P(E) ≤ 1 (Certain)</code> | <code>0.5 = 50% = Even Chance</code>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => { sounds.click(); onClose(); }}
          style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
        >
          Got It! Back to Quest
        </button>
      </div>
    </div>
  );
}
