import { useId, useState, type FormEvent } from 'react'
import type { NewMedication } from '../data'

interface MedicationFormProps {
  initialValue?: Partial<NewMedication>
  submitLabel?: string
  onSubmit: (medication: NewMedication) => void
}

const today = () => new Date().toISOString().slice(0, 10)

const fieldClasses =
  'min-h-11 rounded-md border border-border bg-surface px-3 text-ink placeholder:text-ink-muted'

export function MedicationForm({
  initialValue,
  submitLabel = 'Add medication',
  onSubmit,
}: MedicationFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '')
  const [dose, setDose] = useState(initialValue?.dose ?? '')
  const [frequency, setFrequency] = useState(initialValue?.frequency ?? '')
  const [startDate, setStartDate] = useState(initialValue?.startDate ?? today())
  const [prescribingDoctor, setPrescribingDoctor] = useState(
    initialValue?.prescribingDoctor ?? '',
  )
  const [reason, setReason] = useState(initialValue?.reason ?? '')

  const nameId = useId()
  const doseId = useId()
  const frequencyId = useId()
  const startDateId = useId()
  const doctorId = useId()
  const reasonId = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({
      name: name.trim(),
      dose: dose.trim(),
      frequency: frequency.trim(),
      startDate,
      prescribingDoctor: prescribingDoctor.trim() || undefined,
      reason: reason.trim() || undefined,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Medication details"
      className="flex w-full max-w-sm flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={nameId} className="font-medium text-ink">
          Name
        </label>
        <input
          id={nameId}
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={doseId} className="font-medium text-ink">
          Dose
        </label>
        <input
          id={doseId}
          type="text"
          required
          placeholder="e.g. 50mg"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={frequencyId} className="font-medium text-ink">
          Frequency
        </label>
        <input
          id={frequencyId}
          type="text"
          required
          placeholder="e.g. 1x/day"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={startDateId} className="font-medium text-ink">
          Start date
        </label>
        <input
          id={startDateId}
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={doctorId} className="font-medium text-ink">
          Prescribing doctor <span className="text-ink-muted">(optional)</span>
        </label>
        <input
          id={doctorId}
          type="text"
          value={prescribingDoctor}
          onChange={(e) => setPrescribingDoctor(e.target.value)}
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={reasonId} className="font-medium text-ink">
          Reason / condition <span className="text-ink-muted">(optional)</span>
        </label>
        <input
          id={reasonId}
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={fieldClasses}
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