import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import BalanceScaleCanvas from './BalanceScaleCanvas.jsx';
import { NARRATION } from '../../utils/equationsNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StationsPhase({ state, onNext, onCompleteStation, onAddXP }) {
  const [activeStation, setActiveStation] = useState('station1');

  // Shared Gamification HUD State
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(1);
  const [relaxedMode, setRelaxedMode] = useState(false);

  // ----------------------------------------------------
  // Station 1: Balance Lab ("Keep It Level")
  // ----------------------------------------------------
  const [s1Level, setS1Level] = useState(0);
  const [s1Stars, setS1Stars] = useState([3, 0, 0, 0, 0]);

  const s1Challenges = [
    { left: { x: 1, units: 3 }, right: { units: 8 }, targetX: 5, prompt: "Level 1: Subtract 3 from both sides to find mystery bag x in x + 3 = 8!" },
    { left: { x: 1, units: 5 }, right: { units: 12 }, targetX: 7, prompt: "Level 2: Subtract 5 from both pans equally in x + 5 = 12!" },
    { left: { x: 3, units: 0 }, right: { units: 15 }, targetX: 5, prompt: "Level 3: Divide both sides by 3 into equal piles in 3x = 15!" },
    { left: { x: 2, units: 4 }, right: { units: 14 }, targetX: 5, prompt: "Level 4: Undo +4 first (subtract 4), then divide by 2 in 2x + 4 = 14!" },
    { left: { x: 4, units: 2 }, right: { units: 18 }, targetX: 4, prompt: "Level 5 (Boss): Master two-step balance in 4x + 2 = 18!" }
  ];

  // ----------------------------------------------------
  // Station 2: Undo Machine ("Crack the Vault")
  // ----------------------------------------------------
  const [s2Level, setS2Level] = useState(0);
  const [s2DialRot, setS2DialRot] = useState(0);
  const [s2Unlocked, setS2Unlocked] = useState(false);
  const [s2Steps, setS2Steps] = useState([]);
  const [s2Shake, setS2Shake] = useState(false);

  const s2Vaults = [
    {
      eq: "x - 7 = 12",
      prompt: "Vault Lock #1: Which inverse operation isolates x?",
      cards: [
        { text: "+ 7 to both sides", op: 'add', val: 7, isCorrect: true },
        { text: "- 7 to both sides", op: 'sub', val: 7, isCorrect: false, reason: "Subtracting 7 leaves x - 14, not x." },
        { text: "× 7 to both sides", op: 'mul', val: 7, isCorrect: false, reason: "The inverse of minus 7 is plus 7." },
        { text: "÷ 7 to both sides", op: 'div', val: 7, isCorrect: false, reason: "Addition is needed to undo subtraction." }
      ],
      solutionLine: "x - 7 + 7 = 12 + 7  ➔  x = 19"
    },
    {
      eq: "x + 9 = 24",
      prompt: "Vault Lock #2: Pick the card to neutralize + 9",
      cards: [
        { text: "- 9 to both sides", op: 'sub', val: 9, isCorrect: true },
        { text: "+ 9 to both sides", op: 'add', val: 9, isCorrect: false, reason: "Adding 9 gives x + 18." },
        { text: "÷ 9 to both sides", op: 'div', val: 9, isCorrect: false, reason: "Inverse of +9 is -9." },
        { text: "× 9 to both sides", op: 'mul', val: 9, isCorrect: false, reason: "Use subtraction to undo addition." }
      ],
      solutionLine: "x + 9 - 9 = 24 - 9  ➔  x = 15"
    },
    {
      eq: "4x = 28",
      prompt: "Vault Lock #3: How do you undo multiplication by 4?",
      cards: [
        { text: "÷ 4 to both sides", op: 'div', val: 4, isCorrect: true },
        { text: "- 4 to both sides", op: 'sub', val: 4, isCorrect: false, reason: "4 is multiplied with x, not added." },
        { text: "× 4 to both sides", op: 'mul', val: 4, isCorrect: false, reason: "Multiplying makes it 16x." },
        { text: "+ 4 to both sides", op: 'add', val: 4, isCorrect: false, reason: "Division is the true inverse of multiplication." }
      ],
      solutionLine: "4x ÷ 4 = 28 ÷ 4  ➔  x = 7"
    },
    {
      eq: "x ÷ 5 = 6",
      prompt: "Vault Lock #4: Reverse division by 5",
      cards: [
        { text: "× 5 to both sides", op: 'mul', val: 5, isCorrect: true },
        { text: "÷ 5 to both sides", op: 'div', val: 5, isCorrect: false, reason: "Dividing again makes x ÷ 25." },
        { text: "+ 5 to both sides", op: 'add', val: 5, isCorrect: false, reason: "Multiplication undoes division." },
        { text: "- 5 to both sides", op: 'sub', val: 5, isCorrect: false, reason: "Use multiplication to cancel division." }
      ],
      solutionLine: "(x ÷ 5) × 5 = 6 × 5  ➔  x = 30"
    },
    {
      eq: "2x + 5 = 17",
      prompt: "Vault Boss Lock #5: What is Step 1 to crack this lock?",
      cards: [
        { text: "- 5 to both sides (then ÷ 2)", op: 'sub', val: 5, isCorrect: true },
        { text: "÷ 2 to both sides first", op: 'div', val: 2, isCorrect: false, reason: "Always undo addition/subtraction before division." },
        { text: "+ 5 to both sides", op: 'add', val: 5, isCorrect: false, reason: "We must subtract 5 to isolate 2x." },
        { text: "× 2 to both sides", op: 'mul', val: 2, isCorrect: false, reason: "Inverse of +5 is -5." }
      ],
      solutionLine: "2x = 17 - 5 = 12  ➔  x = 12 ÷ 2 = 6"
    }
  ];

  // ----------------------------------------------------
  // Station 3: Hawker Stall Rush ("Solve the Order")
  // ----------------------------------------------------
  const [s3Level, setS3Level] = useState(0);
  const [s3BuiltTokens, setS3BuiltTokens] = useState([]);
  const [s3Phase, setS3Phase] = useState('build'); // 'build' | 'solve' | 'serve'
  const [s3SelectedAns, setS3SelectedAns] = useState(null);

  const s3Orders = [
    {
      customer: "Uncle Lim (Lau Pa Sat)",
      avatar: "👨‍🦳",
      story: "Uncle Lim paid $12 for kopi (k) and kaya toast ($5). How much was the kopi?",
      targetEquationTokens: ['k', '+', '5', '=', '12'],
      availableTokens: ['k', '+', '5', '=', '12', '-', '2', '×'],
      options: ['$7.00', '$6.00', '$8.00', '$17.00'],
      correct: '$7.00',
      calc: "k + 5 = 12  ➔  k = 12 - 5 = $7.00"
    },
    {
      customer: "Aunty Siti (Tekka Centre)",
      avatar: "🧕",
      story: "Aunty Siti bought 3 bowls of laksa (L) plus a $2 lime juice. Her total bill was $17. Find the cost L of one laksa!",
      targetEquationTokens: ['3L', '+', '2', '=', '17'],
      availableTokens: ['3L', '+', '2', '=', '17', '-', '5', '÷'],
      options: ['$5.00', '$6.00', '$4.50', '$5.50'],
      correct: '$5.00',
      calc: "3L + 2 = 17  ➔  3L = 15  ➔  L = $5.00"
    },
    {
      customer: "Farhan (Prata House)",
      avatar: "🧑",
      story: "Farhan ordered 4 plain pratas (p) and a $3 egg prata. The total was $11. Find the cost of each plain prata p.",
      targetEquationTokens: ['4p', '+', '3', '=', '11'],
      availableTokens: ['4p', '+', '3', '=', '11', 'p', '-', '14'],
      options: ['$2.00', '$1.80', '$2.50', '$3.00'],
      correct: '$2.00',
      calc: "4p + 3 = 11  ➔  4p = 8  ➔  p = $2.00"
    },
    {
      customer: "Chloe (Maxwell Food Centre)",
      avatar: "👧",
      story: "Chloe topped up her MRT card by $20. After 3 identical bus rides (r) costing $6 total, she had $29 left. Initial card balance was $15.",
      targetEquationTokens: ['3r', '+', '15', '=', '21'],
      availableTokens: ['3r', '+', '15', '=', '21', 'r', '-', '6'],
      options: ['$2.00', '$3.00', '$1.50', '$2.50'],
      correct: '$2.00',
      calc: "3r = 21 - 15 = 6  ➔  r = $2.00"
    },
    {
      customer: "Satay King Rush!",
      avatar: "👨‍🍳",
      story: "5 satay sticks cost $s each. With a $5 peanut sauce upgrade, the total bill was $30. Find cost s per stick!",
      targetEquationTokens: ['5s', '+', '5', '=', '30'],
      availableTokens: ['5s', '+', '5', '=', '30', 's', '25', '-'],
      options: ['$5.00', '$6.00', '$4.00', '$7.00'],
      correct: '$5.00',
      calc: "5s + 5 = 30  ➔  5s = 25  ➔  s = $5.00"
    }
  ];

  // Station Audio trigger on switch
  useEffect(() => {
    unlockAudio();
    if (activeStation === 'station1') narrate('station1_intro', 'instruction');
    if (activeStation === 'station2') narrate('station2_intro', 'instruction');
    if (activeStation === 'station3') narrate('station3_intro', 'instruction');
    setHearts(3);
    return () => {
      stopNarration();
    };
  }, [activeStation]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  // ----------------------------------------------------
  // Station 1: Advance / Solve Level
  // ----------------------------------------------------
  const handleS1NextLevel = () => {
    sounds.correct();
    onAddXP(15 * combo);
    setCombo(c => Math.min(3, c + 1));

    if (s1Level < s1Challenges.length - 1) {
      setS1Level(lvl => lvl + 1);
      setHearts(3);
    } else {
      sounds.celebration();
      triggerConfetti();
      onCompleteStation({ stationKey: 'balance', stars: 3, score: 100, badge: 'first-balance' });
    }
  };

  // ----------------------------------------------------
  // Station 2: Vault Dial Handlers
  // ----------------------------------------------------
  const handleS2CardPick = (card) => {
    unlockAudio();
    if (card.isCorrect) {
      sounds.ding();
      setS2DialRot(prev => prev + 90);
      setS2Unlocked(true);
      setS2Steps(prev => [...prev, s2Vaults[s2Level].solutionLine]);
      onAddXP(20 * combo);
      setCombo(c => Math.min(3, c + 1));

      setTimeout(() => {
        if (s2Level < s2Vaults.length - 1) {
          setS2Level(lvl => lvl + 1);
          setS2Unlocked(false);
        } else {
          sounds.celebration();
          triggerConfetti();
          onCompleteStation({ stationKey: 'undo', stars: 3, score: 100, badge: 'vault-cracker' });
        }
      }, 1400);
    } else {
      sounds.wrong();
      setS2Shake(true);
      setHearts(h => Math.max(0, h - 1));
      setCombo(1);
      setTimeout(() => setS2Shake(false), 500);
    }
  };

  // ----------------------------------------------------
  // Station 3: Hawker Stall Handlers
  // ----------------------------------------------------
  const handleS3AddToken = (token) => {
    sounds.click();
    setS3BuiltTokens(prev => [...prev, token]);
  };

  const handleS3RemoveToken = (idx) => {
    sounds.pop();
    setS3BuiltTokens(prev => prev.filter((_, i) => i !== idx));
  };

  const handleS3CheckTokens = () => {
    const cur = s3Orders[s3Level];
    const isMatched = s3BuiltTokens.join(' ') === cur.targetEquationTokens.join(' ');
    if (isMatched) {
      sounds.correct();
      setS3Phase('solve');
      onAddXP(10 * combo);
    } else {
      sounds.wrong();
      setHearts(h => Math.max(0, h - 1));
      setCombo(1);
    }
  };

  const handleS3ServeOrder = (opt) => {
    unlockAudio();
    setS3SelectedAns(opt);
    const cur = s3Orders[s3Level];
    if (opt === cur.correct) {
      sounds.ding();
      triggerConfetti();
      onAddXP(20 * combo);
      setCombo(c => Math.min(3, c + 1));

      setTimeout(() => {
        if (s3Level < s3Orders.length - 1) {
          setS3Level(lvl => lvl + 1);
          setS3Phase('build');
          setS3BuiltTokens([]);
          setS3SelectedAns(null);
          setHearts(3);
        } else {
          sounds.celebration();
          onCompleteStation({ stationKey: 'stall', stars: 3, score: 100, badge: 'hawker-hero' });
        }
      }, 1300);
    } else {
      sounds.wrong();
      setHearts(h => Math.max(0, h - 1));
      setCombo(1);
    }
  };

  const stStats = state.stationStats || {};
  const isS1Done = stStats.balance?.completed;
  const isS2Done = stStats.undo?.completed;
  const isS3Done = stStats.stall?.completed;
  const allStationsDone = isS1Done && isS2Done && isS3Done;

  return (
    <div className="glass-card stations-phase-card">
      {/* Top Header with Phase Badge and Lab Guide */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '4px' }}>
            <span>🧪 Phase 03</span> <span>· Interactive Simulation Lab</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)', fontWeight: 800 }}>
            {activeStation === 'station1' && "Station 1: Balance Lab ⚖️ Keep It Level"}
            {activeStation === 'station2' && "Station 2: Undo Machine 🔐 Crack the Vault"}
            {activeStation === 'station3' && "Station 3: Hawker Stall Rush 🍜 Solve the Order"}
          </h2>
        </div>

        {/* Station Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeStation === 'station1' ? 'btn-gold' : isS1Done ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            onClick={() => setActiveStation('station1')}
          >
            <span>⚖️ Balance Lab {isS1Done ? '✓' : ''}</span>
          </button>
          <button
            className={`btn ${activeStation === 'station2' ? 'btn-gold' : isS2Done ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            onClick={() => setActiveStation('station2')}
          >
            <span>🔐 Vault Machine {isS2Done ? '✓' : ''}</span>
          </button>
          <button
            className={`btn ${activeStation === 'station3' ? 'btn-gold' : isS3Done ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            onClick={() => setActiveStation('station3')}
          >
            <span>🍜 Hawker Rush {isS3Done ? '✓' : ''}</span>
          </button>
        </div>
      </div>

      {/* Gamification Sub-HUD (Hearts, Multiplier, Star Node Map) */}
      <div className="game-hud-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(20, 10, 44, 0.75)', border: '1px solid var(--purple-border)', borderRadius: '12px', padding: '6px 14px', marginBottom: '8px' }}>
        {/* Hearts and Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3].map(h => (
              <span key={h} style={{ fontSize: '1.2rem', filter: h <= hearts ? 'none' : 'grayscale(1) opacity(0.3)' }}>
                ❤️
              </span>
            ))}
          </div>

          <div className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '3px 8px' }}>
            🔥 Combo ×{combo}
          </div>
        </div>

        {/* 5-Node Level Map */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700 }}>LEVEL:</span>
          {[0, 1, 2, 3, 4].map(idx => {
            const curLvl = activeStation === 'station1' ? s1Level : activeStation === 'station2' ? s2Level : s3Level;
            const isCompleted = idx < curLvl;
            const isCurrent = idx === curLvl;

            return (
              <div
                key={idx}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: isCompleted ? 'var(--neon-green)' : isCurrent ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                  color: isCurrent ? '#000' : '#fff',
                  boxShadow: isCurrent ? '0 0 10px var(--gold)' : 'none'
                }}
              >
                {idx === 4 ? '👑' : idx + 1}
              </div>
            );
          })}
        </div>

        {/* Archie Voice Hint Pill */}
        <button
          className="audio-replay-pill"
          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          onClick={() => {
            unlockAudio();
            sounds.pop();
            narrate(activeStation === 'station1' ? 'station1_intro' : activeStation === 'station2' ? 'station2_intro' : 'station3_intro', 'instruction');
          }}
        >
          <span>🔊 Archie Tip</span>
        </button>
      </div>

      {/* Main Simulation Viewport (Station Content) */}
      <div style={{ minHeight: '330px', maxHeight: '380px' }}>
        {/* ================= STATION 1: BALANCE LAB ================= */}
        {activeStation === 'station1' && (
          <div className="station1-box" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--gold-bright)', fontSize: '0.95rem', fontWeight: 700 }}>
                {s1Challenges[s1Level].prompt}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleS1NextLevel}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                {s1Level === s1Challenges.length - 1 ? "Clear Station 1 🏆" : "Solve Level ➔"}
              </button>
            </div>

            <BalanceScaleCanvas
              key={`s1-scale-${s1Level}`}
              left={s1Challenges[s1Level].left}
              right={s1Challenges[s1Level].right}
              targetX={s1Challenges[s1Level].targetX}
              mode="interactive"
              showEquation={true}
              showLog={true}
              onSolve={() => {
                handleS1NextLevel();
              }}
            />
          </div>
        )}

        {/* ================= STATION 2: UNDO MACHINE ================= */}
        {activeStation === 'station2' && (
          <div className={`station2-vault-container ${s2Shake ? 'shake-anim' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px', alignItems: 'center' }}>
            {/* Vault Dial Graphics */}
            <div style={{ background: 'rgba(15, 10, 36, 0.85)', border: '2px solid var(--purple-border)', borderRadius: '18px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teal-bright)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                {s2Unlocked ? "🔓 VAULT CRACKED!" : "🔐 SECURE VAULT DIAL"}
              </div>

              {/* Rotating Gear / Vault Wheel */}
              <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 10px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: `rotate(${s2DialRot}deg)`, transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <circle cx="50" cy="50" r="44" fill="#1e1040" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6,4" />
                  <circle cx="50" cy="50" r="30" fill="#2d1b54" stroke="#06b6d4" strokeWidth="3" />
                  <line x1="50" y1="10" x2="50" y2="30" stroke="#f59e0b" strokeWidth="4" />
                  <circle cx="50" cy="50" r="10" fill="#f59e0b" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                  {s2Unlocked ? "🔓" : "🔐"}
                </div>
              </div>

              {/* Target Equation Display */}
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>LOCKED EQUATION:</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>
                  {s2Vaults[s2Level].eq}
                </div>
              </div>
            </div>

            {/* Hand of Inverse Operation Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {s2Vaults[s2Level].prompt}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {s2Vaults[s2Level].cards.map((card, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => handleS2CardPick(card)}
                    style={{ padding: '12px 10px', fontSize: '0.92rem', textAlign: 'center', fontWeight: 700 }}
                  >
                    {card.text}
                  </button>
                ))}
              </div>

              {/* Solution Line History */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '8px 12px', minHeight: '50px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Working Derivation:
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--neon-green-bright)', marginTop: '2px' }}>
                  {s2Unlocked ? s2Vaults[s2Level].solutionLine : "Pick the matching inverse card to crack the lock..."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STATION 3: HAWKER STALL RUSH ================= */}
        {activeStation === 'station3' && (
          <div className="station3-stall-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Customer Order Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 8, 36, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: '14px', padding: '10px 14px' }}>
              <div style={{ fontSize: '2.4rem' }}>{s3Orders[s3Level].avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold)' }}>
                  {s3Orders[s3Level].customer}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>
                  "{s3Orders[s3Level].story}"
                </div>
              </div>
            </div>

            {/* Step 1: Token Builder */}
            {s3Phase === 'build' && (
              <div style={{ background: 'rgba(25, 15, 55, 0.75)', borderRadius: '14px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--teal-bright)' }}>
                    TAP TILES TO BUILD THE EQUATION:
                  </span>
                  <button
                    className="btn btn-gold"
                    onClick={handleS3CheckTokens}
                    disabled={s3BuiltTokens.length < 3}
                    style={{ padding: '4px 12px', fontSize: '0.82rem' }}
                  >
                    Lock Equation ➔
                  </button>
                </div>

                {/* Built Equation Slot */}
                <div style={{ minHeight: '44px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  {s3BuiltTokens.length === 0 ? (
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>(Tap tiles below to assemble...)</span>
                  ) : (
                    s3BuiltTokens.map((tok, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleS3RemoveToken(idx)}
                        style={{ background: 'var(--gold)', color: '#000', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                      >
                        {tok} ✕
                      </span>
                    ))
                  )}
                </div>

                {/* Available Tap Tiles */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {s3Orders[s3Level].availableTokens.map((tok, idx) => (
                    <button
                      key={idx}
                      className="option-btn"
                      onClick={() => handleS3AddToken(tok)}
                      style={{ padding: '8px 16px', fontSize: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}
                    >
                      {tok}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Solve & Serve Order */}
            {s3Phase === 'solve' && (
              <div style={{ background: 'rgba(25, 15, 55, 0.75)', borderRadius: '14px', padding: '12px', border: '1px solid var(--neon-green-glow)' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--neon-green-bright)', marginBottom: '8px' }}>
                  ✓ Equation Locked: {s3BuiltTokens.join(' ')}! Now solve for the unknown to serve the order:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {s3Orders[s3Level].options.map((opt, idx) => (
                    <button
                      key={idx}
                      className={`option-btn ${s3SelectedAns === opt ? 'selected' : ''}`}
                      onClick={() => handleS3ServeOrder(opt)}
                      style={{ padding: '12px 14px', fontSize: '1.05rem', fontWeight: 800 }}
                    >
                      Serve: {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="phase-footer-row" style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          {allStationsDone
            ? "🌟 All 3 simulation labs completed! Ready for Practice Mode."
            : "Complete all stations to unlock the full Practice arena."}
        </span>

        <button
          className="btn-next-phase"
          onClick={() => {
            sounds.ding();
            onNext('practice');
          }}
        >
          <span>Next: Practice Mode ➔</span>
        </button>
      </div>
    </div>
  );
}
