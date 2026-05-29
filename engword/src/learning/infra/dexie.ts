import { db } from '@/infra/db'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { ILearningRecordRepository } from '../repository'
import type { LearningRecord } from '../types'

export class DexieLearningRecordRepository implements ILearningRecordRepository {
  async findByUserId(userId: string): Promise<Result<LearningRecord[]>> {
    try {
      const records = await db.learning_records
        .where('user_id')
        .equals(userId)
        .filter(r => r.deleted_at === null)
        .toArray()
      return ok(records)
    } catch {
      return err('db_error')
    }
  }

  async findByUserAndWord(userId: string, wordId: string): Promise<Result<LearningRecord | null>> {
    try {
      const record = await db.learning_records.get([userId, wordId])
      return ok(record ?? null)
    } catch {
      return err('db_error')
    }
  }

  async upsert(record: LearningRecord): Promise<Result<void>> {
    try {
      await db.learning_records.put(record)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(records: LearningRecord[]): Promise<Result<void>> {
    try {
      await db.learning_records.bulkPut(records)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
