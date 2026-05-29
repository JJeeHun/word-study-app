import type { Result } from '@/shared/result'
import type { Word, WordFilter, CreateWordRequestDto } from './types'

export interface IWordRepository {
  findById(id: string): Promise<Result<Word>>
  findAll(filter?: WordFilter): Promise<Result<Word[]>>
  upsertMany(words: Word[]): Promise<Result<void>>
  request(dto: CreateWordRequestDto): Promise<Result<Word>>
}
