import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const EXIT_DURATION_MS = 250

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode | ((close: () => void) => ReactNode)
}

export function Modal({ title, onClose, children }: ModalProps) {
  const [visible, setVisible] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (visible) dialogRef.current?.focus()
  }, [visible])

  function requestClose() {
    setVisible(false)
    setTimeout(onClose, EXIT_DURATION_MS)
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-ink/40 transition-opacity duration-200 sm:items-center ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={requestClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90svh] w-full max-w-sm overflow-y-auto rounded-t-lg bg-surface p-6 shadow-soft-lg transition-all duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] sm:rounded-lg ${
          visible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-6 scale-95 opacity-0 sm:translate-y-0'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brand-strong">{title}</h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted"
          >
            ✕
          </button>
        </div>
        {typeof children === 'function' ? children(requestClose) : children}
      </div>
    </div>,
    document.body,
  )
}