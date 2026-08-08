import { useEffect, useState } from 'react'
import type { TimelineDatePoint } from '../data/timeline'
import { TimelineCard } from './TimelineCard'

const TRANSITION_MS = 200

interface TimelineDetailPanelProps {
  point: TimelineDatePoint
  laneByMedicationId: Map<string, number>
  onDeleteMedication: (medicationId: string) => void
  onDeleteNote: (noteId: string) => void
}

export function TimelineDetailPanel({
  point,
  laneByMedicationId,
  onDeleteMedication,
  onDeleteNote,
}: TimelineDetailPanelProps) {
  const [displayedPoint, setDisplayedPoint] = useState(point)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (point.date === displayedPoint.date) return
    setVisible(false)
    const timeout = setTimeout(() => {
      setDisplayedPoint(point)
      setVisible(true)
    }, TRANSITION_MS)
    return () => clearTimeout(timeout)
  }, [point, displayedPoint.date])

  return (
    <div className="no-scrollbar flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 py-6">
      <div
        className={`flex min-h-full flex-col justify-center gap-2 transition-all duration-200 ease-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        {displayedPoint.events.map((event) => (
          <TimelineCard
            key={event.id}
            event={event}
            lane={event.type === 'note' ? undefined : laneByMedicationId.get(event.medication.id)}
            onDeleteMedication={onDeleteMedication}
            onDeleteNote={onDeleteNote}
          />
        ))}
      </div>
    </div>
  )
}