import type { Result } from '@/shared/result'
import type { IAnswerLogApi } from '../_interfaces/answer-log.api'
import type { AnswerLog, CreateAnswerLogDto } from '@/answer-log/types'
import type { DexieAnswerLogRepository } from '@/answer-log/infra/dexie'

export class LocalAnswerLogApi implements IAnswerLogApi {
  constructor(private readonly repo: DexieAnswerLogRepository) {}

  getWrongByUserId(userId: string): Promise<Result<AnswerLog[]>> {
    return this.repo.findWrongByUserId(userId)
  }

  create(dto: CreateAnswerLogDto): Promise<Result<AnswerLog>> {
    return this.repo.create(dto)
  }

  markReviewed(id: string): Promise<Result<void>> {
    return this.repo.updateReviewedAt(id, new Date().toISOString())
  }
}

let instance: LocalAnswerLogApi | null = null

export const getLocalAnswerLogApi = (repo: DexieAnswerLogRepository): LocalAnswerLogApi => {
  if (!instance) instance = new LocalAnswerLogApi(repo)
  return instance
}
