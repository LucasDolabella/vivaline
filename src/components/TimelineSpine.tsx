import { useEffect, useRef } from 'react'
import type { Medication } from '../data'
import { computeLaneMarks, type TimelineDatePoint } from '../data/timeline'
import { TimelineGutter } from './TimelineGutter'

interface TimelineSpineProps {
  points: TimelineDatePoint[]
  medications: Medication[]
  laneByMedicationId: Map<string, number>
  laneCount: number
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

export function TimelineSpine({
  points,
  medications,
  laneByMedicationId,
  laneCount,
  activeIndex,
  onActiveIndexChange,
}: TimelineSpineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  function updateActiveFromScroll() {
    const container = containerRef.current
    if (!container) return
    const containerCenter = container.getBoundingClientRect().top + container.clientHeight / 2

    let closestIndex = 0
    let closestDistance = Infinity
    rowRefs.current.forEach((rowEl, index) => {
      if (!rowEl) return
      const rect = rowEl.getBoundingClientRect()
      const distance = Math.abs(rect.top + rect.height / 2 - containerCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    onActiveIndexChange(closestIndex)
  }

  function handleScroll() {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      updateActiveFromScroll()
    })
  }

  // Open on today/newest — the last point — same as the old behavior.
  useEffect(() => {
    rowRefs.current[points.length - 1]?.scrollIntoView({ block: 'center' })
    updateActiveFromScroll()
  }, [points.length])

  function jumpToIndex(index: number) {
    rowRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function handleNavigateToDate(date: string) {
    const index = points.findIndex((point) => point.date === date)
    if (index !== -1) jumpToIndex(index)
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="timeline-fade no-scrollbar w-fit snap-y snap-mandatory overflow-y-auto"
    >
      {points.map((point, index) => {
        const marks = computeLaneMarks(point, medications, laneByMedicationId)

        return (
          <div
            key={point.date}
            ref={(el) => {
              rowRefs.current[index] = el
            }}
            role="button"
            tabIndex={0}
            onClick={() => jumpToIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                jumpToIndex(index)
              }
            }}
            aria-label={point.date}
            aria-current={index === activeIndex ? 'true' : undefined}
            className="block h-full w-fit snap-center"
          >
            <TimelineGutter
              marks={marks}
              laneCount={laneCount}
              isLastRow={index === points.length - 1}
              isActive={index === activeIndex}
              onNavigateToDate={handleNavigateToDate}
            />
          </div>
        )
      })}
    </div>
  )
}