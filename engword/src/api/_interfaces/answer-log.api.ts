import type { Result } from '@/shared/result'
import type { AnswerLog, CreateAnswerLogDto } from '@/answer-log/types'

export interface IAnswerLogApi {
  getWrongByUserId(userId: string): Promise<Result<AnswerLog[]>>
  create(dto: CreateAnswerLogDto): Promise<Result<AnswerLog>>
  markReviewed(id: string): Promise<Result<void>>
}
