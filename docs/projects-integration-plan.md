## Projects Integration Plan

### Goal
Introduce a Projects tab inspired by the reference journal’s canvas to replace the current Invest tab functionally, without removing Invest. Control visibility with feature toggles.

### Feature Toggles
- settings.flags.projectsTab: boolean (default: true)
- settings.flags.investTab: boolean (default: true initially; switch to false when Projects ships)

### Data Model (v1, localStorage)
- Key: `projects.v1`
- Shape:
  - `projectId: string → Project`
  - Project
    - `title: string`
    - `status: 'active' | 'solved'`
    - `createdAt: ISO`
    - `updatedAt: ISO`
    - `goal: HTML`
    - `situation: HTML`
    - `ideas: { content: string, timestamp: ISO }[]`
    - `actions: { content: string, timestamp: ISO, done: boolean }[]`
    - `progress: { content: string, timestamp: ISO }[]`
    - `notes: HTML`

### Components
- `ProjectsTab.jsx`: list, filters (all/active/solved), new project
- `ProjectDetailModal.jsx`: title, status toggle, canvas content
- `ProjectCanvas.jsx`: goal, situation, ideas, actions, progress, notes
- `ProjectStore` hook: CRUD, persistence, word count helper

### Behavior
- Inline editing with autosave on blur
- Add/delete list items (ideas/actions/progress)
- Toggle done for actions
- Word count for notes
- Date display with English short format

### Navigation Integration
- Update `Tabs.jsx` to show `Projects` when `projectsTab` is true
- Hide `Invest` when `investTab` is false

### Migration/Extensibility
- Wrap storage with a versioned adapter to allow IndexedDB or backend later
- Add simple export of a project as text/markdown

### Rollout
1. Ship hidden behind settings toggle (off by default while developing)
2. When stable, set `projectsTab` default to true and `investTab` default to false

### Progress Log
- 2025-10-29: Added feature flags (`featureFlags.projectsTab`, `featureFlags.investTab`), wired to `Tabs.jsx` and `Settings.jsx`. Implemented `ProjectsTab` scaffold and `useProjectsStore` with localStorage-backed v1 schema.
- 2025-10-29: Implemented `ProjectDetailModal` with editable title, status toggle. Wired create/open/delete.
- 2025-10-29: Added `ProjectCanvas` replicating reference UI (🎯, 🤔, 💡, ✅, 📊, 📝) with chips, item lists, done toggles, and notes word count. Store extended with item CRUD and toggle helpers.
- 2025-10-29: **Fixed reversed text issue**: Replaced contenteditable with controlled `<textarea>` components (like `DayThoughtsPanel`) to avoid contenteditable LTR quirks. Plain text editing now works reliably across all project fields (Goal, Situation, Ideas, Actions, Progress, Notes).

### Improvements vs Reference
- Modular components (`ProjectCanvas`, `ProjectsTab`, `ProjectDetailModal`) for clarity and testability
- Store helpers for item-level CRUD and toggles instead of inlined DOM logic
- Controlled textarea inputs (reliable LTR, no contenteditable quirks)
- Utilities for English date formatting
- Scrollable modal for long projects

### Known Limitations & Future Work
- Plain text only (no bold/headings); can add TipTap/Slate/Lexical later for rich formatting if needed
- No inline spell-checking context menu; browser native only

### QA
- Persistence across reloads
- Large text inputs (performance)
- Mobile UX (focus, keyboard, scrolling)
- Edge cases: empty items, delete confirmations, undo toggles


