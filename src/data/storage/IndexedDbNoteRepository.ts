import { getDb } from './db'
import type { NoteRepository } from '../repositories/NoteRepository'
import type { NewNote, Note } from '../models'

export class IndexedDbNoteRepository implements NoteRepository {
  async getAll(): Promise<Note[]> {
    const db = await getDb()
    return db.getAll('notes')
  }

  async add(note: NewNote): Promise<Note> {
    const db = await getDb()
    const record: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    await db.put('notes', record)
    return record
  }

  async update(id: string, changes: Partial<NewNote>): Promise<Note> {
    const db = await getDb()
    const existing = await db.get('notes', id)
    if (!existing) throw new Error(`Note not found: ${id}`)
    const updated: Note = { ...existing, ...changes }
    await db.put('notes', updated)
    return updated
  }

  async remove(id: string): Promise<void> {
    const db = await getDb()
    await db.delete('notes', id)
  }
}