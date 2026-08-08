import { useId, useState, type FormEvent } from 'react'
import type { NewNote } from '../data'

interface NoteFormProps {
  submitLabel?: string
  onSubmit: (note: NewNote) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export function NoteForm({ submitLabel = 'Add note', onSubmit }: NoteFormProps) {
  const [text, setText] = useState('')
  const [date, setDate] = useState(today())

  const textId = useId()
  const dateId = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({ text: text.trim(), date })
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Note details" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textId} className="font-medium text-ink">
          What's going on?
        </label>
        <textarea
          id={textId}
          required
          rows={4}
          placeholder="e.g. Felt dizzy this afternoon"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="rounded-md border border-border bg-surface p-3 text-ink placeholder:text-ink-muted"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={dateId} className="font-medium text-ink">
          Date
        </label>
        <input
          id={dateId}
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-h-11 rounded-md border border-border bg-surface px-3 text-ink"
        />
      </div>

      <button
        type="submit"
        className="min-h-11 rounded-lg bg-brand px-6 py-3 font-medium text-white shadow-soft"
      >
        {submitLabel}
      </button>
    </form>
  )
}