import type { SVGProps } from 'react'

export function TimelineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="21"
        className="motion-safe:animate-draw-line"
        style={{ strokeDasharray: 18, strokeDashoffset: 18 }}
      />
      <circle
        cx="12"
        cy="7"
        r="2"
        fill="currentColor"
        stroke="none"
        className="origin-center motion-safe:animate-dot-pop [transform-box:fill-box]"
        style={{ animationDelay: '0.1s' }}
      />
      <circle
        cx="12"
        cy="13"
        r="2"
        fill="currentColor"
        stroke="none"
        className="origin-center motion-safe:animate-dot-pop [transform-box:fill-box]"
        style={{ animationDelay: '0.25s' }}
      />
      <circle
        cx="12"
        cy="19"
        r="2"
        fill="currentColor"
        stroke="none"
        className="origin-center motion-safe:animate-dot-pop [transform-box:fill-box]"
        style={{ animationDelay: '0.4s' }}
      />
    </svg>
  )
}

export function SummaryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  )
}

export function ProfileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  )
}