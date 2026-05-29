import type { Result } from '@/shared/result'
import type { AnswerLog, CreateAnswerLogDto } from './types'

export interface IAnswerLogRepository {
  findWrongByUserId(userId: string): Promise<Result<AnswerLog[]>>
  findByUserId(userId: string): Promise<Result<AnswerLog[]>>
  create(dto: CreateAnswerLogDto): Promise<Result<AnswerLog>>
  updateReviewedAt(id: string, reviewedAt: string): Promise<Result<void>>
  upsertMany(logs: AnswerLog[]): Promise<Result<void>>
}
