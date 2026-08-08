import { useState } from 'react'
import { medicationRepository, type NewMedication } from './data'
import { MedicationForm } from './components/MedicationForm'

function App() {
  const [savedCount, setSavedCount] = useState(0)

  async function handleAdd(medication: NewMedication) {
    await medicationRepository.add(medication)
    setSavedCount((count) => count + 1)
  }

  return (
    <main className="min-h-svh bg-bg px-6 py-8">
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <h1 className="text-center text-3xl font-semibold text-brand-strong">
          Vivaline
        </h1>
        <MedicationForm onSubmit={handleAdd} />
        {savedCount > 0 && (
          <p role="status" className="text-center text-brand-strong">
            Saved {savedCount} medication{savedCount === 1 ? '' : 's'} this session.
          </p>
        )}
      </div>
    </main>
  )
}

export default App