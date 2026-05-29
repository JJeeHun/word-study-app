import { eq, isNull, gt } from 'drizzle-orm'
import { drizzleDb } from '@/infra/drizzle'
import { words } from '@/infra/schema'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { IWordRepository } from '../repository'
import type { Word, WordFilter, CreateWordRequestDto } from '../types'
import { getSupabaseServer } from '@/infra/supabase-server'

export class SupabaseWordRepository implements IWordRepository {
  async findById(id: string): Promise<Result<Word>> {
    try {
      const rows = await drizzleDb.select().from(words).where(eq(words.id, id)).limit(1)
      if (!rows[0]) return err('word_not_found')
      return ok(rows[0] as unknown as Word)
    } catch {
      return err('db_error')
    }
  }

  async findAll(filter?: WordFilter): Promise<Result<Word[]>> {
    try {
      let q = drizzleDb.select().from(words).where(isNull(words.deleted_at)).$dynamic()
      if (filter?.domain)         q = q.where(eq(words.domain, filter.domain))
      if (filter?.status)         q = q.where(eq(words.status, filter.status as any))
      if (filter?.cefr)           q = q.where(eq(words.cefr, filter.cefr as any))
      if (filter?.part_of_speech) q = q.where(eq(words.part_of_speech, filter.part_of_speech as any))
      const rows = await q
      return ok(rows as unknown as Word[])
    } catch {
      return err('db_error')
    }
  }

  async findSince(since: string): Promise<Result<Word[]>> {
    try {
      const rows = await drizzleDb
        .select()
        .from(words)
        .where(gt(words.updated_at, new Date(since)))
      return ok(rows as unknown as Word[])
    } catch {
      return err('db_error')
    }
  }

  async upsertMany(rows: Word[]): Promise<Result<void>> {
    try {
      if (!rows.length) return ok(undefined)
      await drizzleDb
        .insert(words)
        .values(rows as any)
        .onConflictDoUpdate({ target: words.id, set: { updated_at: new Date() } })
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async request(dto: CreateWordRequestDto): Promise<Result<Word>> {
    try {
      const sb = getSupabaseServer()
      const { data, error } = await sb.from('words').insert({ ...dto, domain: dto.domain.toUpperCase(), status: '미승인' }).select().single()
      if (error) return err(error.message)
      return ok(data as unknown as Word)
    } catch {
      return err('db_error')
    }
  }
}
