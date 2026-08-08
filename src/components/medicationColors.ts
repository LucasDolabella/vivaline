// Literal class names, not built dynamically — Tailwind only generates CSS
// for class names it can find as-written in source.
const LANE_COLOR_CLASSES = [
  'bg-med-1',
  'bg-med-2',
  'bg-med-3',
  'bg-med-4',
  'bg-med-5',
  'bg-med-6',
  'bg-med-7',
  'bg-med-8',
]

export function laneColorClass(lane: number): string {
  return LANE_COLOR_CLASSES[lane % LANE_COLOR_CLASSES.length]
}