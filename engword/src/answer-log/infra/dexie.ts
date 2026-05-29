import { db } from '@/infra/db'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { IAnswerLogRepository } from '../repository'
import type { AnswerLog, CreateAnswerLogDto } from '../types'

export class DexieAnswerLogRepository implements IAnswerLogRepository {
  async findWrongByUserId(userId: string): Promise<Result<AnswerLog[]>> {
    try {
      const logs = await db.answer_logs
        .where('user_id')
        .equals(userId)
        .filter(l => l.is_correct === false && l.reviewed_at === null)
        .toArray()
      return ok(logs)
    } catch {
      return err('db_error')
    }
  }

  async findByUserId(userId: string): Promise<Result<AnswerLog[]>> {
    try {
      const logs = await db.answer_logs.where('user_id').equals(userId).toArray()
      return ok(logs)
    } catch {
      return err('db_error')
    }
  }

  async create(dto: CreateAnswerLogDto): Promise<Result<AnswerLog>> {
    try {
      const log: AnswerLog = {
        id: crypto.randomUUID(),
        ...dto,
        reviewed_at: null,
        updated_at: new Date().toISOString(),
      }
      await db.answer_logs.add(log)
      return ok(log)
    } catch {
      return err('db_error')
    }
  }

  async updateReviewedAt(id: string, reviewedAt: string): Promise<Result<void>> {
    try {
      await db.answer_logs.update(id, { reviewed_at: reviewedAt, updated_at: new Date().toISOString() })
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(logs: AnswerLog[]): Promise<Result<void>> {
    try {
      await db.answer_logs.bulkPut(logs)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
