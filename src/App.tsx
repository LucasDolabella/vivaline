import { useState } from 'react'
import { medicationRepository, noteRepository, type NewMedication, type NewNote } from './data'
import { MedicationForm } from './components/MedicationForm'
import { NoteForm } from './components/NoteForm'
import { BottomTabBar } from './components/BottomTabBar'
import { AddChoiceSheet } from './components/AddChoiceSheet'
import { Modal } from './components/Modal'
import { TimelineView } from './components/TimelineView'
import { ProfileIcon, SummaryIcon, TimelineIcon } from './components/icons'

type TabId = 'summary' | 'timeline' | 'profile'
type AddFlow = 'closed' | 'choosing' | 'medication' | 'note'

const TABS: { id: TabId; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'summary',
    label: 'Summary',
    icon: (active) => (
      <SummaryIcon
        className="transition-all duration-200"
        width={active ? 26 : 24}
        height={active ? 26 : 24}
        strokeWidth={active ? 2.5 : 2}
      />
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: () => <TimelineIcon className="h-7 w-7" />,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (active) => (
      <ProfileIcon
        className="transition-all duration-200"
        width={active ? 26 : 24}
        height={active ? 26 : 24}
        strokeWidth={active ? 2.5 : 2}
      />
    ),
  },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('timeline')
  const [addFlow, setAddFlow] = useState<AddFlow>('closed')
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleAddMedication(medication: NewMedication, close: () => void) {
    await medicationRepository.add(medication)
    setRefreshKey((key) => key + 1)
    close()
  }

  async function handleAddNote(note: NewNote, close: () => void) {
    await noteRepository.add(note)
    setRefreshKey((key) => key + 1)
    close()
  }

  return (
    <main className="flex h-svh flex-col bg-bg pb-24">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col overflow-hidden px-6 py-6">
        {activeTab === 'summary' && (
          <p className="text-center text-ink-muted">Summary view coming soon.</p>
        )}
        {activeTab === 'timeline' && <TimelineView refreshKey={refreshKey} />}
        {activeTab === 'profile' && (
          <p className="text-center text-ink-muted">Profile view coming soon.</p>
        )}
      </div>

      {activeTab === 'timeline' && (
        <button
          type="button"
          onClick={() => setAddFlow('choosing')}
          aria-label="Add a medication or note"
          className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-3xl leading-none text-white shadow-soft-lg"
        >
          +
        </button>
      )}

      <BottomTabBar
        tabs={TABS}
        activeTab={activeTab}
        centerTabId="timeline"
        onChange={(id) => setActiveTab(id as TabId)}
      />

      {addFlow === 'choosing' && (
        <AddChoiceSheet
          onClose={() => setAddFlow('closed')}
          onChooseMedication={() => setAddFlow('medication')}
          onChooseNote={() => setAddFlow('note')}
        />
      )}
      {addFlow === 'medication' && (
        <Modal title="Add a medication" onClose={() => setAddFlow('closed')}>
          {(close) => (
            <MedicationForm onSubmit={(medication) => handleAddMedication(medication, close)} />
          )}
        </Modal>
      )}
      {addFlow === 'note' && (
        <Modal title="Add a note" onClose={() => setAddFlow('closed')}>
          {(close) => <NoteForm onSubmit={(note) => handleAddNote(note, close)} />}
        </Modal>
      )}
    </main>
  )
}

export default App