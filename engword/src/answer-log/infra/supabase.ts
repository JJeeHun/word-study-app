import { and, eq, isNull } from 'drizzle-orm'
import { drizzleDb } from '@/infra/drizzle'
import { answer_logs } from '@/infra/schema'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { IAnswerLogRepository } from '../repository'
import type { AnswerLog, CreateAnswerLogDto } from '../types'

export class SupabaseAnswerLogRepository implements IAnswerLogRepository {
  async findWrongByUserId(userId: string): Promise<Result<AnswerLog[]>> {
    try {
      const rows = await drizzleDb
        .select()
        .from(answer_logs)
        .where(and(eq(answer_logs.user_id, userId), eq(answer_logs.is_correct, false), isNull(answer_logs.reviewed_at)))
      return ok(rows as unknown as AnswerLog[])
    } catch {
      return err('db_error')
    }
  }

  async findByUserId(userId: string): Promise<Result<AnswerLog[]>> {
    try {
      const rows = await drizzleDb.select().from(answer_logs).where(eq(answer_logs.user_id, userId))
      return ok(rows as unknown as AnswerLog[])
    } catch {
      return err('db_error')
    }
  }

  async create(dto: CreateAnswerLogDto): Promise<Result<AnswerLog>> {
    try {
      const rows = await drizzleDb
        .insert(answer_logs)
        .values({ ...dto, answered_at: new Date(dto.answered_at), updated_at: new Date() } as any)
        .returning()
      return ok(rows[0] as unknown as AnswerLog)
    } catch {
      return err('db_error')
    }
  }

  async updateReviewedAt(id: string, reviewedAt: string): Promise<Result<void>> {
    try {
      await drizzleDb.update(answer_logs).set({ reviewed_at: new Date(reviewedAt) }).where(eq(answer_logs.id, id))
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(records: AnswerLog[]): Promise<Result<void>> {
    try {
      if (!records.length) return ok(undefined)
      for (const r of records) {
        await drizzleDb
          .insert(answer_logs)
          .values(r as any)
          .onConflictDoUpdate({
            target: answer_logs.id,
            // reviewed_at non-null wins
            set: { reviewed_at: r.reviewed_at ? new Date(r.reviewed_at) : undefined, updated_at: new Date() },
          })
      }
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
