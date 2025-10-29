## Streaks and Evening Journal Plan

### Goals
- Define meaningful streaks for motivation
- Explore replacing Evening open text with a journal-like editor

### Candidate Streak Definitions
1) Daily Reflection Streak
   - A day counts if Evening Journal has non-empty text
   - Pros: simple, aligns with journaling habit
   - Cons: doesn’t reflect quality or outcomes

2) Goals Completion Streak
   - A day counts if all Today’s Goals are marked completed
   - Pros: outcome-focused
   - Cons: strict; may discourage partial progress

3) Any Progress Streak
   - A day counts if at least one of: goals updated, routines completed, journal saved
   - Pros: forgiving; rewards engagement
   - Cons: less crisp definition

4) Focus/Distraction Streak
   - A day counts if focus score ≥ threshold or distractions below threshold
   - Pros: ties to app’s core value
   - Cons: needs robust analytics baseline

Recommendation: Start with (1) Daily Reflection Streak and (3) Any Progress Streak; consider (2) later.

### Data Capture
- Add `daily.v1[YYYY-MM-DD]` summary
  - `journalSaved: boolean`
  - `journalWordCount: number`
  - `goalsCompleted: number / total`
  - `routinesCompleted: number / total`
  - `distractionCount: number`
  - `focusScore: number | null`

### Streak Calculation
- `calculateStreak(data, predicate)` where predicate inspects a day’s summary
- Track current and longest streaks

### Evening Journal (Editor)
- Rich text area (contenteditable) with toolbar: bold, italic, headings, quote
- Auto-save draft per day, restore on reload
- Save to `eveningJournal.v1[YYYY-MM-DD]` with `{ html, text, wordCount, timestamp }`
- Integrate with exports and Weekly Review
- Feature toggle: `settings.flags.eveningJournal` (default: on once ready)

### UI Placement
- Replace current open text field in Evening with `EveningJournal` component
- Show live word count and save status

### Rollout
1. Implement editor and autosave (behind toggle)
2. Capture `daily.v1` summary
3. Implement streaks widget on Morning and/or Dashboard

### Risks/Notes
- `document.execCommand` is deprecated; consider swapping later to TipTap/Slate
- Ensure accessibility (keyboard, screen readers)
- Mobile typing performance and toolbar ergonomics


