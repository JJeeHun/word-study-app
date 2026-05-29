import { and, eq } from 'drizzle-orm'
import { drizzleDb } from '@/infra/drizzle'
import { learning_records } from '@/infra/schema'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { ILearningRecordRepository } from '../repository'
import type { LearningRecord } from '../types'

export class SupabaseLearningRecordRepository implements ILearningRecordRepository {
  async findByUserId(userId: string): Promise<Result<LearningRecord[]>> {
    try {
      const rows = await drizzleDb.select().from(learning_records).where(eq(learning_records.user_id, userId))
      return ok(rows as unknown as LearningRecord[])
    } catch {
      return err('db_error')
    }
  }

  async findByUserAndWord(userId: string, wordId: string): Promise<Result<LearningRecord | null>> {
    try {
      const rows = await drizzleDb
        .select()
        .from(learning_records)
        .where(and(eq(learning_records.user_id, userId), eq(learning_records.word_id, wordId)))
        .limit(1)
      return ok((rows[0] ?? null) as unknown as LearningRecord | null)
    } catch {
      return err('db_error')
    }
  }

  async upsert(record: LearningRecord): Promise<Result<void>> {
    try {
      await drizzleDb
        .insert(learning_records)
        .values(record as any)
        .onConflictDoUpdate({
          target: [learning_records.user_id, learning_records.word_id],
          set: {
            state: record.state as any,
            consecutive_correct: record.consecutive_correct,
            last_reviewed_at: record.last_reviewed_at ? new Date(record.last_reviewed_at) : null,
            updated_at: new Date(record.updated_at),
          },
        })
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(records: LearningRecord[]): Promise<Result<void>> {
    try {
      for (const r of records) await this.upsert(r)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
