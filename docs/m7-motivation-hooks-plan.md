## M7 — Motivation Hooks & Enjoyment System

### Goal
Build consistent, enjoyable 1–2h/day deep‑work on “special situations” by adding motivational hooks, immediate micro‑rewards, and boredom→curiosity loops, both in‑app and through optional outside‑app scaffolds.

---

### Feature set

- Hooks Library (Identity / Value / Delight)
  - What: Personal “why” phrases, identity statements, delights, music, rituals, micro‑rewards; taggable to sessions and quests.
  - App: `hooks` store and editor (Settings). Quick hook picker in Session Starter; log hook usage per session.
  - Outside (optional): Prepare playlist, beverage, desk reset routine; 30s walk pre‑session.

- Challenge Quests (Curiosity > Boredom)
  - What: Turn research/reading into small “quests” with a name, guiding question, deliverable, and 1–3 clues.
  - App: `quests` store; Quest Builder modal; recommended quest chip in Action Hub; timebox modes (15/25/50 min).
  - Outside: Physical “quest card” on desk to reduce switching costs.

- Session Starter & Ender
  - What: Start modal to set hook + quest + ritual + timer + environment toggles; End modal captures enjoyment (1–5), highlights, micro‑reward.
  - App: `SessionStarterModal`, `SessionEnderModal`; `sessions` log with times, hook/quest references, enjoyment, boredom events.
  - Outside: Text buddy “starting 25” (body‑double); 2‑min walk post‑session.

- Curiosity Inbox (fast capture)
  - What: Capture “intriguing unknowns” in 5s; feed next quest when boredom appears.
  - App: 1‑tap “Add to Curiosity Inbox” in Action Hub; promote items to quests.
  - Outside: Sticky note to scribble a question and return later.

- Enjoyment Meter + Immediate Rewards
  - What: Rate each session (1–5); suggest immediate micro‑rewards (variable schedule) to reinforce positive affect.
  - App: Enjoyment capture in Ender; “Reward now?” options; track which hooks correlate with higher enjoyment.
  - Outside: Micro‑rewards (walk, espresso, 3‑min music); schedule surf/run after 3 sessions.

- Consistency & Focus Tracker
  - What: Streak, deep‑work minutes/day, average enjoyment, boredom→action conversion, hook effectiveness.
  - App: Insights tiles in During; trends integrated with Weekly Review later.
  - Outside: Optional buddy/Slack/Telegram ping with streak and highlight.

- Boredom Protocol Upgrade
  - What: Mid‑session flow: 3 breaths → choose micro‑quest from Curiosity Inbox → run 10‑minute probe → return.
  - App: In‑session overlay “Boredom?” button; micro‑quest flow + timer; conversion logged.

---

### UI entry points
- During tab: “Start Session” button → `SessionStarterModal`.
- In‑session overlay: timer, “Boredom?” button, hook chip, quest title, environment toggles.
- Ender pops on timer end or manual end.
- Dashboard tiles (During): Streak, Today minutes, Avg enjoyment, Boredom→Action%.
- Curiosity Inbox chip; Quest Builder in Settings.

Current partial implementation (safe slice):
- Sessions (Beta) toggle in Settings (off by default).
- Header button to Start/End session.
- During tab shows live in‑progress session (timer, progress bar, hook/quest).
- Sessions tab (visible when enabled): time by hook bars + grouped session log. No import/export yet.

---

### Data model (new slices)
- sessions: `{ id, startedAt, endedAt, minutes, hookId?, questId?, enjoyment1to5, highlights: string[], boredomEvents: number }[]`
- hooks: `{ id, type: 'identity'|'value'|'delight'|'reward'|'music'|'ritual', label: string, data?: any }[]`
- quests: `{ id, title: string, guidingQuestion: string, deliverable: string, clues: string[], status: 'planned'|'active'|'done' }[]`
- curiosityInbox: `{ id, text: string, createdAt: number, promotedQuestId?: string }[]`

---

### Metrics & targets
- Consistency: ≥ 90 min/day deep‑work average over 14 days; ≥ 5‑day streak 2×/week.
- Enjoyment: Average enjoyment ≥ 3.5/5; ≥ 70% sessions with reward taken.
- Conversion: ≥ 60% boredom→action conversions (micro‑quests) within sessions.
- Hook effectiveness: Top 3 hooks produce ≥ 20% higher enjoyment vs baseline.
- Retention: ≥ 85% sessions started with both a hook and a quest selected.

---

### Milestones and tests

#### M7.1 Hooks Library + Session Starter
- Build hooks CRUD (Settings) and `SessionStarterModal` (hook + quest placeholder + timer + env toggles).
- Start logs a session; show live overlay with hook/quest chips.
- Tests
  - Start a session with a hook; overlay shows hook; env toggle applies.
  - Abort/restart; only one live session present.
  - Refresh mid‑session; overlay persists; end session still works.

#### M7.2 Quests + Curiosity Inbox
- Add quests CRUD, Curiosity Inbox capture; Starter suggests top quest or inbox item.
- “Boredom?” overlay → micro‑quest picker → 10‑min probe; conversion tracked.
- Tests
  - Add curiosity item; promote to quest; start on it; appear in overlay.
  - Trigger “Boredom?” → micro‑quest; conversion% increments.

#### M7.3 Session Ender + Rewards + Enjoyment
- Ender prompts enjoyment (1–5), 1 highlight, “Reward now?” (variable schedule).
- Tests
  - End session; enjoyment stored; reward taken logged; highlight appears in Morning export.

#### M7.4 Consistency Dashboard + Insights
- Tiles in During: Streak, Today minutes (uses app usage), Avg enjoyment, Boredom→Action%.
- Hook effectiveness: top 3 hooks by avg enjoyment.
- Tests
  - Tiles update as sessions close; streak increments across days; hook effectiveness lists top 3.

#### M7.5 Export + Weekly Review integration
- Morning export: “Consistency & Enjoyment: minutes, streak, avg enjoyment; top hooks; highlight(s).”
- Weekly review (when re‑enabled): 7‑day trends.
- Tests
  - Copy exports; verify new sections appear only with data present.

#### M7.6 Outside‑app scaffolds (optional)
- Slack/Telegram webhooks for “starting 25” / “done” pings; printable Quest Card.
- Tests
  - Webhook test ping success; Quest Card PDF renders with current quest.

---

### Acceptance criteria (feature‑level)
- A user can start a session with a hook and quest, run a timer, resolve boredom via a micro‑quest, and end with enjoyment + reward.
- Consistency tiles reflect accurate data; exports include new sections when available.
- No regressions to existing protocol/toolkit/distraction flows.

---

### Progress log
- [ ] M7.1 Hooks + Session Starter
- [ ] M7.2 Quests + Curiosity Inbox
- [ ] M7.3 Session Ender + Rewards + Enjoyment
- [ ] M7.4 Consistency Dashboard + Insights
- [ ] M7.5 Export + Weekly Review
- [ ] M7.6 Outside‑app scaffolds (optional)

