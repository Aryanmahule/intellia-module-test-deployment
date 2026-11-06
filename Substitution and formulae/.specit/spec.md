# Specification: Substitution and Formulae (Grade 7 / Lower Secondary)

## 1. Overview & Objective
- **Title**: Substitution and Formulae
- **Target Audience**: Grade 7 / Secondary 1 Mathematics
- **Theme**: Singapore Urban & Classroom setting with **Maya** (student) and **Ravi** (robot fox assistant / Formula Machine guide)
- **Goal**: Master evaluating algebraic expressions and calculating real-world formulae by substituting positive and negative numbers with proper order of operations (BODMAS/PEMDAS).

---

## 2. Architecture & UI Shell
- **Viewport**: Single-screen fixed `100vh` layout (`overflow: hidden`) on all lesson phases (`wonder`, `story`, `stations`, `practice`, `reflect`, `summary`). `intro` allows smooth scrolling if needed on compact screens.
- **Top Header Bar**:
  - `[ 🏠 Home ]` button (top-left) jumps to Intro screen, stopping narration.
  - 5-Step Journey Bar (top-center):
    - `01 🔮 Wonder`
    - `02 📐 Story`
    - `03 🧪 Simulate`
    - `04 🎮 Practice`
    - `05 📓 Reflect`
  - Audio Mute Toggle `[ 🔊 / 🔇 ]` located immediately adjacent to the journey bar.
- **Visual Design System**:
  - Deep space purple gradient background (`#221052` -> `#12082b` -> `#090317`)
  - Glassmorphic panels with purple border glow (`rgba(147, 112, 219, 0.3)`)
  - Accent colors: Gold (`#f59e0b`), Teal (`#06b6d4`), Coral (`#f43f5e`), Neon Green (`#10b981`)
  - Typography: `Outfit` (Primary UI), `Fredoka` (Hero Titles & Badges), `Space Grotesk` (Monospace & Math variables)
  - Floating algebra watermarks in background (`x + 3`, `2x`, `a²`, `P = 2(l + w)`, `A = ½bh`, `= 12`, `x = 4`).

---

## 3. State Management & Persistence
- **Storage Key**: `intellia_substitution_formulae_v1`
- **State Schema**:
  ```ts
  interface ModuleState {
    phase: 'intro' | 'wonder' | 'story' | 'stations' | 'practice' | 'reflect' | 'summary';
    xp: number;
    streak: number;
    highestStreak: number;
    completedPhases: string[];
    stationsProgress: {
      station1: boolean;
      station2: boolean;
      station3: boolean;
    };
    practiceStats: {
      attempted: number;
      correct: number;
      currentStreak: number;
      bestStreak: number;
    };
    reflectionAnswers: Record<string, string>;
    isMuted: boolean;
  }
  ```
- **Actions & Reducers**:
  - `SET_PHASE`, `COMPLETE_PHASE`, `ADD_XP`
  - `COMPLETE_STATION` (wires station progress & awards +50 XP)
  - `RECORD_PRACTICE` (increments attempted, correct, streak, bestStreak, awards scaled XP)
  - `SAVE_REFLECTION` (stores reflective response & awards +40 XP)
  - `TOGGLE_MUTE`, `RESET_ALL`

---

## 4. Phase Details & Content

### 4.1 Intro Screen
- Hero title: *"Substitution & Formulae"*
- Subtitle: *"Discover how rules turn numbers into answers with Maya and Ravi's Formula Machine!"*
- 3 Feature Cards:
  1. 🧮 **The Formula Machine** - Plug numbers into algebraic rules and watch them calculate instantly.
  2. 🔍 **Spot the Slips** - Master brackets, negative signs, and BODMAS order of operations.
  3. 🏙️ **Singapore in Action** - Calculate real-world taxi fares, MRT travel times, and geometric areas.
- Call to action button: *"Start Adventure 🚀"* (+25 XP start bonus)

### 4.2 Phase 01: Wonder (Curiosity Accordion)
- 3 Interactive wonder questions with speech narration by Alice:
  1. *How does a taxi meter know your fare?* (Fare rule with letters standing for distance)
  2. *Is 3x the same as 3 plus x?* (Misconception: Letters next to numbers mean multiplication)
  3. *Does a formula work for every number?* (Generality of algebraic rules)

### 4.3 Phase 02: Story (5 Visual Slides)
- 5 Story Slides with rich anime illustrations:
  1. `slide1_machine.jpg`: Ravi's Formula Machine (Variables as input hoppers)
  2. `slide2_swap.jpg`: Swap It In (Always substitute using brackets, e.g. `3(4)`)
  3. `slide3_order.jpg`: Order Matters (BODMAS: `2x² = 2(25) = 50` vs `(2x)² = 100`)
  4. `slide4_negative.jpg`: Negative Numbers, Careful! (The Bracket Shield: `(-3)² = 9` vs `-3² = -9`)
  5. `slide5_formulas.jpg`: Real Formulae in Action (Taxi fare, Temperature, Geometry)

### 4.4 Phase 03: Simulate (3 Interactive Stations)
- **Station 1: Plug It In 🧮**
  - Live interactive `FormulaMachineCanvas` with interactive variable sliders/steppers (`-10` to `10`).
  - 3 challenges (e.g. Find `x` such that `3x + 5 = 20`, evaluate `2(l + w)` with target perimeter 24, etc.).
- **Station 2: Spot the Slip 🔍**
  - Worked solutions with common student pitfalls (Concatenation, Precedence error, Missing bracket shield on negative numbers).
  - Student identifies the incorrect line, then selects the correct correction to earn points.
- **Station 3: Formulae in Singapore 🏙️**
  - Singapore landmark / everyday scenarios:
    1. ComfortDelGro Taxi Fare: $F = 4.10 + 0.60d$
    2. Marina Bay Weather Station: $F = \frac{9}{5}C + 32$
    3. Gardens by the Bay Triangle Canopy: $A = \frac{1}{2}bh$
  - Instant live calculation and feedback with audio dings.

### 4.5 Phase 04: Practice (Intelligent Question Engine)
- 6 Question Categories:
  1. `substituteOne`: One-variable linear expressions (`4x - 7`, $x=5$)
  2. `substituteMany`: Two-variable expressions ($a=3, b=-2 \implies a^2 + b^2$)
  3. `orderOfOps`: Powers and bracket precedence ($x=4 \implies 3x^2$ vs $(3x)^2$)
  4. `negatives`: Negative numbers with brackets ($x=-3 \implies -x^2$ vs $(-x)^2$)
  5. `wordFormula`: Singapore word problems ($P = 2(l+w)$, $F = 4 + 0.6d$, etc.)
  6. `spotTheSlip`: Identify the error in a multi-step algebraic simplification
- High-fidelity distractor generator targeting exact misconceptions:
  - Concatenation ($3 \cdot 4 \to 34$)
  - Ignoring precedence ($2 + 3x, x=4 \to (2+3) \cdot 4 = 20$)
  - Squaring coefficient ($2x^2, x=5 \to 100$)
  - Sign drops ($(-3)^2 \to -9$)

### 4.6 Phase 05: Reflect (Deep Thinking)
- 3 Reflective discussion questions:
  1. *Why do we put brackets around a negative number when substituting?*
  2. *Why is 2x² different from (2x)²?*
  3. *Where in daily life around Singapore have you seen a formula used?*
- User types reflection responses and receives +40 XP.

### 4.7 Summary Screen
- **Formula Master Badge** unlocked (🏆 3D Gold Glow Medal).
- Real performance metrics: Total XP, Practice Questions Attempted vs Correct, Accuracy %, Highest Streak, All Stations Completed.
- Actions: *"Practice More Questions 🎮"* or *"Restart Lesson 🔄"*.

---

## 5. Audio & Voice Specification
- **Engine**: ElevenLabs Voice "Alice" (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`.
- **Fallbacks**: Browser default synthetic voice is completely prevented; Web Audio API synthesizes crystal clear harmonic UI sounds (`pop`, `correct`, `wrong`, `celebration`, `click`, `ding`).
- **Exact Audio Matching**: Normalized text matching with zero unwanted keyword hijacking.
