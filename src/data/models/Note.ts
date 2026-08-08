import type { IsoDate } from './shared'

export interface Note {
  id: string
  text: string
  date: IsoDate
  createdAt: string // ISO datetime, tie-breaker for notes sharing a date
}

export type NewNote = Omit<Note, 'id' | 'createdAt'>