import type { Result } from '@/shared/result'
import type { Sentence, WordSentence } from './types'

export interface ISentenceRepository {
  findByWordId(wordId: string): Promise<Result<Sentence[]>>
  findSince?(since: string): Promise<Result<Sentence[]>>
  findWordSentencesSince?(since: string): Promise<Result<WordSentence[]>>
  upsertMany(sentences: Sentence[]): Promise<Result<void>>
  upsertManyWordSentences(relations: WordSentence[]): Promise<Result<void>>
}
