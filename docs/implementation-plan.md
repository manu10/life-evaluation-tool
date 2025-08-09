### Life Evaluation Tool — Mindfulness & 5‑Step Protocol Implementation Plan

— Living document. Will be updated as development progresses.

#### Purpose
Integrate mindfulness micro-practices and a 5‑step protocol (from the referenced X/Twitter thread) into the existing daily reflection workflow to reduce overthinking and increase action.

Reference threads:
- Core ideas (overthinking → underacting, mindfulness/defusion/grounding/acceptance): `https://x.com/LORWEN108/status/1954135651282211313`
- 5‑step protocol reference: `https://x.com/LORWEN108/status/1954136018464165965`

---

### 5‑Step Protocol (current draft)
Note: Exact wording can be updated to match the source post. This draft mirrors the thread’s themes and is implementation‑ready.

1) Identify Your Triggers
- Skinner mapped stimulus-response patterns obsessively.
- You can too:
  - Track what happens RIGHT before anxiety hits
  - Note time, place, people, thoughts
  - Find the pattern within 7 days
- Your anxiety has a blueprint. Find it.

2) Break the Chain Early
- Interrupt anxiety before it spirals:
  - Notice first body sensation (tight chest? racing thoughts?)
  - Take 3 deep breaths immediately
  - Change your physical position
- Small interruptions = big changes.

3) You can't just stop a behavior—you must replace it.
- When anxiety triggers:
  - Have a go-to replacement ready (call someone or journal)
  - Make it EASIER than the anxious response
  - Reward yourself immediately after
- The brain chooses the easiest path.

4) Engineer Your Environment
- You can control yours:
  - Remove anxiety cues from your space
  - Add calming anchors (plants, photos, music)
  - Design "choice architecture" that supports calm
- Your environment shapes you more than willpower.

5) Track & Adjust Like a Scientist
- Skinner measured everything. So should you:
  - Rate anxiety 1-10 daily
  - Note what worked/didn't
  - Adjust your protocol weekly
  - Celebrate small wins
- The irony? Skinner's methods work best when combined with what he rejected:

---

### Protocol‑aligned tools (revised scope)
- ABC Logger (Antecedent‑Behavior‑Consequence‑Effect)
  - Quick capture of Date/Time, Setting, Antecedent (trigger), Behavior, Consequence, Effect (as in attached ABC image)
  - Accessible after adding a distraction and from Morning/Evening tabs
- Mindfulness Toolkit
  - Break‑the‑chain quick actions: 3 breaths, change posture, 30s anchor, 90s pause
  - One‑tap logging that a micro‑interrupt was performed
- Replacement Actions Library
  - User‑defined “go‑to” replacements (call someone, journal, walk)
  - Designed to be easier than the anxious response; one‑tap start + small timer + reward marker
- Environment Designer
  - Checklist editor for removing cues and adding calming anchors; “choice architecture” presets
- Tracking & Weekly Review
  - Daily anxiety rating (1–10), what worked/didn’t; weekly adjustment notes and celebration log
- 5‑Step Protocol guided component (stepper) that stitches the above into one flow
- Distraction‑triggered prompts that suggest: ABC log → quick interrupt → replacement action
- Settings to control prompts, durations, and review cadence
- Export and insights updated to reflect ABC entries, interrupts, replacements, anxiety scale, and adjustments

---

### Milestones and tasks (revised)

#### M1 — ABC Logger, quick interrupts, prompts, settings, basic export
- [x] Create `src/components/ABCLogger.jsx` (modal/sheet)
  - [x] Fields: date/time (auto via ts), setting, antecedent, behavior, consequence, effect
  - [x] One‑tap from `DistractionTracker` (auto‑prompt after logging a distraction)
  - [ ] Open from Morning/Evening tabs
- [x] `src/components/MindfulnessToolkit.jsx`
  - [x] 3 breaths, change posture, 30s anchor, 90s pause
  - [x] Log micro‑interrupts to `microPracticeLogs`
- [x] Add button near floating timer in `src/LifeEvaluationTool.jsx` to open toolkit
- [x] Distraction prompt: “Log ABC” + quick interrupt (auto 3 breaths)
- [x] Settings: `mindfulnessSettings` with prompts and durations
- [x] Export: show protocol counts and recent ABC highlights (morning)
- [x] ABCHighlights in Morning/Evening tabs with quick "+ Add ABC" button

#### M2 — Replacement actions, environment designer, protocol stepper, richer export
- [x] `src/components/ReplacementActions.jsx`
  - [x] CRUD list of replacement actions; mark “easy” and reward text
  - [x] One‑tap start with 2‑min timer via `ReplacementAttempt`
- [x] Link replacement execution to Distractions tab (top 3 quick actions; breathing prompt offers top action)
- [ ] `src/components/EnvironmentDesigner.jsx`
  - [ ] Removals checklist (cues) and additions (anchors)
  - [ ] Choice‑architecture presets
- [ ] `src/components/FiveStepProtocol.jsx` (stepper that sequences: Identify Triggers → Break Chain → Replace → Engineer Environment → Track/Adjust)
- [ ] Export updates: ABC entries (top 3 patterns), replacements attempted/completed, environment checklist highlights

#### M3 — Tracking & weekly review, insights, anchor bar, polish
- [ ] Daily anxiety scale input (1–10) component; store per day
- [ ] `src/components/WeeklyReview.jsx` to show what worked/didn’t and capture adjustments; celebrate wins
- [ ] Insights (`DistractionInsights.jsx`, `utils/distractionUtils.js`):
  - [ ] Interruption rate = micro‑interrupts / distractions
  - [ ] Replacement success rate and environment adherence score
  - [ ] Top antecedents and settings (from ABC)
  - [ ] Anxiety trend line and weekly deltas
- [ ] Anchor frequency bar (nudges) below timer with settings: off/low/medium
- [ ] A11y/mobile polish (buttons ≥ 44px, ARIA live for timers, contrast)

---

### Data model changes (persistent keys)
- `mindfulnessSettings`: `{ enablePrompts, anchorSec, pauseSec, enableFiveStep, anchorFrequency? }`
- `microPracticeLogs`: `[{ id, ts, type: 'breaths'|'posture'|'anchor'|'pause', source?: 'distraction'|'manual', trigger? }]`
- `abcLogs`: `[{ id, ts, setting, antecedent, behavior, consequence, effect, linkedDistractionId? }]`
- `replacementActions`: `[{ id, title, isEasy:boolean, rewardText?:string }]`
- `replacementAttempts`: `[{ id, ts, actionId, durationSec, completed:boolean, rewardGiven:boolean, linkedAbcId? }]`
- `environmentProfile`: `{ removals: string[], additions: string[], presets?: string[] }`
- `anxietyRatings`: `[{ dateISO, rating1to10 }]`
- `weeklyAdjustments`: `[{ weekOfISO, whatWorked: string, whatDidnt: string, adjustments: string[], wins: string[] }]`
- `fiveStepHistory` (optional): `[{ id, startedAt, completedAt, stepsCompleted: number[], linkedAbcId?, replacementAttemptId? }]`

---

### UI entry points
- Floating timer: open Toolkit / start 5‑Step
- Distraction add success: inline prompt card → ABC + quick interrupt + replacement
- Morning/Evening tabs: open ABC Logger and Weekly Review

---

### Acceptance criteria
- Users can log ABC quickly after distractions and from tabs
- Users can perform quick interrupts (3 breaths, posture change, 30s anchor, 90s pause) and see them logged
- Users can start and complete replacement actions and mark rewards
- Users can maintain an environment checklist and apply presets
- Users can rate anxiety daily and perform a weekly review; insights reflect changes
- Settings reliably toggle prompts and durations (persist via localStorage); no regressions; respects `eveningDone`

---

### Export updates (visibility only when data exists)
- Morning: “🧩 Protocol activity — breaths: X, posture: Y, anchors: Z, pauses: W; top antecedents and settings (from ABC)”
- Evening: “📋 ABC Highlights” (last N entries), “🔁 Replacement Actions” (attempted/completed), “🏡 Environment updates”, “📈 Anxiety rating: n/10”
- Weekly: “🧪 Adjustments & Wins” (from weekly review) if period closed

---

### Progress log
- [2025‑08‑09] Created living plan and drafted 5‑Step protocol. Pending: exact phrasing sync from source post if needed.
- [2025‑08‑09] Revised plan to align with final 5‑Step wording and ABC framework; added ABC Logger, Replacement Actions, Environment Designer, anxiety scale, and Weekly Review.
- [2025‑08‑09] Implemented M1: Toolkit, ABC Logger, prompts, settings, and export updates. Added ABC entry points in DayThoughtsPanel and ABCHighlights; added guided Breathing Prompt.
 - [2025‑08‑09] M2 (part): Replacement Actions completed — editor in Settings, quick execution in Distractions, 2‑min attempt modal wired; breathing prompt integrates a “Do replacement” CTA.


