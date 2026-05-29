export type AnswerMode = 'typing' | 'multiple_choice'

export interface AnswerLog {
  id: string
  user_id: string
  word_id: string
  is_correct: boolean
  mode: AnswerMode
  answered_at: string
  reviewed_at: string | null
  updated_at: string
}

export interface CreateAnswerLogDto {
  user_id: string
  word_id: string
  is_correct: boolean
  mode: AnswerMode
  answered_at: string
}
