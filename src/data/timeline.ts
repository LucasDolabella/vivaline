import type { Medication, Note } from './models'

export interface MedicationLane {
  medicationId: string
  lane: number
}

export interface LaneAssignment {
  lanes: MedicationLane[]
  laneCount: number
}

// Interval-graph-coloring: the same technique calendar apps use to lay out overlapping events.
export function assignLanes(medications: Medication[]): LaneAssignment {
  const sorted = [...medications].sort((a, b) =>
    a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0,
  )

  // laneEndDates[i] = the end date of whoever currently occupies lane i.
  // null means "still active" — that lane can't be reused by anything.
  const laneEndDates: (string | null)[] = []
  const lanes: MedicationLane[] = []

  for (const medication of sorted) {
    let laneIndex = laneEndDates.findIndex(
      (endDate) => endDate !== null && endDate <= medication.startDate,
    )

    if (laneIndex === -1) {
      laneIndex = laneEndDates.length
    }

    laneEndDates[laneIndex] = medication.endDate ?? null
    lanes.push({ medicationId: medication.id, lane: laneIndex })
  }

  return { lanes, laneCount: laneEndDates.length }
}

export type TimelineEvent =
  | { id: string; type: 'medication-started'; date: string; medication: Medication }
  | { id: string; type: 'medication-stopped'; date: string; medication: Medication }
  | { id: string; type: 'note'; date: string; note: Note }

// Oldest first, like reading a story — scrolling down moves forward through
// the history toward today.
export function buildTimelineFeed(medications: Medication[], notes: Note[]): TimelineEvent[] {
  const events: TimelineEvent[] = []

  for (const medication of medications) {
    events.push({
      id: `${medication.id}-started`,
      type: 'medication-started',
      date: medication.startDate,
      medication,
    })
    if (medication.endDate) {
      events.push({
        id: `${medication.id}-stopped`,
        type: 'medication-stopped',
        date: medication.endDate,
        medication,
      })
    }
  }

  for (const note of notes) {
    events.push({ id: note.id, type: 'note', date: note.date, note })
  }

  return events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export interface TimelineDatePoint {
  date: string
  events: TimelineEvent[]
}

// Same-day events are one moment in time, not a sequence — grouping them
// means they render as a single row with one aligned dot, not one row each.
// Relies on buildTimelineFeed already sorting same-date events adjacently.
export function groupEventsByDate(events: TimelineEvent[]): TimelineDatePoint[] {
  const points: TimelineDatePoint[] = []

  for (const event of events) {
    const last = points[points.length - 1]
    if (last && last.date === event.date) {
      last.events.push(event)
    } else {
      points.push({ date: event.date, events: [event] })
    }
  }

  return points
}

export function isToday(iso: string): boolean {
  return iso === new Date().toISOString().slice(0, 10)
}

export function formatDateLabel(iso: string, style: 'long' | 'short' = 'long'): string {
  if (isToday(iso)) return 'Today'
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(
    undefined,
    style === 'long'
      ? { weekday: 'long', month: 'short', day: 'numeric' }
      : { month: 'short', day: 'numeric' },
  )
}

export type LaneMarkState = 'through' | 'start' | 'stop'

export interface LaneMark {
  lane: number
  state: LaneMarkState
  medication: Medication
}

// For one date-point's row, which lanes have an active medication passing
// through it, and whether THIS date is where that lane's medication started
// or stopped — any number of lanes can start/stop on the same date. Each
// mark carries its medication so the UI can identify/link to it without a
// separate lookup (a lane can belong to different medications over time).
export function computeLaneMarks(
  point: TimelineDatePoint,
  medications: Medication[],
  laneByMedicationId: Map<string, number>,
): LaneMark[] {
  const startedIds = new Set(
    point.events
      .filter((event) => event.type === 'medication-started')
      .map((event) => event.medication.id),
  )
  const stoppedIds = new Set(
    point.events
      .filter((event) => event.type === 'medication-stopped')
      .map((event) => event.medication.id),
  )

  const marks: LaneMark[] = []

  for (const medication of medications) {
    const lane = laneByMedicationId.get(medication.id)
    if (lane === undefined) continue

    const hasStarted = medication.startDate <= point.date
    const notYetEnded = !medication.endDate || medication.endDate >= point.date
    if (!hasStarted || !notYetEnded) continue

    const state: LaneMarkState = startedIds.has(medication.id)
      ? 'start'
      : stoppedIds.has(medication.id)
        ? 'stop'
        : 'through'

    marks.push({ lane, state, medication })
  }

  return marks
}