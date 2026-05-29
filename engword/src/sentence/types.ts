export interface Sentence {
  id: string
  text: string
  source: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface WordSentence {
  id: string
  word_id: string
  sentence_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
