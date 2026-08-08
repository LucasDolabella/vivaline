import type { IsoDate, Medication, NewMedication, StopReason } from '../models'

export interface MedicationRepository {
  getAll(): Promise<Medication[]>
  add(medication: NewMedication): Promise<Medication>
  update(id: string, changes: Partial<NewMedication>): Promise<Medication>
  stop(
    id: string,
    endDate: IsoDate,
    stopReason?: StopReason,
    stopReasonDetail?: string,
  ): Promise<Medication>
  changeMedication(
    id: string,
    endDate: IsoDate,
    newMedication: NewMedication,
  ): Promise<{ stopped: Medication; created: Medication }>
  remove(id: string): Promise<void>
}