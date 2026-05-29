import { eq, gt } from 'drizzle-orm'
import { drizzleDb } from '@/infra/drizzle'
import { sentences, word_sentences } from '@/infra/schema'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { ISentenceRepository } from '../repository'
import type { Sentence, WordSentence } from '../types'

export class SupabaseSentenceRepository implements ISentenceRepository {
  async findByWordId(wordId: string): Promise<Result<Sentence[]>> {
    try {
      const relations = await drizzleDb
        .select()
        .from(word_sentences)
        .where(eq(word_sentences.word_id, wordId))
      const ids = relations.map(r => r.sentence_id)
      if (!ids.length) return ok([])
      const rows = await Promise.all(
        ids.map(id => drizzleDb.select().from(sentences).where(eq(sentences.id, id)).limit(1))
      )
      return ok(rows.flatMap(r => r) as unknown as Sentence[])
    } catch {
      return err('db_error')
    }
  }

  async findSince(since: string): Promise<Result<Sentence[]>> {
    try {
      const rows = await drizzleDb.select().from(sentences).where(gt(sentences.updated_at, new Date(since)))
      return ok(rows as unknown as Sentence[])
    } catch {
      return err('db_error')
    }
  }

  async findWordSentencesSince(since: string): Promise<Result<WordSentence[]>> {
    try {
      const rows = await drizzleDb.select().from(word_sentences).where(gt(word_sentences.updated_at, new Date(since)))
      return ok(rows as unknown as WordSentence[])
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(rows: Sentence[]): Promise<Result<void>> {
    try {
      if (!rows.length) return ok(undefined)
      await drizzleDb.insert(sentences).values(rows as any).onConflictDoUpdate({ target: sentences.id, set: { updated_at: new Date() } })
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async upsertManyWordSentences(rows: WordSentence[]): Promise<Result<void>> {
    try {
      if (!rows.length) return ok(undefined)
      await drizzleDb.insert(word_sentences).values(rows as any).onConflictDoUpdate({ target: word_sentences.id, set: { updated_at: new Date() } })
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
