import React, { useState, useEffect } from 'react';
import RateRaceCanvas from './RateRaceCanvas.jsx';
import FeedbackModal from './FeedbackModal.jsx';
import { STATIONS_NARRATION } from '../../utils/ratesNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StationsPhase({ state, onNext, onCompleteStation, onAddXP }) {
  const [activeStation, setActiveStation] = useState('station1');

  // Station 1 State
  const [s1Round, setS1Round] = useState(0);
  const [s1Completed, setS1Completed] = useState(state.stationsProgress.station1);

  // Station 2 State
  const [s2Round, setS2Round] = useState(0);
  const [s2Completed, setS2Completed] = useState(state.stationsProgress.station2);

  // Station 3 State
  const [s3Round, setS3Round] = useState(0);
  const [s3Completed, setS3Completed] = useState(state.stationsProgress.station3);

  // Modal feedback
  const [modalData, setModalData] = useState({ isOpen: false, isCorrect: true, title: '', message: '', hint: '' });

  // Play narration on station switch
  useEffect(() => {
    unlockAudio();
    if (activeStation === 'station1') {
      narrate(STATIONS_NARRATION.station1.spoken, STATIONS_NARRATION.station1.style);
    } else if (activeStation === 'station2') {
      narrate(STATIONS_NARRATION.station2.spoken, STATIONS_NARRATION.station2.style);
    } else if (activeStation === 'station3') {
      narrate(STATIONS_NARRATION.station3.spoken, STATIONS_NARRATION.station3.style);
    }
    return () => {
      stopNarration();
    };
  }, [activeStation]);

  // Station 1: Per One Challenges
  const s1Challenges = [
    {
      title: "Scale Down to Unit Rate",
      scenario: "At the supermarket tuckshop, 6 bottles of fruit tea cost $9.00.",
      question: "What is the unit price for 1 bottle?",
      canvasMode: 'doubleLine',
      quantities: { a: { value: 6, unit: 'bottles' }, b: { value: 9, unit: '$' } },
      options: [
        { label: '$1.50 per bottle', isCorrect: true },
        { label: '$0.67 per bottle', isCorrect: false, slip: 'Divided bottles by dollars instead of dollars by bottles.' },
        { label: '$1.80 per bottle', isCorrect: false, slip: 'Calculation error.' }
      ],
      explanation: "Divide both 6 bottles and $9.00 by 6: $9.00 ÷ 6 = $1.50 per bottle!"
    },
    {
      title: "Scale Movie Ticket Rates",
      scenario: "A group of 4 students pay a total of $48.00 for cinema tickets.",
      question: "What is the cost per student ticket?",
      canvasMode: 'doubleLine',
      quantities: { a: { value: 4, unit: 'tickets' }, b: { value: 48, unit: '$' } },
      options: [
        { label: '$12.00 per ticket', isCorrect: true },
        { label: '$8.00 per ticket', isCorrect: false, slip: '48 ÷ 6 instead of 48 ÷ 4.' },
        { label: '$14.00 per ticket', isCorrect: false, slip: 'Calculation slip.' }
      ],
      explanation: "$48.00 ÷ 4 tickets = $12.00 per ticket."
    },
    {
      title: "Best Buy Challenge",
      scenario: "Compare two packages of Jasmine Rice at FairPrice:",
      question: "Which bag is the true Better Buy?",
      canvasMode: 'compare',
      offers: [
        { name: 'Bag A (5 kg)', qty: 5, unit: 'kg', price: 12.50 },
        { name: 'Bag B (2 kg)', qty: 2, unit: 'kg', price: 6.00 }
      ],
      options: [
        { label: '5 kg bag for $12.50 ($2.50/kg)', isCorrect: true },
        { label: '2 kg bag for $6.00 ($3.00/kg)', isCorrect: false, slip: '$6 is a smaller total price, but costs more per kg!' },
        { label: 'Both offer the same value', isCorrect: false, slip: 'Unit rates differ: $2.50/kg vs $3.00/kg.' }
      ],
      explanation: "Bag A costs $12.50 ÷ 5 = $2.50/kg, while Bag B costs $6.00 ÷ 2 = $3.00/kg. Bag A is cheaper per kilogram!"
    }
  ];

  // Station 2: Race Track Challenges
  const s2Challenges = [
    {
      title: "Speed Trio: Distance",
      scenario: "Ravi's electric race car travels at a constant speed of 60 km/h for 2.5 hours.",
      question: "How far does the car travel along the track?",
      canvasMode: 'trip',
      trip: { speed: 60, speedUnit: 'km/h', time: 2.5 },
      options: [
        { label: '150 km', isCorrect: true },
        { label: '120 km', isCorrect: false, slip: '60 × 2 = 120 km (missed the 0.5 hours).' },
        { label: '24 km', isCorrect: false, slip: 'Divided 60 ÷ 2.5 instead of multiplying.' }
      ],
      explanation: "Distance = Speed × Time = 60 km/h × 2.5 h = 150 km!"
    },
    {
      title: "Speed Trio: Finding Speed",
      scenario: "A high-speed camera records an RC racer completing 180 km in 2 hours.",
      question: "What is the speed of the racer?",
      canvasMode: 'trip',
      trip: { speed: 90, speedUnit: 'km/h', time: 2 },
      options: [
        { label: '90 km/h', isCorrect: true },
        { label: '360 km/h', isCorrect: false, slip: 'Multiplied distance by time instead of dividing.' },
        { label: '85 km/h', isCorrect: false, slip: 'Calculation slip.' }
      ],
      explanation: "Speed = Distance ÷ Time = 180 km ÷ 2 h = 90 km/h."
    },
    {
      title: "Unit Conversion Chain",
      scenario: "A sports car speedometer displays 72 km/h on the highway straight.",
      question: "Convert 72 km/h into metres per second (m/s):",
      canvasMode: 'convert',
      convert: { value: 72, from: 'km/h', to: 'm/s' },
      options: [
        { label: '20 m/s', isCorrect: true },
        { label: '259.2 m/s', isCorrect: false, slip: 'Multiplied by 3.6 instead of dividing.' },
        { label: '72,000 m/s', isCorrect: false, slip: 'Only multiplied by 1,000 and forgot to divide by 3,600 s.' }
      ],
      explanation: "72 km/h = 72,000 m ÷ 3,600 s = 20 m/s (Shortcut: 72 ÷ 3.6 = 20 m/s)!"
    }
  ];

  // Station 3: Rates in Singapore Challenges
  const s3Challenges = [
    {
      title: "Coordinate Graph Slope",
      scenario: "Maya plots the distance of a train over time. The line passes through (0,0), (1, 60), (2, 120), (3, 180).",
      question: "What is the unit rate represented by the slope of the line?",
      canvasMode: 'graph',
      options: [
        { label: '60 km/h', isCorrect: true },
        { label: '180 km/h', isCorrect: false, slip: 'Read the highest y value instead of rise ÷ run.' },
        { label: '0.017 h/km', isCorrect: false, slip: 'Inverted ratio (run ÷ rise).' }
      ],
      explanation: "Slope = Rise ÷ Run = (120 - 60) ÷ (2 - 1) = 60 ÷ 1 = 60 km/h! The slope is the unit rate."
    },
    {
      title: "Maxwell Hawker Centre Rate",
      scenario: "A famous roast meat stall sells duck at $3.20 per 100 g.",
      question: "A family orders 500 g of roast duck. How much does it cost?",
      canvasMode: 'doubleLine',
      quantities: { a: { value: 500, unit: 'grams' }, b: { value: 16, unit: '$' } },
      options: [
        { label: '$16.00', isCorrect: true },
        { label: '$15.00', isCorrect: false, slip: 'Calculation error.' },
        { label: '$32.00', isCorrect: false, slip: 'Multiplied by 10 instead of 5.' }
      ],
      explanation: "500 g has five 100 g portions: 5 × $3.20 = $16.00!"
    },
    {
      title: "Singapore Express Bus Journey",
      scenario: "An express bus travels 45 km from Jurong to Changi Airport in 45 minutes.",
      question: "What is the average speed of the bus in km/h?",
      canvasMode: 'trip',
      trip: { speed: 60, speedUnit: 'km/h', time: 0.75 },
      options: [
        { label: '60 km/h', isCorrect: true },
        { label: '45 km/h', isCorrect: false, slip: 'Assumed 45 minutes equals 1 hour.' },
        { label: '100 km/h', isCorrect: false, slip: '45 ÷ 0.45 = 100 (treated 45 min as 0.45 h instead of 0.75 h).' }
      ],
      explanation: "45 minutes = 45/60 hours = 0.75 h. Speed = 45 km ÷ 0.75 h = 60 km/h!"
    }
  ];

  const handleSelectOption = (opt, currentChallenge, stationType) => {
    sounds.click();

    if (opt.isCorrect) {
      sounds.correct();
      setModalData({
        isOpen: true,
        isCorrect: true,
        title: 'Spot On! ✓',
        message: currentChallenge.explanation,
        hint: ''
      });

      if (stationType === 's1') {
        if (s1Round < s1Challenges.length - 1) {
          setS1Round(r => r + 1);
        } else {
          setS1Completed(true);
          onCompleteStation('station1');
          onAddXP(50);
        }
      } else if (stationType === 's2') {
        if (s2Round < s2Challenges.length - 1) {
          setS2Round(r => r + 1);
        } else {
          setS2Completed(true);
          onCompleteStation('station2');
          onAddXP(50);
        }
      } else if (stationType === 's3') {
        if (s3Round < s3Challenges.length - 1) {
          setS3Round(r => r + 1);
        } else {
          setS3Completed(true);
          onCompleteStation('station3');
          onAddXP(50);
        }
      }
    } else {
      sounds.wrong();
      setModalData({
        isOpen: true,
        isCorrect: false,
        title: 'Check the Units & Working! ✗',
        message: opt.slip || 'Divide to find the amount per one, and check that your units match.',
        hint: currentChallenge.explanation
      });
    }
  };

  const allStationsDone = s1Completed && s2Completed && s3Completed;

  // Current active challenge
  let currentChallenge = null;
  let currentRound = 0;
  let totalRounds = 3;
  let isCurrentStationCompleted = false;

  if (activeStation === 'station1') {
    currentChallenge = s1Challenges[s1Round];
    currentRound = s1Round;
    isCurrentStationCompleted = s1Completed;
  } else if (activeStation === 'station2') {
    currentChallenge = s2Challenges[s2Round];
    currentRound = s2Round;
    isCurrentStationCompleted = s2Completed;
  } else {
    currentChallenge = s3Challenges[s3Round];
    currentRound = s3Round;
    isCurrentStationCompleted = s3Completed;
  }

  return (
    <div className="glass-card stations-phase-card">
      <FeedbackModal
        isOpen={modalData.isOpen}
        isCorrect={modalData.isCorrect}
        title={modalData.title}
        message={modalData.message}
        hint={modalData.hint}
        onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Top Header & Station Navigation Tabs */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '4px' }}>
            <span>🧪 Phase 03</span> <span>• Simulate Labs</span>
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Interactive Rate Labs
          </h2>
        </div>

        {/* 3 Station Selection Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn-secondary ${activeStation === 'station1' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setActiveStation('station1'); }}
            style={{
              padding: '8px 16px',
              borderColor: s1Completed ? 'var(--neon-green)' : (activeStation === 'station1' ? 'var(--gold-bright)' : undefined)
            }}
          >
            <span>🧮 Station 1: Per One</span>
            {s1Completed && <span style={{ color: 'var(--neon-green)', marginLeft: '6px' }}>✓</span>}
          </button>

          <button
            className={`btn-secondary ${activeStation === 'station2' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setActiveStation('station2'); }}
            style={{
              padding: '8px 16px',
              borderColor: s2Completed ? 'var(--neon-green)' : (activeStation === 'station2' ? 'var(--gold-bright)' : undefined)
            }}
          >
            <span>🏁 Station 2: Race Track</span>
            {s2Completed && <span style={{ color: 'var(--neon-green)', marginLeft: '6px' }}>✓</span>}
          </button>

          <button
            className={`btn-secondary ${activeStation === 'station3' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setActiveStation('station3'); }}
            style={{
              padding: '8px 16px',
              borderColor: s3Completed ? 'var(--neon-green)' : (activeStation === 'station3' ? 'var(--gold-bright)' : undefined)
            }}
          >
            <span>🏙️ Station 3: Singapore Rates</span>
            {s3Completed && <span style={{ color: 'var(--neon-green)', marginLeft: '6px' }}>✓</span>}
          </button>
        </div>
      </div>

      {/* Main Lab Layout: Simulation Canvas Left + Interactive Problem Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '20px',
        alignItems: 'stretch',
        margin: '12px 0'
      }}>
        {/* Left: Dynamic Rate Race Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <RateRaceCanvas
            mode={currentChallenge.canvasMode}
            quantities={currentChallenge.quantities}
            offers={currentChallenge.offers}
            trip={currentChallenge.trip}
            convert={currentChallenge.convert}
          />
        </div>

        {/* Right: Challenge Details & Multiple Choice Options */}
        <div style={{
          background: 'rgba(28, 22, 64, 0.78)',
          border: '1.5px solid var(--purple-border)',
          borderRadius: '20px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-teal" style={{ fontSize: '0.8rem' }}>
                Round {currentRound + 1} of {totalRounds}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--gold-bright)', fontWeight: 700 }}>
                +50 XP for Station
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              {currentChallenge.title}
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px' }}>
              {currentChallenge.scenario}
            </p>

            <div style={{
              background: 'rgba(34, 211, 238, 0.1)',
              borderLeft: '3px solid var(--teal-bright)',
              padding: '8px 12px',
              borderRadius: '0 8px 8px 0',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '14px'
            }}>
              {currentChallenge.question}
            </div>

            {/* Answer Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentChallenge.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt, currentChallenge, activeStation === 'station1' ? 's1' : (activeStation === 'station2' ? 's2' : 's3'))}
                  style={{
                    background: 'rgba(38, 30, 84, 0.85)',
                    border: '1.5px solid var(--purple-border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-main)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold-bright)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--purple-border)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span>{opt.label}</span>
                  <span style={{ color: 'var(--teal-bright)' }}>➔</span>
                </button>
              ))}
            </div>
          </div>

          {/* Station Completion Notice */}
          {isCurrentStationCompleted && (
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--neon-green)',
              borderRadius: '10px',
              color: 'var(--neon-green)',
              fontSize: '0.9rem',
              fontWeight: 700,
              textAlign: 'center'
            }}>
              ✓ Station Mastered! Explore other stations or proceed.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          {allStationsDone
            ? '✓ All 3 stations completed! Ready for the Practice Arena.'
            : `Stations completed: ${(s1Completed ? 1 : 0) + (s2Completed ? 1 : 0) + (s3Completed ? 1 : 0)} of 3`}
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            sounds.click();
            onNext();
          }}
          disabled={!allStationsDone}
          style={{
            opacity: allStationsDone ? 1 : 0.5,
            cursor: allStationsDone ? 'pointer' : 'not-allowed',
            padding: '12px 32px'
          }}
        >
          <span>Enter Practice Arena</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
