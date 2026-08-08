import { useState } from 'react'
import type { StopReason } from '../data'
import type { TimelineEvent } from '../data/timeline'
import { laneColorClass } from './medicationColors'
import { Modal } from './Modal'

const STOP_REASON_LABELS: Record<StopReason, string> = {
  'side-effect': 'Stopped due to a side effect',
  'course-completed': 'Course completed',
  ineffective: "Stopped — wasn't working",
  'doctor-discontinued': 'Stopped by doctor',
  other: 'Stopped',
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function DeleteButton({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${label}`}
        className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-ink-muted shadow-soft ring-1 ring-border">
          ✕
        </span>
      </button>
      {confirming && (
        <Modal title={`Delete ${label}?`} onClose={() => setConfirming(false)}>
          {(close) => (
            <div className="flex flex-col gap-4">
              <p className="text-ink">This can't be undone.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="min-h-11 flex-1 rounded-lg border border-border px-4 font-medium text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm()
                    close()
                  }}
                  className="min-h-11 flex-1 rounded-lg bg-danger px-4 font-medium text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}

interface TimelineCardProps {
  event: TimelineEvent
  lane?: number
  onDeleteMedication?: (medicationId: string) => void
  onDeleteNote?: (noteId: string) => void
}

export function TimelineCard({ event, lane, onDeleteMedication, onDeleteNote }: TimelineCardProps) {
  const dot = lane !== undefined && (
    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${laneColorClass(lane)}`} aria-hidden="true" />
  )

  if (event.type === 'medication-started') {
    const { medication } = event
    return (
      <article className="relative rounded-lg border border-border bg-surface p-4 shadow-soft">
        {onDeleteMedication && (
          <DeleteButton
            label={medication.name}
            onConfirm={() => onDeleteMedication(medication.id)}
          />
        )}
        <div className="flex items-center gap-2">
          {dot}
          <h3 className="font-semibold text-ink">Started {medication.name}</h3>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          {medication.dose} · {medication.frequency}
        </p>
        {medication.prescribingDoctor && (
          <p className="mt-1 text-sm text-ink-muted">
            Prescribed by {medication.prescribingDoctor}
          </p>
        )}
        {medication.reason && (
          <p className="mt-1 text-sm text-ink-muted">For {medication.reason}</p>
        )}
        <p className="mt-2 text-xs text-ink-muted">{formatDate(event.date)}</p>
      </article>
    )
  }

  if (event.type === 'medication-stopped') {
    const { medication } = event
    return (
      <article className="relative rounded-lg border border-border bg-surface p-4 shadow-soft">
        {onDeleteMedication && (
          <DeleteButton
            label={medication.name}
            onConfirm={() => onDeleteMedication(medication.id)}
          />
        )}
        <div className="flex items-center gap-2">
          {dot}
          <h3 className="font-semibold text-ink">Stopped {medication.name}</h3>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          {medication.stopReason ? STOP_REASON_LABELS[medication.stopReason] : 'Stopped'}
        </p>
        {medication.stopReasonDetail && (
          <p className="mt-1 text-sm text-ink-muted">{medication.stopReasonDetail}</p>
        )}
        <p className="mt-2 text-xs text-ink-muted">{formatDate(event.date)}</p>
      </article>
    )
  }

  const { note } = event
  return (
    <article className="relative rounded-lg border border-border bg-brand-soft p-4 shadow-soft">
      {onDeleteNote && <DeleteButton label="this note" onConfirm={() => onDeleteNote(note.id)} />}
      <h3 className="font-semibold text-brand-strong">Note</h3>
      <p className="mt-1 text-sm text-ink">{note.text}</p>
      <p className="mt-2 text-xs text-ink-muted">{formatDate(event.date)}</p>
    </article>
  )
}