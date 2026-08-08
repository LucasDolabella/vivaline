import { Fragment, useEffect, useState } from 'react'
import type { LaneMark } from '../data/timeline'
import { laneColorClass } from './medicationColors'

const LANE_WIDTH = 28
// "~4-5 concurrent lanes" per the architecture doc — above this, individual
// lines stop being readable, so they collapse into one summary band.
const COLLAPSE_THRESHOLD = 5

interface TimelineGutterProps {
  marks: LaneMark[]
  laneCount: number
  // The very last row has nothing below it to connect to — trailing lines
  // there would just be color drawn into dead space, so they're capped at
  // the dot instead of extending to the row's bottom edge.
  isLastRow?: boolean
  // The date currently focused in the detail panel — its dot is emphasized.
  isActive?: boolean
  onNavigateToDate?: (date: string) => void
}

export function TimelineGutter({
  marks,
  laneCount,
  isLastRow = false,
  isActive = false,
  onNavigateToDate,
}: TimelineGutterProps) {
  const [showSummary, setShowSummary] = useState(false)
  const width = Math.max(laneCount, 1) * LANE_WIDTH
  const dotSize = isActive ? 'h-5 w-5' : 'h-4 w-4'

  useEffect(() => {
    if (!isActive) setShowSummary(false)
  }, [isActive])

  if (marks.length > COLLAPSE_THRESHOLD) {
    return (
      <div className="relative h-full shrink-0" style={{ width }}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setShowSummary((value) => !value)
          }}
          aria-label={`${marks.length} medications active — tap to see which`}
          className="absolute inset-y-0 left-0 flex w-full items-center justify-center"
        >
          <span className="h-full w-2 rounded-full bg-ink-muted opacity-40" />
          <span
            className={`absolute top-1/2 flex ${isActive ? 'h-7 w-7' : 'h-6 w-6'} -translate-y-1/2 items-center justify-center rounded-full bg-ink-muted text-xs font-semibold text-bg shadow-soft ring-4 ring-bg`}
          >
            {marks.length}
          </span>
        </button>
        {showSummary && (
          <div className="absolute left-full top-1/2 z-10 ml-2 w-48 -translate-y-1/2 rounded-lg border border-border bg-surface p-3 text-sm shadow-soft-lg">
            <p className="mb-1 font-semibold text-ink">Active on this date</p>
            <ul className="flex flex-col gap-1 text-ink-muted">
              {marks.map((mark) => (
                <li key={mark.medication.id}>{mark.medication.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-full shrink-0" style={{ width }}>
      {marks.map((mark) => {
        const left = mark.lane * LANE_WIDTH + LANE_WIDTH / 2
        const colorClass = laneColorClass(mark.lane)
        const hasDot = mark.state !== 'through'
        const isStillActive = isLastRow && mark.state === 'through'

        // Oldest-first layout: 'start' connects down to more-recent rows
        // below it; 'stop' connects up to the through-rows above it.
        let lineClass: string
        if (mark.state === 'stop') {
          lineClass = 'top-0 h-1/2'
        } else if (isLastRow) {
          // 'through' still connects up to earlier history; a fresh
          // 'start' here has nothing before or after it, so no line at all.
          lineClass = mark.state === 'through' ? 'top-0 h-1/2' : ''
        } else {
          lineClass = mark.state === 'through' ? 'inset-y-0' : 'bottom-0 h-1/2'
        }

        return (
          <Fragment key={mark.lane}>
            {lineClass && (
              <span
                className={`absolute w-1 -translate-x-1/2 rounded-full opacity-80 ${colorClass} ${lineClass}`}
                style={{ left }}
              />
            )}
            {hasDot && (
              <span
                className={`absolute top-1/2 ${dotSize} -translate-x-1/2 -translate-y-1/2 rounded-full shadow-soft ring-4 ring-bg transition-all duration-200 ${colorClass}`}
                style={{ left }}
              />
            )}
            {isStillActive && (
              <span
                className={`absolute top-1/2 ${dotSize} -translate-x-1/2 -translate-y-1/2 rounded-full shadow-soft ring-4 ring-bg transition-all duration-200 ${colorClass}`}
                style={{ left }}
              >
                <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-bg" />
              </span>
            )}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onNavigateToDate?.(mark.medication.startDate)
              }}
              aria-label={`Jump to when ${mark.medication.name} started`}
              className="absolute inset-y-0"
              style={{ left: mark.lane * LANE_WIDTH, width: LANE_WIDTH }}
            />
          </Fragment>
        )
      })}
    </div>
  )
}