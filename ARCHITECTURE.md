# Vivaline — Architecture

Living document. Update this as decisions are made or revised — it's the source
of truth for *why* the app is built the way it is, not just what the code does.

See the original product spec for full feature scope (add medication, timeline
view, stop/change flow, notes, shareable summary, interaction flags).

## Guiding rule

All data logic (medication/note CRUD, date math, persistence) lives outside
React components, in a plain data layer. Components read from and call into
that layer — they never contain business logic themselves. This is what keeps
a future React Native port or backend swap cheap.

```
UI (React components)
   ↕ calls / reads
Data layer (models, CRUD, date math, storage)
   ↕
Storage (local persistence today, swappable for a backend API later)
```

## Tech stack

| Layer | Choice | Status |
|---|---|---|
| Framework | React (via Vite) | Decided — per spec |
| Language | TypeScript | Decided |
| Storage engine | IndexedDB (via `idb`), behind a repository interface | Decided |
| Styling | Tailwind CSS with a custom token theme (no default Tailwind palette) | Decided |
| Timeline rendering | Hand-built SVG/HTML inside React components (no charting/timeline library) | Decided |
| PWA | Vite PWA plugin (installable, offline-capable) | Decided direction |

Storage is intentionally behind a `MedicationRepository` / `NoteRepository`
interface so the engine (IndexedDB today, a backend API later) can change
without touching any component. Styling has no such seam — Tailwind classes
live directly in component markup — so a future styling change is a manual,
if contained, refactor rather than a swap.

## Visual design tokens

Defined in `src/index.css` via Tailwind's `@theme`. Light beige background
with pastel forest green as the accent/button color, per user preference.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#f7f2e7` | App background (light beige) |
| `--color-surface` | `#ffffff` | Cards/panels |
| `--color-ink` / `--color-ink-muted` | `#1f2933` / `#5b6b73` | Primary / secondary text |
| `--color-border` | `#e4dcc9` | Warm-neutral borders, matches beige family |
| `--color-brand` | `#4f7a5e` | Primary buttons — deep enough to carry white text at ~4.9:1 contrast (passes WCAG AA) |
| `--color-brand-strong` | `#385c43` | Hover/pressed states, headings |
| `--color-brand-soft` | `#dceadd` | Light pastel tint for badges/highlights, paired with `--color-ink` text (not white) |
| `--color-med-1..8` | see file | Medication bar colors — distinct, more saturated than the chrome, always paired with a label/pattern in components |

Note the two-tier green: `--color-brand` looks less "pastel" than the request
implied because true pastel lightness fails AA contrast for white button
text. `--color-brand-soft` is the actual light pastel tone, used where it's
paired with dark text instead of carrying text itself.

## Timeline design

Two renderers over the same underlying data — not one visualization trying to
serve every context.

### Detail view (default, on-screen)

Not a single scrolling feed — **two independent panels side by side**,
because "show me the shape of my whole history" and "show me what happened on
one day" turned out to be different jobs that fight each other in one view:

- **`TimelineSpine`** (left, narrow) — a scrollable column of dots-and-lines
  only, no card content. One "page" per date, sized to fill the spine's own
  height, with `scroll-snap` so scrolling always settles cleanly on exactly
  one date. Tracks scroll position (closest-row-to-center, recalculated on
  scroll) to know which date is "active," and reports that up. Tapping a dot
  also jumps to it directly (`scrollIntoView`).
- **`TimelineDetailPanel`** (right, fills remaining width) — non-scrolling,
  shows *only* the active date's cards. When the active date changes, current
  cards fade+slide out, content swaps, new cards fade+slide in (~200ms each
  way) — never two dates' cards visible at once.
- **`TimelineGutter`** — the actual lane/dot/line rendering, shared by every
  row in the spine. One colored **lane** per medication (like a git commit
  graph rotated for time): a continuous line through dates it's active,
  capped with a dot exactly where it starts or stops. A hollow ring (instead
  of a solid dot) marks a medication reaching "today" while still active, so
  an ongoing line doesn't just dangle with no explanation.
- **Oldest-first**: scrolling down moves forward through history toward
  today, like reading a story. The view opens already scrolled to today.
- **Tap a lane to jump to its start**: tapping anywhere along a specific
  medication's line jumps the spine straight to the date it started — this
  is also the answer to "color shouldn't be the only way to identify a
  medication": tapping any lane immediately shows you, by name, what it is.
- **Lane density cap**: below ~5 concurrent lanes, each renders individually.
  Above that, the gutter collapses into a single numbered band for that date;
  tapping it opens a small popover listing the active medications by name.
  Nothing is ever hidden from the data — collapsing only affects the
  always-visible line rendering.
- Overlaps are handled by lane assignment, not zoom — no pinch-to-zoom
  gesture required anywhere in the app (deliberately avoided given the likely
  elderly user base).

### Overview view (the Summary tab, and reused for print/share)
- Compact, whole-history-at-a-glance, non-interactive rendering.
- No scroll-reveal — everything visible at once, more like a Gantt chart.
- Lives on its own **Summary tab** rather than a toggle buried inside the
  Timeline screen — more discoverable for a doctor or caregiver, and keeps
  "one primary task per screen."
- Same component renders both that on-screen tab and the shareable/printable
  summary (spec feature 5) — one renderer, two output contexts. Printing uses
  a `@media print` stylesheet so the browser's native print dialog handles
  export — no extra library needed for v1.
- Includes a patient info header (display name, sourced from Profile) above
  the medication/notes rendering.

## Navigation

Bottom tab bar, Timeline visually elevated as the center/primary tab (bigger,
not a plain square) — reflects "the timeline is the star of the app." Built
as a simple, extensible list of tabs, not hardcoded to a fixed count, since
the tab set is expected to grow (see roadmap below).

**v1 — 3 tabs:**
- **Summary** (left) — the Overview view above.
- **Timeline** (center, large) — the Detail view. Has a **"+"** button that
  opens a two-option choice: add a medication or add a note. One decision,
  then a single-purpose form — no separate "add" tab needed.
- **Profile** (right) — deliberately minimal for v1: patient display name
  (used on the Summary header) plus a small data-management section (e.g.
  clear all data). No accounts, so this isn't a login-based profile.

**Planned evolution — 5 tabs:** Home, Summary, Timeline (center), Profile,
Settings. At that point Profile's data-management section splits out into
its own Settings tab. "Home" isn't scoped yet — likely a quick-glance
dashboard (e.g. current medication count, most recent note) — to be defined
when we build it.

## Data layer (implemented)

`src/data/` is the whole data layer — no file in it imports from `react`.

```
src/data/
├── models/            — Medication, Note, and shared types (IsoDate)
├── repositories/       — MedicationRepository / NoteRepository interfaces (the contract)
├── storage/
│   ├── db.ts                          — idb setup: object stores, keyed by id
│   ├── IndexedDbMedicationRepository.ts
│   └── IndexedDbNoteRepository.ts
└── index.ts            — the only import path for components: exports
                          `medicationRepository` / `noteRepository`, typed
                          as the interfaces (not the concrete classes)
```

### Data model

```
Medication
  id
  name
  dose
  frequency
  startDate
  endDate?              // absent = still active
  prescribingDoctor?
  reason?
  stopReason?           // 'side-effect' | 'course-completed' | 'ineffective' | 'doctor-discontinued' | 'other'
  stopReasonDetail?      // free text, mainly for 'other'
  changedFromId?         // set when this entry represents a "change" from a prior entry

Note
  id
  text
  date
  createdAt             // full timestamp, tie-breaker for notes sharing a date
```

### Repository responsibilities

A repository (1) translates domain calls into storage calls — nothing outside
`src/data/storage/` may import `idb` directly, (2) generates ids and owns
storage-level invariants, and (3) owns multi-record domain operations that
are about persistence rather than UI. `changeMedication` is the example of
(3): it stops the old record and creates a new linked one as a single
operation, rather than leaving a form component to call `stop()` + `add()`
separately.

## Deferred polish (backlog, not v1-blocking)

- **Custom calendar date picker** for the medication form's Start date field,
  instead of the native `<input type="date">`. Native input works and is
  accessible today; a custom picker is a "make it cuter" visual upgrade to
  revisit later, not a functional gap.
- **Structured dose/frequency inputs**, replacing the current free-text
  fields with friendlier pickers: dose as a number + unit dropdown (mg, g,
  mcg, mL, IU, "other"), frequency as a common-patterns picker (Once daily,
  Twice daily, Every 8 hours, As needed, "Other — describe"). Both `dose` and
  `frequency` stay plain strings in the data model — these pickers just
  compose into that same string before saving, so this is a `MedicationForm`
  change only, no repository or model changes, no migration for existing
  stored data.
- **Tap-to-expand card detail view**: tapping a `TimelineCard` opens it
  full-screen/centered with more info and a delete button at the bottom,
  rather than (or alongside) the current corner delete bubble. Natural place
  to eventually add edit/stop-medication actions too, since a corner bubble
  doesn't scale to multiple actions.
- **Spine navigation at scale**: with years of history, one-full-page-per-date
  in `TimelineSpine` means scrolling through many pages just to get anywhere.
  A compressed mini-map/scrubber alongside the spine — tap or drag to jump —
  is the likely fix, complementing the detailed one-at-a-time view rather
  than replacing it. The planned Summary tab (whole-history-at-a-glance) is
  the other half of the answer here, so revisit this after that exists.

## Open decisions log

All resolved. Repo is on GitHub at github.com/LucasDolabella/vivaline.