import { useEffect, useState } from 'react'
import { medicationRepository, noteRepository, type Medication, type Note } from '../data'
import { assignLanes, buildTimelineFeed, formatDateLabel, groupEventsByDate } from '../data/timeline'
import { TimelineSpine } from './TimelineSpine'
import { TimelineDetailPanel } from './TimelineDetailPanel'

interface TimelineViewProps {
  refreshKey: number
}

export function TimelineView({ refreshKey }: TimelineViewProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([medicationRepository.getAll(), noteRepository.getAll()]).then(
      ([medicationList, noteList]) => {
        if (cancelled) return
        setMedications(medicationList)
        setNotes(noteList)
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  async function handleDeleteMedication(medicationId: string) {
    await medicationRepository.remove(medicationId)
    setMedications((current) => current.filter((medication) => medication.id !== medicationId))
  }

  async function handleDeleteNote(noteId: string) {
    await noteRepository.remove(noteId)
    setNotes((current) => current.filter((note) => note.id !== noteId))
  }

  if (loading) {
    return <p className="text-center text-ink-muted">Loading your timeline…</p>
  }

  if (medications.length === 0 && notes.length === 0) {
    return (
      <p className="text-center text-ink-muted">
        Nothing here yet. Tap the + button to add your first medication or note.
      </p>
    )
  }

  const { lanes, laneCount } = assignLanes(medications)
  const laneByMedicationId = new Map(lanes.map((entry) => [entry.medicationId, entry.lane]))
  const points = groupEventsByDate(buildTimelineFeed(medications, notes))
  const activePoint = points[Math.min(activeIndex, points.length - 1)]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <p className="pb-2 text-center text-sm font-semibold text-ink-muted">
        {formatDateLabel(activePoint.date)}
      </p>
      <div role="feed" aria-label="Medication timeline" className="flex flex-1 gap-3 overflow-hidden">
        <TimelineSpine
          points={points}
          medications={medications}
          laneByMedicationId={laneByMedicationId}
          laneCount={laneCount}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />
        <TimelineDetailPanel
          point={activePoint}
          laneByMedicationId={laneByMedicationId}
          onDeleteMedication={handleDeleteMedication}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </div>
  )
}