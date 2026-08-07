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
- Vertical scroll, chronological.
- Left gutter: one thin colored+patterned **lane** per medication (like a git
  commit graph rotated for time), running from its start point down to its
  stop point, or to a "today" marker if still active.
- Right of the gutter: a chronological feed of cards — medication started /
  stopped / changed, and notes — as distinct card types in the same feed, so a
  note next to a medication-start card makes the correlation visible without
  extra effort.
- Cards reveal as the user scrolls to them (subtle, not gimmicky).
- Overlaps are handled by lane assignment, not zoom — no pinch-to-zoom
  gesture required anywhere in the app (deliberately avoided given the likely
  elderly user base).
- **Lane density cap:** lanes are assigned per medication based on what's
  concurrently active at a given scroll position (not total lifetime med
  count). Below ~4-5 concurrent lanes, render them individually as
  colored+patterned lines. Above that threshold, collapse the gutter at that
  point into a single "N active" band instead of N thin lines; tapping it
  reveals exactly what's active there. The card feed is always the full
  source of truth regardless of how the gutter renders — collapsing only
  affects the persistent line visual, never hides an event.
- **Lane filter:** an optional "show lanes for: ___" control lets a user
  isolate specific medications' lanes against a quiet timeline — useful for a
  doctor checking one specific correlation without 8 colors competing for
  attention. This matters more as concurrent count grows, i.e. exactly the
  polypharmacy case the density cap above is guarding against.

### Overview view (toggle, and reused for print/share)
- Compact, whole-history-at-a-glance, non-interactive rendering.
- No scroll-reveal — everything visible at once, more like a Gantt chart.
- Same component powers both the on-screen "zoom out" toggle and the
  shareable/printable summary (spec feature 5) — one renderer, two output
  contexts (screen vs. exported image), rather than a third bespoke layout.

## Data model (draft — not yet finalized)

```
Medication
  id
  name
  dose
  frequency
  startDate
  endDate?            // absent/null = still active
  prescribingDoctor?
  reason?
  stopReason?         // side effect / course completed / ineffective / doctor discontinued / other
  linkedFromId?        // set when this entry represents a "change" from a prior entry

Note
  id
  text
  date
```

## Open decisions log

All resolved. Repo is on GitHub at github.com/LucasDolabella/vivaline.