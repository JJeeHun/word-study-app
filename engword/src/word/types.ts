export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction'
export type WordStatus = '미승인' | '승인'

export interface Word {
  id: string
  text: string
  meaning: string
  difficulty: number
  frequency: number
  cefr: CefrLevel | null
  part_of_speech: PartOfSpeech
  origin: string | null
  domain: string
  status: WordStatus
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface WordFilter {
  domain?: string
  status?: WordStatus
  cefr?: CefrLevel
  part_of_speech?: PartOfSpeech
}

export interface CreateWordRequestDto {
  text: string
  meaning: string
  difficulty: number
  frequency: number
  cefr?: CefrLevel
  part_of_speech: PartOfSpeech
  origin?: string
  domain: string
}
