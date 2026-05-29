import Dexie, { type EntityTable } from 'dexie'
import type { Word } from '@/word/types'
import type { Sentence, WordSentence } from '@/sentence/types'
import type { LearningRecord } from '@/learning/types'
import type { AnswerLog } from '@/answer-log/types'
import type { Profile } from '@/profile/types'
import type { Pet, UserPet } from '@/pet/types'

export class EngwordDb extends Dexie {
  words!: EntityTable<Word, 'id'>
  sentences!: EntityTable<Sentence, 'id'>
  word_sentences!: EntityTable<WordSentence, 'id'>
  learning_records!: EntityTable<LearningRecord, 'word_id'>
  answer_logs!: EntityTable<AnswerLog, 'id'>
  profiles!: EntityTable<Profile, 'id'>
  pets!: EntityTable<Pet, 'id'>
  user_pets!: EntityTable<UserPet, 'id'>

  constructor() {
    super('engword')
    this.version(1).stores({
      words: 'id, text, domain, status, updated_at',
      sentences: 'id, updated_at',
      word_sentences: 'id, word_id, sentence_id',
      learning_records: '[user_id+word_id], user_id, word_id, state, last_reviewed_at, updated_at',
      answer_logs: 'id, user_id, word_id, is_correct, reviewed_at, answered_at',
      profiles: 'id',
      pets: 'id',
      user_pets: 'id, user_id, pet_id, type',
    })
  }
}

export const db = new EngwordDb()
