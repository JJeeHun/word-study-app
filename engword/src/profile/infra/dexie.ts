import { db } from '@/infra/db'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { IProfileRepository } from '../repository'
import type { Profile, UpdateProfileDto } from '../types'

export class DexieProfileRepository implements IProfileRepository {
  async findById(id: string): Promise<Result<Profile | null>> {
    try {
      const profile = await db.profiles.get(id)
      return ok(profile ?? null)
    } catch {
      return err('db_error')
    }
  }

  async upsert(profile: Profile): Promise<Result<void>> {
    try {
      await db.profiles.put(profile)
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }

  async update(id: string, dto: UpdateProfileDto): Promise<Result<void>> {
    try {
      await db.profiles.update(id, { ...dto, updated_at: new Date().toISOString() })
      return ok(undefined)
    } catch {
      return err('db_error')
    }
  }
}
