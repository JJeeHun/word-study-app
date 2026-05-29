import type { Result } from '@/shared/result'
import type { LearningRecord, HandleTestResultDto } from '@/learning/types'

export interface ILearningApi {
  getByUserId(userId: string): Promise<Result<LearningRecord[]>>
  getByUserAndWord(userId: string, wordId: string): Promise<Result<LearningRecord | null>>
  handleTestResult(dto: HandleTestResultDto): Promise<Result<LearningRecord>>
}
