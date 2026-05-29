import { eq } from 'drizzle-orm'
import { drizzleDb } from '@/infra/drizzle'
import { profiles } from '@/infra/schema'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { IProfileRepository } from '../repository'
import type { Profile, UpdateProfileDto } from '../types'

export class SupabaseProfileRepository implements IProfileRepository {
  async findById(id: string): Promise<Result<Profile | null>> {
    try {
      const rows = await drizzleDb.select().from(profiles).where(eq(profiles.id, id)).limit(1)
      return ok((rows[0] ?? null) as unknown as Profile | null)
    } catch {
      return err('db_error')
    }
  }

  async upsert(profile: Profile): Promise<Result<void>> {
    try {
      await drizzleDb
        .insert(profiles)
        .values(profile as any)
        .onConflictDoUpdate({ target: profiles.id, set: { ...profile, updated_at: new Date() } as any })
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async update(id: string, dto: UpdateProfileDto): Promise<Result<void>> {
    try {
      await drizzleDb.update(profiles).set({ ...dto, updated_at: new Date() } as any).where(eq(profiles.id, id))
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
