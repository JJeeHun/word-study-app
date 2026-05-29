import type { Result } from '@/shared/result'
import type { Sentence, WordSentence } from './types'

export interface ISentenceRepository {
  findByWordId(wordId: string): Promise<Result<Sentence[]>>
  upsertMany(sentences: Sentence[]): Promise<Result<void>>
  upsertManyWordSentences(relations: WordSentence[]): Promise<Result<void>>
}
