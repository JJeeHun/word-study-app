import { db } from '@/infra/db'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { IWordRepository } from '../repository'
import type { Word, WordFilter, CreateWordRequestDto } from '../types'

export class DexieWordRepository implements IWordRepository {
  async findById(id: string): Promise<Result<Word>> {
    try {
      const word = await db.words.get(id)
      if (!word) return err('word_not_found')
      return ok(word)
    } catch {
      return err('db_error')
    }
  }

  async findAll(filter?: WordFilter): Promise<Result<Word[]>> {
    try {
      let collection = db.words.filter(w => w.deleted_at === null)
      if (filter?.domain) collection = db.words.filter(w => w.domain === filter.domain && w.deleted_at === null)
      if (filter?.status) collection = db.words.filter(w => w.status === filter.status && w.deleted_at === null)
      if (filter?.cefr) collection = db.words.filter(w => w.cefr === filter.cefr && w.deleted_at === null)
      if (filter?.part_of_speech) collection = db.words.filter(w => w.part_of_speech === filter.part_of_speech && w.deleted_at === null)
      const words = await collection.toArray()
      return ok(words)
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(words: Word[]): Promise<Result<void>> {
    try {
      await db.words.bulkPut(words)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async request(_dto: CreateWordRequestDto): Promise<Result<Word>> {
    return err('not_supported')
  }
}
