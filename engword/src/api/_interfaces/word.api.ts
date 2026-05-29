import type { Result } from '@/shared/result'
import type { Word, WordFilter, CreateWordRequestDto } from '@/word/types'

export interface IWordApi {
  getById(id: string): Promise<Result<Word>>
  getAll(filter?: WordFilter): Promise<Result<Word[]>>
}

export interface IWordRequestApi {
  request(dto: CreateWordRequestDto): Promise<Result<Word>>
}
