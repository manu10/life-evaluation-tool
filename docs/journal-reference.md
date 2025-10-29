## Journal (MSTmarco/journal) — Feature and Architecture Overview

### Purpose
Simple, offline-friendly journaling and lightweight project-tracking app. Single-file static app using browser storage. Useful as inspiration for: daily reflections, streaks, calendar-based history, and a project/problem-solving canvas.

### Tech Stack
- Static `index.html` with embedded CSS and vanilla JavaScript
- Data persistence via `localStorage`
- Content editing via `contenteditable` + `document.execCommand`
- Optional spell-check via `typo-js` CDN dictionary

### Data Model (localStorage)
- `journalEntries` (object keyed by `YYYY-MM-DD`)
  - `html`: rich entry HTML
  - `text`: plain text
  - `wordCount`: integer
  - `photo`: data URL (optional)
  - `timestamp`: ISO string
- `draft_{YYYY-MM-DD}` (object)
  - `html`, `text`, `photo`, `timestamp`
- `journalProjects` (object keyed by `projectId`)
  - `title`: string
  - `status`: `active | solved`
  - `createdAt`, `updatedAt`: ISO strings
  - `goal`: rich text (HTML)
  - `situation`: rich text (HTML)
  - `ideas`: array of `{ content, timestamp }`
  - `actions`: array of `{ content, timestamp, done }`
  - `progress`: array of `{ content, timestamp }`
  - `notes`: rich text (HTML)

### Key Features
- Prompted writing
  - Random prompt refresh
  - Goal selector (buttons) to set writing intent
  - Timer and live word count
- Rich text writing area
  - Bold/italic/heading/quote controls (execCommand)
  - Optional spell-check (Typo.js) and custom inline misspelling menu
  - Auto-save draft per date; restore on reload
- Photos
  - Upload preview (data URL), remove
- Entry lifecycle
  - Save entry: persists html/plain text, photo, word count
  - Success toast; clears current draft for today
- Stats & Calendar
  - Total days written, current streak, longest streak
  - Calendar grid (written days marked)
- History
  - Modal with search filter
  - Expand/collapse entry cards
  - Edit (load into editor), delete
- Projects (problem-solving canvas)
  - Project list with status filter (all/active/solved)
  - Project detail modal with sections:
    - Goal / Objective (rich text)
    - Current Situation (rich text)
    - Ideas & Options (list)
    - Actions & Next Steps (list with done toggle)
    - Progress & Updates (reverse-chronological list)
    - Notes & Thoughts (rich text with word count)
  - Inline editing, add/delete items, solved/reopen toggle

### Notable Functions (by behavior)
- Entry
  - `saveEntry()`: save current entry to `journalEntries`
  - `autoSave()`: persist per-date draft to `draft_{date}`
  - `loadEntryForDate(date)`: load entry/draft to editor
  - `updateWordCount()`, `startTimer()`, `resetTimer()`
  - `handlePhotoUpload()`, `displayPhoto()`, `removePhoto()`
  - `initializeSpellChecker()`, `checkSpelling()`, custom context menu helpers
- Stats/History
  - `updateStats()`, `calculateStreak(entries)`
  - `renderCalendar()`
  - `openHistoryModal()`, `loadEntries(search)`, `editEntry(date)`, `deleteEntry(date)`
- Projects
  - `getProjects()`, `saveProjects()`
  - `loadProjects()`, `openProjectDetail(id)`, `loadProjectCanvas(id)`
  - `saveProjectField(id, field, html)`, `addNewProjectItem(...)`, `updateProjectItem(...)`, `deleteProjectItem(...)`, `toggleAction(...)`, `toggleProjectStatus()`

### UX Flow Highlights
1) Landing shows header, stats, prompt, and writing area with controls.
2) User writes; timer and word count update; drafts auto-save.
3) On save, entry is stored by date; stats/calendar refresh.
4) History modal provides search, edit, delete for past entries.
5) Projects modal lists projects; selecting opens a structured canvas for problem-solving and tracking.

### Strengths to Reuse
- Offline-first simplicity; zero backend required
- Clear streak and calendar-based motivation
- Structured project canvas with quick add/edit
- Draft-per-day and recovery reduce data loss risk

### Gaps/Risks
- Single-file monolith; hard to maintain at scale
- `document.execCommand` is deprecated; consider modern editors (TipTap, Slate, ProseMirror)
- No sync/auth; data limited to single browser/device
- `localStorage` size/performance limits; no schema/versioning beyond ad-hoc migration

### Integration Ideas for Life Evaluation Tool
- Daily entry module with prompts, timer, word count (align with `DayThoughtsPanel`/`WhatWorkedToday`)
- Streaks and calendar of activity (integrate with `WeeklyReview` or `SessionsDashboard`)
- Per-day auto-draft for inputs like `GratitudeInput`, `EveningGoalsInput`
- Lightweight Projects/Goals canvas (could map to `InvestTab` or `TodayActionHub`)
  - Sections: Goal, Situation, Ideas, Actions (with done toggle), Progress, Notes
- Storage abstraction
  - Start with `localStorage` via a hook (e.g., extend `usePersistentState.js`)
  - Provide upgrade path to IndexedDB or backend API

### Minimal Porting Plan
- Create `useJournalStore` (hook) to wrap entries/drafts/projects APIs
- Build `JournalEditor` component (contenteditable or modern editor)
- Implement `JournalHistoryModal` and `JournalCalendar`
- Build `ProjectsModal` and `ProjectDetail` canvas
- Add `StatsBar` (days written, streaks)

### Notes
This repo is intentionally minimal (single `index.html`) but functionally rich. Treat it as a feature reference; for production use, refactor into modules and prefer a maintained editor library.


