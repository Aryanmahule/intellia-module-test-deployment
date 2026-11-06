# Specification: Fraction Equations (Grade 7 / Lower Secondary)

## 1. Overview & Objective
- **Title**: Algebra Quest: Fraction Equations
- **Target Audience**: Grade 7 / Secondary 1 Mathematics (aligned with Singapore MOE curriculum)
- **Theme**: Singapore Fair & Classroom setting with **Maya** (curious math student) and **Archie** (friendly orange fox companion)
- **Metaphor**: A fraction equation is like sharing slices of identical pizza or measuring tapes. A balanced scale remains level when equal fractional operations are applied to both sides.
- **Goal**: Master the foundational principles of equations involving fractions:
  1. Fractions as parts of a whole and recognizing equivalent fractions: $\frac{a}{b} = \frac{k \cdot a}{k \cdot b}$.
  2. Adding and subtracting fractions with like denominators: $\frac{a}{c} + \frac{b}{c} = \frac{a+b}{c}$.
  3. Finding common denominators (LCM) for unlike fractions: $\frac{1}{2} + \frac{1}{3} = \frac{3}{6} + \frac{2}{6} = \frac{5}{6}$.
  4. Solving 1-step and 2-step fraction equations with unknown $x$:
     - $x + \frac{1}{4} = \frac{3}{4} \implies x = \frac{2}{4} = \frac{1}{2}$
     - $\frac{x}{3} = 5 \implies x = 15$
     - $\frac{2}{3}x = 8 \implies x = 12$
  5. Translating real-world word problems into fraction equations.

---

## 2. Architecture & UI Shell
- **Viewport**: Single-screen fixed `100vh` layout (`overflow: hidden`) on all lesson phases (`wonder`, `story`, `stations`, `practice`, `reflect`, `summary`). `intro` allows smooth scrolling on mobile/compact viewports. Breakpoint: `@media (max-width: 868px)`.
- **Top Header Bar**:
  - `[ 🏠 Home ]` button (top-left) jumps back to Intro screen, stopping narration.
  - XP counter badge (`⭐ {xp} XP`) following Home button.
  - 5-Step Journey Bar (top-center):
    - `01 🌟 Wonder`
    - `02 📖 Story`
    - `03 ⚙️ Simulate`
    - `04 🎗️ Practice`
    - `05 🎗️ Reflect`
  - Audio Mute Toggle `[ 🔊 / 🔇 Muted ]` located immediately adjacent to the journey bar.
  - Cyan Square Close Button `[ ✖ ]` on the top-right.
- **Visual Design System**:
  - Deep royal purple radial gradient background (`#29104e` -> `#15062a` -> `#0c0217`)
  - Glassmorphic panels with purple border glow (`rgba(168, 85, 247, 0.35)`)
  - Accent colors: Radiant Gold (`#ffb800`), Cyan/Teal (`#00e5ff`), Coral (`#ff5e62`), Emerald (`#10b981`)
  - Typography: `Outfit` (Primary UI), `Fredoka` (Hero Titles & Badges), `Space Grotesk` (Monospace & Math variables)
  - Floating background watermarks: `54 100`, `91 11`, `66`, `30 500`, `69`, `90 347`, `x`, `a`, `n`, `200`, `123 999`, and fraction watermarks `1/2`, `3/4`, `2/3`, `5/8`, `=`, `+`, `-`.

---

## 3. Homepage & Story UI (Matching User Reference Screenshots)
- **Homepage**:
  - Top Bar: MOE Curriculum Badge + Cyan Close Button `✖`.
  - Hero Titles: White "Algebra Quest" + Glowing Yellow "Fraction Equations".
  - Mascot Speech Pill: Clickable white pill with Archie the Fox avatar ("Ready to crack the code of numbers? 🦊").
  - Learning Journey Card: 5 numbered milestones (`01 Wonder`, `02 Story`, `03 Simulate`, `04 Practice`, `05 Reflect`) with active pill on Wonder.
  - Feature Cards: 3 glass cards ("Visual Fraction Bars", "Step-by-Step Balancing", "Singapore Contexts").
  - Start Journey Button: Radiant amber gradient button ("Begin Journey 🚀").
- **Story Phase**:
  - Top Progress Bar: Slim yellow bar with `1 / 5` counter.
  - Main Card: Glassmorphic card split into:
    - Left: High quality anime illustration (Maya with mystery box at sticker stall / kitchen).
    - Right: Story title ("Maya's Sticker Stall"), story narrative paragraph, golden sparkle quote pill (`✨ "Quote" ✨ 🔊`), and white fox speech capsule.
  - Bottom Controls: `← Back` button on left, pagination dot nodes in center, and glowing golden `Next →` button on right.

---

## 4. State Management & Persistence
- **Storage Key**: `intellia_fraction_equations_v1`
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
  }
  ```

---

## 5. Question Engine & Arithmetic Integrity
- Fraction representation: `{ num: number, den: number }`.
- Arithmetic helper `gcd(a, b)` ensuring exact integer fraction reductions without IEEE-754 floating-point errors.
- 6 Question Types:
  1. `addLikeFractions`
  2. `addUnlikeFractions`
  3. `findMissingFraction`
  4. `equivalentAndSimplify`
  5. `wordProblem`
  6. `matchModel`
- Real mistake distractors: adding denominators directly (e.g. $1/2 + 1/3 = 2/5$), inverted operations, unsimplified forms.
