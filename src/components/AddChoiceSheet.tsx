import { Modal } from './Modal'

interface AddChoiceSheetProps {
  onClose: () => void
  onChooseMedication: () => void
  onChooseNote: () => void
}

export function AddChoiceSheet({ onClose, onChooseMedication, onChooseNote }: AddChoiceSheetProps) {
  return (
    <Modal title="What would you like to add?" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onChooseMedication}
          className="min-h-11 rounded-lg border border-border bg-surface px-4 py-3 text-left font-medium text-ink shadow-soft"
        >
          Add a medication
        </button>
        <button
          type="button"
          onClick={onChooseNote}
          className="min-h-11 rounded-lg border border-border bg-surface px-4 py-3 text-left font-medium text-ink shadow-soft"
        >
          Add a note
        </button>
      </div>
    </Modal>
  )
}