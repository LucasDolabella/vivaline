export type { IsoDate, Medication, NewMedication, StopReason, Note, NewNote } from './models'
export type { MedicationRepository } from './repositories/MedicationRepository'
export type { NoteRepository } from './repositories/NoteRepository'

import { IndexedDbMedicationRepository } from './storage/IndexedDbMedicationRepository'
import { IndexedDbNoteRepository } from './storage/IndexedDbNoteRepository'
import type { MedicationRepository } from './repositories/MedicationRepository'
import type { NoteRepository } from './repositories/NoteRepository'

export const medicationRepository: MedicationRepository = new IndexedDbMedicationRepository()
export const noteRepository: NoteRepository = new IndexedDbNoteRepository()