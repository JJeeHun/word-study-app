import { db } from '@/infra/db'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { ISentenceRepository } from '../repository'
import type { Sentence, WordSentence } from '../types'

export class DexieSentenceRepository implements ISentenceRepository {
  async findByWordId(wordId: string): Promise<Result<Sentence[]>> {
    try {
      const relations = await db.word_sentences.where('word_id').equals(wordId).toArray()
      const sentenceIds = relations.map(r => r.sentence_id)
      const sentences = await db.sentences.bulkGet(sentenceIds)
      return ok(sentences.filter((s): s is Sentence => s !== undefined && s.deleted_at === null))
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(sentences: Sentence[]): Promise<Result<void>> {
    try {
      await db.sentences.bulkPut(sentences)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async upsertManyWordSentences(relations: WordSentence[]): Promise<Result<void>> {
    try {
      await db.word_sentences.bulkPut(relations)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
