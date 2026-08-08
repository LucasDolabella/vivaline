import { getDb } from './db'
import type { MedicationRepository } from '../repositories/MedicationRepository'
import type { IsoDate, Medication, NewMedication, StopReason } from '../models'

export class IndexedDbMedicationRepository implements MedicationRepository {
  async getAll(): Promise<Medication[]> {
    const db = await getDb()
    return db.getAll('medications')
  }

  async add(medication: NewMedication): Promise<Medication> {
    const db = await getDb()
    const record: Medication = { ...medication, id: crypto.randomUUID() }
    await db.put('medications', record)
    return record
  }

  async update(id: string, changes: Partial<NewMedication>): Promise<Medication> {
    const db = await getDb()
    const existing = await db.get('medications', id)
    if (!existing) throw new Error(`Medication not found: ${id}`)
    const updated: Medication = { ...existing, ...changes }
    await db.put('medications', updated)
    return updated
  }

  async stop(
    id: string,
    endDate: IsoDate,
    stopReason?: StopReason,
    stopReasonDetail?: string,
  ): Promise<Medication> {
    return this.update(id, { endDate, stopReason, stopReasonDetail })
  }

  async changeMedication(
    id: string,
    endDate: IsoDate,
    newMedication: NewMedication,
  ): Promise<{ stopped: Medication; created: Medication }> {
    const stopped = await this.stop(id, endDate)
    const created = await this.add({ ...newMedication, changedFromId: id })
    return { stopped, created }
  }

  async remove(id: string): Promise<void> {
    const db = await getDb()
    await db.delete('medications', id)
  }
}