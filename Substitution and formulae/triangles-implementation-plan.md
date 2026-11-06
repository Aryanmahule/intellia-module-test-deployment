# Implementation Plan: "Types of Triangles" — Same UI, Same Navbar, Same Voice

Cloned from `Multplication-With-Repated-Addition-master`. This plan reuses the app's exact
architecture, design system, component tree, and audio pipeline — only the **content**
(narration text, visuals, question bank) changes to teach **Types of Triangles**
(equilateral, isosceles, scalene, right-angled — classification by sides and angles).

Voice to reuse (unchanged): **ElevenLabs voice ID `Xb7hH8MSUJpSbSDYk0k2`** ("Alice"),
same `model_id: eleven_multilingual_v2`, same per-style `voice_settings` presets.

---

## 1. What "same UI / same navbar" actually means in this codebase

There's no traditional `<nav>` — the persistent chrome is three fixed elements, defined in
`index.css` and rendered from `App.jsx`. Reuse verbatim, no restyling:

| Element | Class | Behavior |
|---|---|---|
| Audio toggle | `.audio-toggle-btn` | Fixed top-right circle, 🔊/🔇, calls `stopNarration()` on mute |
| Home button | `.home-btn` | Fixed top-left pill, "🏠 Home", hidden on `intro`/`summary` |
| Journey bar | `.journey-bar` + `.journey-step*` | Fixed top-center pill, 5 numbered steps (dot fills gold when active, green ✓ when completed), connected by `.journey-connector` lines |

The 5-step journey (icon/label) is the only thing that changes per-lesson:

```js
const PHASES = [
  { id: 'wonder',   label: 'Wonder',   icon: '🔮', num: '01' },
  { id: 'story',    label: 'Story',    icon: '📐', num: '02' },   // was 📖
  { id: 'stations', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'practice', label: 'Play',     icon: '🎮', num: '04' },
  { id: 'reflect',  label: 'Reflect',  icon: '📓', num: '05' },
];
```

Everything else — colors, fonts, blur, border-radius, button styles, `.glass-card`,
`.feature-cards`, `.speech-bubble`, `.mascot`, animations — is **copied byte-for-byte**
from `src/index.css` (542 lines). Zero changes needed to the design system.

---

## 2. Project setup

```bash
npx degit <same-repo-or-template> types-of-triangles
cd types-of-triangles
```

Reuse as-is (copy unmodified):
- `vite.config.js`, `vercel.json`, `package.json` (rename `name` field only)
- `api/elevenlabs.js` — no changes at all
- `src/index.css` — no changes at all
- `src/main.jsx`
- `src/utils/audio.js` — no changes (voice ID, style presets, `narrate()`/`speak()` engine all stay)
- `src/components/multiplication/FloatingNumbers.jsx` → rename dir/copy as `GeoFloatingShapes.jsx` optionally, or keep floating numbers as-is (they're decorative, topic-agnostic) — **simplest: keep unchanged**

Rename the topic folder: `src/components/multiplication/` → `src/components/triangles/`.

---

## 3. File-by-file mapping (multiplication → triangles)

| Original | New | What changes |
|---|---|---|
| `App.jsx` | `App.jsx` | `PHASES` labels/icons, `STORAGE_KEY`, imports point to `triangles/` |
| `utils/multiplicationNarration.js` | `utils/trianglesNarration.js` | All text rewritten for triangle content (see §4) |
| `utils/multiplicationQuestionEngine.js` | `utils/trianglesQuestionEngine.js` | New question generators (see §6) |
| `utils/audioMap.js` | `utils/audioMap.js` | Regenerated from new phrase list |
| `state/multiplicationProgress.js` | `state/trianglesProgress.js` | Same reducer shape, `phase` enum unchanged, XP/streak logic unchanged |
| `components/multiplication/IntroScreen.jsx` | `components/triangles/IntroScreen.jsx` | Title, badge text, journey step descriptions |
| `components/multiplication/WonderPhase.jsx` | same name | New wonder Q&A pairs, new bg emoji set (📐🔺📏✨🔍) |
| `components/multiplication/StoryPhase.jsx` | same name | New 4-slide story (see §5), new images |
| `components/multiplication/GroupSimulationCanvas.jsx` | `TriangleSimulationCanvas.jsx` | Renders SVG triangles instead of emoji groups (see §7) |
| `components/multiplication/StationsPhase.jsx` | same name | 3 new stations (see §8) |
| `components/multiplication/QuestionCard.jsx` | same name | New `TYPE_LABELS`/`TYPE_COLORS`, renders `TriangleSimulationCanvas` |
| `components/multiplication/PracticeMode.jsx` | same name | Same 100-question flow, pulls from new engine |
| `components/multiplication/ReflectCheck.jsx` | same name | New reflection prompts |
| `components/multiplication/SummaryScreen.jsx` | same name | New closing copy |
| `public/images/story_*.png` | `public/images/tri_*.png` | 4 new illustrations (see §5) |
| `scripts/generate_audio.js` | same name | New `phrases[]` array (full text list, see §9) |

---

## 4. Content model: what Alice's stickers become

The multiplication module used **Alice + equal groups** as its concrete model. Triangles
needs its own consistent through-line character/motif. Recommended: **"Ravi the Robot
Surveyor"** (reuse the same 🤖 mascot emoji already styled in `.mascot`) who measures
shapes around Singapore.

Core teaching points to script narration around (Singapore MOE P4/P5 Geometry syllabus,
"Properties of Triangles"):

1. A triangle has 3 sides and 3 angles that always add up to 180°.
2. **By sides**: Equilateral (3 equal sides, 3 equal 60° angles), Isosceles (2 equal
   sides, 2 equal base angles), Scalene (no equal sides, no equal angles).
3. **By angles**: Right-angled (one 90° angle), Acute (all angles < 90°), Obtuse (one
   angle > 90°).
4. A triangle can be named by both a side-property and an angle-property at once (e.g.
   "right-angled isosceles triangle").
5. Real-world contexts (parallel the original's hawker-centre/MRT motifs): road signs,
   roof trusses at HDB void decks, the Merlion's fin, a slice of pizza, a set-square in a
   pencil case, bunting/flags.

---

## 5. Story Phase — 4 slides (parallels the original's 4-slide arc)

| Slide | Title | Teaching beat |
|---|---|---|
| 1 | "Ravi's Toolbox" | Ravi opens his geometry set-squares — one is equilateral-shaped, one is a 30-60-90 right triangle. Sets up the wonder. |
| 2 | "Sides Tell a Story" | Introduces equal-sides classification: equilateral / isosceles / scalene, with a ruler-measuring visual. |
| 3 | "Angles Tell a Story" | Introduces angle classification: right / acute / obtuse, with a protractor visual. |
| 4 | "Naming a Triangle" | Combines both — e.g. "this is a right-angled isosceles triangle" — mirrors the original's "4×3 = 4+4+4, they're the same!" payoff beat. |

New images needed (same aspect/style as the 4 existing `story_*.png`):
`tri_toolbox.png`, `tri_measuring_sides.png`, `tri_measuring_angles.png`,
`tri_naming_triangle.png`.

---

## 6. Practice question engine — 6 question types

Mirrors the original's 6-type structure (`groupsToAddition`, `additionToMultiplication`,
`multiplicationToTotal`, `multiplicationToAddition`, `wordProblem`, `matchPicture`) with
a 1:1 triangle-domain analogue:

| Original type | Triangle analogue | What it asks |
|---|---|---|
| `groupsToAddition` | `sidesToClassify` | Given a rendered triangle with side-length tick marks, classify as equilateral/isosceles/scalene |
| `additionToMultiplication` | `anglesToClassify` | Given a rendered triangle with an angle marked/labelled, classify as right/acute/obtuse |
| `multiplicationToTotal` | `findMissingAngle` | Given 2 of 3 angles, find the third (sum = 180°) |
| `multiplicationToAddition` | `dualClassify` | Given a triangle, pick the combined name (e.g. "right-angled scalene") |
| `wordProblem` | `wordProblem` | Singapore-context scenario ("The set-square in your pencil box has a 90°, 60°, 30° angle — what shape is it?") |
| `matchPicture` | `matchPicture` | Match a named triangle type to the correct rendered shape among 4 options |

Distractor-generation strategy (parallels the original's "off-by-one-group /
off-by-group-size" plausible wrongs):
- For `findMissingAngle`: distractors = correct ± 10°, correct ± 20°, and 180° − sum
  (common subtraction slip).
- For classification types: distractors = the other two categories in that axis, plus one
  "looks right but isn't" near-equilateral scalene trap.

`SG_SCENES` array reused/extended with triangle-relevant settings: void-deck roof
trusses, road warning signs, a slice of *roti prata*, bunting at a school event, the
sail of a *bumboat*, a wedge of *kueh*.

Difficulty/adaptive-bias logic, XP/streak scoring, and the `worldResults` progress shape
in the reducer carry over **unchanged**.

---

## 7. Replacing `GroupSimulationCanvas` → `TriangleSimulationCanvas`

The original renders repeated emoji groups + text sentences. The triangle version needs
an actual **SVG triangle renderer** with props:

```jsx
<TriangleSimulationCanvas
  sideA={5} sideB={5} sideC={3}        // determines equilateral/isosceles/scalene
  angleA={70} angleB={70} angleC={40}  // determines right/acute/obtuse
  mode="display" | "build" | "interactive"
  showTickMarks        // equal-side tick notation
  showAngleArcs         // angle arc + degree labels
  showSideLengths        // numeric side labels
  theme="classroom" | "outdoor" | "toolbox"
/>
```

Implementation notes:
- Compute vertex coordinates from side lengths via the law of cosines (or just hardcode
  a small library of ~12 canonical triangle shapes spanning all 6 categories — simpler,
  and matches the original's approach of randomizing from a small discrete parameter
  space (`GROUP_SIZES`/`GROUP_COUNTS` arrays) rather than fully continuous generation).
- Equal-side tick marks: 1 tick / 2 ticks / 3 ticks rendered as small perpendicular
  hashes at each side's midpoint (standard geometry notation).
- Right-angle marker: small square at the vertex instead of an arc, when angle = 90°.
- Keep the same `sounds.pop()` / `sounds.correct()` audio-cue calls on interaction.

---

## 8. Stations Phase — 3 mini-simulations (parallels the original's 3 stations)

| Station | Original analogue | Triangle version |
|---|---|---|
| 1: "Build the Groups" | Tap to add equal groups | **"Measure the Sides"** — drag/tap a virtual ruler across each side, tick marks appear, canvas reveals the side-classification once all 3 are measured |
| 2: "Match the Sentence" | Connect addition ↔ × | **"Match the Name"** — drag a triangle card onto the correct classification bucket (Equilateral / Isosceles / Scalene lane, then a second round for Right / Acute / Obtuse) |
| 3: "Real-World Scenes" | Equal groups around us | **"Spot It in Singapore"** — real-world photo/illustration scenes (road sign, roof truss, pizza slice); tap the triangle-shaped object and classify it |

Same completion pattern: `done` state → celebration narration → "Try Another!" (up to 2
rounds) → "Next Station!".

---

## 9. Audio pipeline — reuse exactly, regenerate content

No code changes to `audio.js`, `api/elevenlabs.js`, or the `getElevenLabsSettings()`
style-preset table. Steps:

1. Write the full narration phrase list in `scripts/generate_audio.js` (mirrors the
   original's ~72-phrase array), organized by section comment blocks:
   `INTRO / WONDER / STORY / STATIONS / REFLECT / PRACTICE STEMS / PRACTICE FEEDBACK /
   WORD PROBLEMS / SUMMARY / WORLD INTROS`.
2. Keep the same rule: **only body/question text is spoken — never titles, headings, or
   raw numeric/degree values that are shown visually** (matches the original's explicit
   comment: *"Numeric values are NOT spoken in question stems; they are displayed
   visually"*).
3. Run `npm run gen-audio` with `ELEVENLABS_API_KEY` set → produces
   `public/assets/audio/triangles/*.mp3` + auto-writes `src/utils/audioMap.js`.
4. Voice ID stays `Xb7hH8MSUJpSbSDYk0k2`; same `voice_settings` per style
   (`statement` / `question` / `encouragement` / `celebration` / `emphasis` / `thinking`
   / `instruction`) — copy the `getElevenLabsSettings()` function unchanged into the
   script and into `audio.js`.
5. `npm run clean-audio` reused unchanged for pruning stale files.

---

## 10. Build sequence (suggested order of work)

1. Scaffold project, copy all topic-agnostic files (§2) unchanged — confirm the empty
   shell already *looks and behaves* identically (navbar, journey bar, audio toggle,
   fonts, background) before writing any triangle content.
2. Write `trianglesNarration.js` + `IntroScreen.jsx` + `WonderPhase.jsx` — get the intro
   flow narrating correctly (temporarily reuse browser TTS or a placeholder audioMap
   entry while iterating, before spending ElevenLabs credits).
3. Build `TriangleSimulationCanvas.jsx` in isolation (Storybook-less: just a throwaway
   test route) with the ~12 canonical triangle definitions.
4. Wire `StoryPhase.jsx` with the 4 slides + 4 new images.
5. Build `StationsPhase.jsx`'s 3 stations against the canvas component.
6. Build `trianglesQuestionEngine.js` (6 generators) + `QuestionCard.jsx` +
   `PracticeMode.jsx`.
7. Build `ReflectCheck.jsx` + `SummaryScreen.jsx`.
8. Finalize the full phrase list and run `npm run gen-audio` once content is stable
   (regenerating is wasteful otherwise — the original's cache-by-exact-text-string
   design means any text edit orphans an old audio file).
9. QA pass: verify `journey-bar` step states, `home-btn`/`audio-toggle-btn` positioning,
   and that `localStorage` progress key (`intellia_types_of_triangles_v1` or similar,
   following the original's `intellia_<topic>_v1` convention) round-trips correctly on
   reload.

---

## 11. Explicit non-changes (do these verbatim, no redesign)

- `index.css` design tokens (`--purple-deep`, `--gold`, `--coral`, `--teal`, fonts,
  radii, shadows, transitions)
- `.journey-bar`, `.home-btn`, `.audio-toggle-btn` markup/positioning/CSS
- `.glass-card`, `.btn*`, `.mascot`, `.speech-bubble`, `.feature-cards` component styles
- `FloatingNumbers.jsx` (can keep as literal floating numbers, or swap glyphs to 📐🔺 —
  optional, not required for "same UI")
- Audio engine (`audio.js`), ElevenLabs proxy (`api/elevenlabs.js`), voice ID, and style
  presets
- Progress-reducer shape and phase enum in the state file
- Overall 6-phase journey (Intro → Wonder → Story → Stations → Practice → Reflect →
  Summary) and its gating logic (`learnDone` before Practice unlocks)

---

## 12. Open decisions to confirm before implementation

- **Grade level / syllabus depth**: P4 (sides+angles classification only) vs P5/P6
  (adding angle-sum problems, exterior angles)? Affects the `findMissingAngle`
  question-type difficulty range.
- **Mascot continuity**: keep 🤖 "Ravi the Robot Surveyor," or introduce a fresh
  character name/emoji for a distinct identity while keeping the same visual mascot
  styling?
- **Illustration source**: new images can be commissioned/AI-generated in the same
  flat-illustration style as the 4 existing `story_*.png`, or built as SVG components
  instead of PNGs (SVG would let triangle diagrams stay crisp and props-driven).
