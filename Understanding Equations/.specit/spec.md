# Specification: Understanding Equations (Grade 7 / Lower Secondary)

## 1. Overview & Objective
- **Title**: Algebra Quest: Understanding Equations
- **Target Audience**: Grade 7 / Secondary 1 Mathematics (aligned with MOE curriculum)
- **Theme**: Singapore Urban & Classroom setting with **Maya** (student in green blazer) and **Ravi** (orange robot fox / "The Balance Keeper" with cyan eyes)
- **Metaphor**: An equation is a balanced scale. Whatever operation you apply to one side, you must apply to the exact same extent to the other side to preserve equality.
- **Goal**: Master the foundational concepts of equations vs. expressions, the true meaning of the equals sign ($=$), solving 1-step and 2-step linear equations with integer solutions using inverse operations, checking answers via substitution, and translating real-world Singapore word scenarios into solvable algebraic equations.

---

## 2. Architecture & UI Shell
- **Viewport**: Single-screen fixed `100vh` layout (`overflow: hidden`) on all lesson phases (`wonder`, `story`, `stations`, `practice`, `reflect`, `summary`). `intro` allows smooth scrolling on mobile/compact viewports. Breakpoint: `@media (max-width: 868px)`.
- **Top Header Bar**:
  - `[ 🏠 Home ]` button (top-left) jumps back to Intro screen, stopping narration.
  - 5-Step Journey Bar (top-center):
    - `01 🔮 Wonder`
    - `02 📐 Story`
    - `03 🧪 Simulate`
    - `04 🎮 Practice`
    - `05 📓 Reflect`
  - Audio Mute Toggle `[ 🔊 / 🔇 ]` located immediately adjacent to the journey bar.
- **Visual Design System**:
  - Deep space purple gradient background (`#221052` -> `#12082b` -> `#090317`)
  - Glassmorphic panels with purple border glow (`rgba(147, 112, 219, 0.35)`)
  - Accent colors: Gold (`#f59e0b`), Teal (`#06b6d4`), Coral (`#f43f5e`), Neon Green (`#10b981`)
  - Typography: `Outfit` (Primary UI), `Fredoka` (Hero Titles & Badges), `Space Grotesk` (Monospace & Math variables)
  - Floating background watermarks: `54/100`, `91/11`, `66`, `30/500`, `69`, `90/347`, `x`, `a`, `n`, `200`, `123/999`, and equation watermarks `x + 3 = 8`, `2x = 8`, `x = 4`, `⚖️`.

---

## 3. State Management & Persistence
- **Storage Key**: `intellia_understanding_equations_v1`
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
  - `COMPLETE_STATION`: records completion of individual stations and awards +50 XP.
  - `RECORD_PRACTICE`: records attempted, correct, streak, highest streak, and awards scaled XP (+15 XP + streak bonus).
  - `SAVE_REFLECTION`: stores student reflection responses and awards +40 XP.
  - `TOGGLE_MUTE`, `RESET_ALL`.

---

## 4. Phase Details & Content

### 4.1 Intro Screen (Exact Match to Reference UI)
- Top Bar: `✨ MOE Curriculum · Grade 7` pill badge + `✕` close button.
- Hero Title:
  - `Algebra Quest` (White, Fredoka bold)
  - `Understanding Equations` (Radiant yellow glow, Fredoka bold)
- Mascot Pill: Circular avatar with orange fox (`🦊`) + white speech pill: `Ready to crack the code of numbers? 🔒` / `Ready to balance the scales of algebra? ⚖️` (clickable with voice audio).
- Mission Subtitle: *"Join Archie & Maya on a mission to write, simplify, and solve algebraic equations using balance scales, inverse operations, and real-life mysteries!"*
- Learning Journey Glass Card:
  - Top Label: `YOUR LEARNING JOURNEY` (yellow monospace)
  - Row 1: `🔍 Wonder (Spark curiosity)` $\to$ `📖 Story (Hear the tale)` $\to$ `🧪 Simulate (Explore & discover)`
  - Row 2: `🎮 Practice (Test your skills)` $\to$ `📝 Reflect (What did you learn?)`
- Call to Action Button: `🚀 Begin Your Journey!` (Large orange-gold gradient with glowing shadow).
- Bottom 3 Feature Cards:
  1. Blue Badge `Letters & Terms`: Balance Scales & Unknowns
  2. Red Badge `Simulations`: Interactive Scale & Undo Labs
  3. Gold Badge `Game Worlds`: XP, Streaks & Balance Master Trophy

### 4.2 Phase 01: Wonder (Curiosity Accordion)
- 3 interactive mystery cards with spoken narration by Alice:
  1. **What does the equals sign really mean?** (Equals means both sides have identical balance value, not just "compute the answer next").
  2. **Can you change only one side of an equation?** (No! Changing one side tilts the scale; you must perform the identical operation on both sides).
  3. **How can you be sure your answer is right?** (Substitute the solution back into the original equation; if both sides evaluate to the same value, it's proven correct).

### 4.3 Phase 02: Story (5 Visual Slides)
- 5 Story Slides with rich illustrations:
  1. `slide1_scale.jpg`: **Ravi's Balance Scale** — Equals = same value; Expression (`x + 3`) vs Equation (`x + 3 = 8`).
  2. `slide2_test.jpg`: **Is It True?** — A solution is a value making both sides true; test by substituting $x = 5$ ($5 + 3 = 8 \checkmark$).
  3. `slide3_undo.jpg`: **Undo It!** — Inverse operations for 1-step equations ($+ \leftrightarrow -$, $\times \leftrightarrow \div$).
  4. `slide4_balance.jpg`: **Keep the Balance** — Two-step equations: undo addition/subtraction first, then multiplication/division ($2x + 3 = 11 \to 2x = 8 \to x = 4$).
  5. `slide5_words.jpg`: **Words Become Equations** — Translating spoken clues into equations ("Double a number, add 5, get 17" $\to 2x + 5 = 17 \to x = 6$).

### 4.4 Phase 03: Simulate (3 Interactive Stations)
- **Station 1: Balance the Scale ⚖️**
  - Live interactive `BalanceScaleCanvas` with mystery bags ($x$, $2x$) and unit blocks.
  - Interactive beam physics: tilts dynamically when sides are unequal, balances level when equal.
  - Operations $+$, $-$, $\times$, $\div$ applied to both sides.
  - Tutorial round demonstrating what happens if an operation is applied to one side only.
  - 3 challenges: One-step addition ($x + 4 = 9$), one-step multiplication ($3x = 12$), two-step ($2x + 3 = 11$).
- **Station 2: Undo & Fix 🔧**
  - Spot the error in Ravi's working (wrong inverse, applying operation to one side only, wrong precedence).
  - Select the correct algebraic step to isolate the variable $x$.
- **Station 3: Equations in Singapore 🏙️**
  - Singapore real-world contextual challenges:
    1. MRT Card Top-Up: Initial balance + 3 rides of $\$1.50 = \$15.00$
    2. Hawker Centre Bill Sharing: 4 friends share chicken rice plus $\$6$ drinks total $=\$26$
    3. Marina Bay Floating Stage: $2x + 10 = 50$ seating rows.

### 4.5 Phase 04: Practice (Intelligent Question Engine)
- 6 Question Categories:
  1. `isSolution`: Is It True? (Test candidate solutions by substitution)
  2. `oneStep`: Undo It (Solve 1-step linear equations: $x + a = b$, $ax = b$, $x - a = b$, $x / a = b$)
  3. `twoStep`: Two Steps (Solve 2-step equations: $ax + b = c$, $ax - b = c$, $(x+b)/a = c$)
  4. `balanceStep`: Keep the Balance (Choose the correct operation to apply to both sides)
  5. `formEquation`: Words to Equation (Translate English clues to algebraic equations)
  6. `wordProblem`: Real-World Singapore contexts
- Authentic distractor generation modeling student misconceptions (wrong inverse, sign flips, one-sided operations, bracket misplacements).
- Backwards integer construction ensuring whole-number solutions.

### 4.6 Phase 05: Reflect (Deep Thinking)
- 3 Reflective prompts:
  1. *Why must you do the exact same operation to both sides of an equation?*
  2. *How does substituting your answer back into the equation prove it is correct?*
  3. *What is the fundamental difference between an algebraic expression and an equation?*
- Student types responses and earns +40 XP.

### 4.7 Summary Screen
- Unlocks the **Balance Master Badge** (3D gold medal with glowing aura).
- Real performance metrics: Total XP, Practice Accuracy %, Best Streak, Simulation Stations Completed.
- Actions: *"Practice More Questions"* or *"Restart Lesson"*.

---

## 5. Audio & Voice Specification
- **Voice**: "Alice" (`Xb7hH8MSUJpSbSDYk0k2`), ElevenLabs `eleven_multilingual_v2`.
- **Narration rule**: Only body text is spoken, never headings or raw mathematical equations. Spoken text spells out maths in words ("x plus three equals eight").
- **Web Audio API**: Real-time synthesized harmonic sound effects (`pop`, `correct`, `wrong`, `celebration`, `click`, `ding`).
- **SpeechSynthesis Fallback**: Natural speech synthesis fallback for offline/preview environments.
