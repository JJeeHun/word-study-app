import type { Result } from '@/shared/result'
import type { Profile, UpdateProfileDto } from './types'

export interface IProfileRepository {
  findById(id: string): Promise<Result<Profile | null>>
  upsert(profile: Profile): Promise<Result<void>>
  update(id: string, dto: UpdateProfileDto): Promise<Result<void>>
}
