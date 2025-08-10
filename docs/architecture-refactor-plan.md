## Life Evaluation Tool — Architecture Refactor Plan (Clean Code, SOLID, Scalability)

### Purpose
Build a maintainable, scalable, and testable architecture that adheres to Clean Code and SOLID principles. This plan defines structure, metrics, milestones, and tests so development can proceed safely and measurably.

### Executive summary
- Move to a feature‑oriented structure with typed domain models and a centralized state layer using selectors.
- Enforce quality via lint/type/test gates and a11y checks. Measure improvements with concrete targets.
- Deliver via safe, incremental milestones; each has acceptance criteria and test instructions.

---

### Current assessment (concise)
- Strengths: clear user flows per tab, shared modals, comprehensive export.
- Risks: `LifeEvaluationTool.jsx` over‑centralized; ad‑hoc persistence; minimal typing/tests; implicit coupling across components.

---

### Target architecture
- Structure (by feature)
  - `src/features/<feature>/` → `components/`, `store/`, `selectors.ts`, `types.ts`, `services/`, `tests/`
  - Features: `abc/`, `distractions/`, `mindfulness/`, `replacements/`, `environment/`, `todos/`, `usage/`, `export/`
- App shell & pages (`src/app/`)
  - `AppShell`, `ModalPortal`, `TabRouter`
  - Pages: `MorningPage`, `EveningPage`, `DuringPage`, `DistractionsPage`, `SettingsPage`
- State & persistence
  - Central store (Zustand or Redux Toolkit). Slices per feature.
  - Versioned persistence: single root `{ version, ...slices }` with migrations.
  - Memoized selectors for derived data (e.g., interruption rate, env adherence, top ABC patterns).
- Types & contracts
  - TypeScript preferred (strict). Interim: JSDoc + PropTypes if needed.
  - Shared domain types in `src/shared/types/`.
- UI patterns
  - Container vs presentational components. Presentational stateless where possible.
  - Shared primitives: `Button`, `Card`, `Modal`, `SectionHeading` with Tailwind tokens.
  - Single `ModalPortal` with focus management and z‑index policy.
- Quality & performance
  - ESLint + Prettier + TS strict + Husky hooks.
  - Unit/component/e2e tests. axe a11y tests.
  - Memoization & code‑splitting for heavy components (e.g., `FiveStepProtocol`).

---

### Engineering goals (measurable)
- Code quality
  - Cyclomatic complexity per function ≤ 10; file length ≤ 300 lines (exceptions documented)
  - Lint: 0 errors; warnings < 10 repo‑wide
- Types
  - P1 25% files typed → P2 60% → P3 90%
- Tests
  - Unit coverage: ≥ 70% (P2), ≥ 80% (P3)
  - Critical user journeys covered by e2e 100%
- Performance
  - Initial bundle for main route ≤ 250KB gz; lazy‑load large modals
  - P95 tab switch scripting ≤ 16ms
- Accessibility
  - axe: 0 serious/critical violations on smoke pages
  - Full keyboard support for modals/focus loops
- Maintainability
  - Feature boundaries respected; no cross‑feature imports except shared types/services
  - No wildcard imports; consistent import order and aliases

---

### Roadmap & milestones

#### M0 — Baseline quality gates
- Tasks
  - Add ESLint (Airbnb/base + React), Prettier, and scripts: `lint`, `format`.
  - Add Jest + React Testing Library; set up basic test config and first tests.
  - Add Husky pre‑commit (lint+format) and pre‑push (tests).
- Acceptance
  - `npm run lint` has 0 errors; `npm t` passes locally and in CI.
- How to test
  - Run local scripts; verify CI workflow success (if configured).

#### M1 — Typed contracts & shared domain models
- Tasks
  - Introduce TypeScript (strict). Allow JS interop during transition.
  - Create `src/shared/types/`: `AbcLog`, `MicroPractice`, `ReplacementAction`, `ReplacementAttempt`, `EnvironmentProfile`, `EnvironmentApplication`, `AnxietyRating`, `Todo`, `AppUsageDay`.
  - Type `utils/*` and selectors first; add PropTypes/TS props to top‑level components.
- Acceptance
  - ≥ 25% files typed; no `any` in shared types; typecheck passes (`tsc --noEmit`).
- How to test
  - Run `typecheck`; ensure unit tests still pass; smoke run app.

#### M2 — Centralized store, selectors, and migrations
- Tasks
  - Add store (Zustand or Redux Toolkit). Create slices for: `abc`, `distractions`, `mindfulness`, `replacements`, `environment`, `todos`, `usage`, `ui`.
  - Implement selectors for derived metrics (interruption rate, replacement success, env adherence, top ABC patterns, usage summaries).
  - Persistence layer: single `localStorage` key with `version`; write migrations from current keys.
  - Replace `usePersistentState` in pages with store hooks; keep hook for small local UI states.
- Acceptance
  - All pages read via selectors; migration from existing keys works; no data loss.
- How to test
  - Migration test: seed old keys in localStorage, load app, assert state hydrated in store.
  - Unit tests for selectors; manual regression of core flows.

#### M3 — Pages & feature folders; modal portal; container/presentational split
- Tasks
  - Create pages under `src/app/pages/*` and move tab content into them.
  - Move feature components into `src/features/<feature>/components`.
  - Add `ModalPortal` + focus trap; ensure shared modals render there.
  - Refactor presentational components to be dumb/pure; containers own data.
- Acceptance
  - `LifeEvaluationTool.jsx` ≤ 200 lines; pages orchestrate features; modals open via portal.
- How to test
  - Playwright visual snapshots for each page; keyboard navigation across modals; Esc to close, focus return.

#### M4 — A11y + performance + code‑splitting
- Tasks
  - Add jest‑axe tests for representative pages; fix violations.
  - Memoize heavy components and expensive computations; add React.memo where safe.
  - Lazy‑load heavy flows (e.g., `FiveStepProtocol` and large modals).
- Acceptance
  - axe: 0 serious/critical violations; Lighthouse Perf > 90, A11y > 95.
- How to test
  - `npm run test:a11y`; Lighthouse on `npm run preview`; profiling tab switches.

#### M5 — Tests completeness (unit/component/e2e)
- Tasks
  - Unit tests: `generateExportText`, `distractionUtils` (stats, patterns), selectors.
  - Component tests: `DistractionInsights`, `FiveStepProtocol` (step confirmations), `EveningResetConfirm`, `TodosList`.
  - E2E: Morning flow; Evening flow incl. reset; Distraction → protocol chain; “During” quick actions.
- Acceptance
  - Coverage ≥ 80% lines; all e2e pass.
- How to test
  - `npm run test -- --coverage`; review CI artifacts/e2e videos.

#### M6 — DX & maintenance
- Tasks
  - Storybook for core components; error boundaries; backup/restore (JSON export/import) utility.
  - ADRs for major decisions in `docs/adrs/`.
- Acceptance
  - Storybook has ≥ 6 stories; error boundaries verified; backup/restore works.
- How to test
  - Manual Storybook review; simulate error boundary; import/export a state JSON.

---

### Data model & persistence
- Single persisted root: `appState@vN = { version, abc, distractions, mindfulness, replacements, environment, todos, anxiety, usage, protocolHistory }`.
- Migrations per version with unit tests.
- Debounced save (250ms) per slice change.

### Coding standards
- Imports: no wildcards; absolute aliases (`@/features/...`); grouped external→internal.
- Naming: verbs for functions; full words; no cryptic abbreviations.
- Components: containers vs presentational; presentational pure.
- Control flow: guard clauses; shallow nesting; early returns.
- Comments: explain the “why”; avoid obvious inline comments.
- Formatting: Prettier enforced; no unrelated reformat in edits.

### Test matrix (applies each milestone)
- Smoke: app boot; tab switch; open/close modals; persistence after refresh.
- Core flows: Morning, Evening (reset incl. goals/todos), Distractions→5‑Step, During quick actions.
- Edge: empty config; corrupted storage (migration fallback); keyboard‑only; screen reader landmarks; Esc behavior.
- Performance: tab switch scripts ≤ 16ms; lazy‑load verified.

### Definition of Done (per milestone)
- Build/lint/typecheck/test pass.
- Types/PropTypes added for changed modules.
- A11y verified on changed surfaces (manual + jest‑axe).
- Docs updated (this plan + README where relevant).

---

### Progress log
- [ ] M0 — Baseline quality gates
- [ ] M1 — Typed contracts & shared domain models (25% typed)
- [ ] M2 — Centralized store, selectors, migrations
- [ ] M3 — Pages, feature folders, modal portal, container/presentational split
- [ ] M4 — A11y + performance + code‑splitting
- [ ] M5 — Tests completeness (≥ 80% coverage)
- [ ] M6 — DX & maintenance (storybook, boundaries, backup/restore)


