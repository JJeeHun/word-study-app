import { ok } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { ILearningApi } from '../_interfaces/learning.api'
import type { LearningRecord, HandleTestResultDto } from '@/learning/types'
import type { DexieLearningRecordRepository } from '@/learning/infra/dexie'
import { DONE_THRESHOLD } from '@/shared/constants'

export class LocalLearningApi implements ILearningApi {
  constructor(private readonly repo: DexieLearningRecordRepository) {}

  getByUserId(userId: string): Promise<Result<LearningRecord[]>> {
    return this.repo.findByUserId(userId)
  }

  getByUserAndWord(userId: string, wordId: string): Promise<Result<LearningRecord | null>> {
    return this.repo.findByUserAndWord(userId, wordId)
  }

  async handleTestResult(dto: HandleTestResultDto): Promise<Result<LearningRecord>> {
    const existing = await this.repo.findByUserAndWord(dto.user_id, dto.word_id)
    const prev = existing.ok && existing.data ? existing.data : null

    const consecutive_correct = dto.is_correct ? (prev?.consecutive_correct ?? 0) + 1 : 0
    const state = consecutive_correct >= DONE_THRESHOLD ? 'Done' : 'Learning'

    const record: LearningRecord = {
      user_id: dto.user_id,
      word_id: dto.word_id,
      state,
      consecutive_correct,
      last_reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    await this.repo.upsert(record)
    return ok(record)
  }
}

let instance: LocalLearningApi | null = null

export const getLocalLearningApi = (repo: DexieLearningRecordRepository): LocalLearningApi => {
  if (!instance) instance = new LocalLearningApi(repo)
  return instance
}
