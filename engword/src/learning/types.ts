import type { Word } from '@/word/types'

export type LearningState = 'New' | 'Learning' | 'Done'

export interface LearningRecord {
  user_id: string
  word_id: string
  state: LearningState
  consecutive_correct: number
  last_reviewed_at: string | null
  updated_at: string
  deleted_at: string | null
}

export interface HandleTestResultDto {
  user_id: string
  word_id: string
  is_correct: boolean
}

export interface LearningRecordWithWord extends LearningRecord {
  word: Word
}
