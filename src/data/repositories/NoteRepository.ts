import type { NewNote, Note } from '../models'

export interface NoteRepository {
  getAll(): Promise<Note[]>
  add(note: NewNote): Promise<Note>
  update(id: string, changes: Partial<NewNote>): Promise<Note>
  remove(id: string): Promise<void>
}