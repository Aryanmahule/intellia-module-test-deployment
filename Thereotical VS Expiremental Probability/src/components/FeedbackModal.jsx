import React from 'react';
import { sounds } from '../utils/audio';

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
            ⚡ Detective Quick Formula Reference
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
            <strong style={{ color: 'var(--teal-300)' }}>1. Linear Sequence Rule:</strong><br/>
            <code>nth term = (common difference × n) + adjustment</code>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
            <strong style={{ color: 'var(--coral-300)' }}>2. "Less Than" Trap:</strong><br/>
            <code>"b less than a" = a − b</code> (Never b − a!)
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
            <strong style={{ color: 'var(--gold-300)' }}>3. Matchstick Squares:</strong><br/>
            <code>3n + 1</code> (1st square takes 4, each extra square adds 3).
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
            <strong style={{ color: 'var(--emerald-300)' }}>4. Joined Tables:</strong><br/>
            <code>2n + 2</code> (1 person per side + 2 end seats).
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
