import type { Result } from '@/shared/result'
import type { LearningRecord } from './types'

export interface ILearningRecordRepository {
  findByUserId(userId: string): Promise<Result<LearningRecord[]>>
  findByUserAndWord(userId: string, wordId: string): Promise<Result<LearningRecord | null>>
  upsert(record: LearningRecord): Promise<Result<void>>
  upsertMany(records: LearningRecord[]): Promise<Result<void>>
}
