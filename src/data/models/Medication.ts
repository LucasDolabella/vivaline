import type { IsoDate } from './shared'

export type StopReason =
  | 'side-effect'
  | 'course-completed'
  | 'ineffective'
  | 'doctor-discontinued'
  | 'other'

export interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  startDate: IsoDate
  prescribingDoctor?: string
  reason?: string
  endDate?: IsoDate
  stopReason?: StopReason
  stopReasonDetail?: string
  changedFromId?: string
}

export type NewMedication = Omit<Medication, 'id'>