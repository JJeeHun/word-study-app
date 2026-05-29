import type { Result } from '@/shared/result'
import type { IWordApi } from '../_interfaces/word.api'
import type { Word, WordFilter } from '@/word/types'
import type { DexieWordRepository } from '@/word/infra/dexie'

export class LocalWordApi implements IWordApi {
  constructor(private readonly repo: DexieWordRepository) {}

  getById(id: string): Promise<Result<Word>> {
    return this.repo.findById(id)
  }

  getAll(filter?: WordFilter): Promise<Result<Word[]>> {
    return this.repo.findAll(filter)
  }
}

let instance: LocalWordApi | null = null

export const getLocalWordApi = (repo: DexieWordRepository): LocalWordApi => {
  if (!instance) instance = new LocalWordApi(repo)
  return instance
}
