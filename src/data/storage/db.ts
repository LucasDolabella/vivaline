import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Medication } from '../models/Medication'
import type { Note } from '../models/Note'

interface VivalineDB extends DBSchema {
  medications: {
    key: string
    value: Medication
  }
  notes: {
    key: string
    value: Note
  }
}

const DB_NAME = 'vivaline'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<VivalineDB>> | undefined

export function getDb(): Promise<IDBPDatabase<VivalineDB>> {
  if (!dbPromise) {
    dbPromise = openDB<VivalineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('medications', { keyPath: 'id' })
        db.createObjectStore('notes', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}