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
| Language | TBD (TypeScript vs JS) | **Open decision** |
| Storage engine | TBD (IndexedDB vs localStorage) | **Open decision** |
| Styling | TBD (plain CSS + tokens vs Tailwind) | **Open decision** |
| Timeline rendering | Hand-built SVG/HTML inside React components (no charting/timeline library) | Decided |
| PWA | Vite PWA plugin (installable, offline-capable) | Decided direction |

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

- [ ] TypeScript vs JavaScript
- [ ] IndexedDB vs localStorage
- [ ] Plain CSS + design tokens vs Tailwind
- [ ] Local-only git repo vs GitHub remote (no `gh` CLI installed on this
      machine — remote setup would be manual)