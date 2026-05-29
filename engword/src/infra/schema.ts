import {
  pgTable, uuid, varchar, text, integer, boolean,
  timestamp, pgEnum, primaryKey, index,
} from 'drizzle-orm/pg-core'

// ── Enums ──────────────────────────────────────────────
export const cefrEnum       = pgEnum('cefr_level',    ['A1','A2','B1','B2','C1','C2'])
export const posEnum        = pgEnum('part_of_speech', ['noun','verb','adjective','adverb','preposition','conjunction'])
export const wordStatusEnum = pgEnum('word_status',   ['미승인','승인'])
export const learningStateEnum = pgEnum('learning_state', ['New','Learning','Done'])
export const answerModeEnum = pgEnum('answer_mode',   ['typing','multiple_choice'])
export const petPositionEnum = pgEnum('pet_position', ['top-left','top-right','bottom-left','bottom-right'])
export const petTypeEnum    = pgEnum('pet_type',      ['main','domain'])

// ── Pull 테이블 (관리자 데이터) ─────────────────────────

export const words = pgTable('words', {
  id:             uuid('id').primaryKey().defaultRandom(),
  text:           varchar('text', { length: 255 }).notNull().unique(),
  meaning:        text('meaning').notNull(),
  difficulty:     integer('difficulty').notNull(),
  frequency:      integer('frequency').notNull(),
  cefr:           cefrEnum('cefr'),
  part_of_speech: posEnum('part_of_speech').notNull(),
  origin:         varchar('origin', { length: 100 }),
  domain:         varchar('domain', { length: 100 }).notNull(),
  status:         wordStatusEnum('status').notNull().default('미승인'),
  created_at:     timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at:     timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at:     timestamp('deleted_at', { withTimezone: true }),
}, (t) => ({
  domainIdx:  index('words_domain_idx').on(t.domain),
  updatedIdx: index('words_updated_at_idx').on(t.updated_at),
}))

export const sentences = pgTable('sentences', {
  id:         uuid('id').primaryKey().defaultRandom(),
  text:       text('text').notNull(),
  source:     varchar('source', { length: 255 }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
})

export const word_sentences = pgTable('word_sentences', {
  id:          uuid('id').primaryKey().defaultRandom(),
  word_id:     uuid('word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
  sentence_id: uuid('sentence_id').notNull().references(() => sentences.id, { onDelete: 'cascade' }),
  created_at:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at:  timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at:  timestamp('deleted_at', { withTimezone: true }),
}, (t) => ({
  wordIdx: index('ws_word_id_idx').on(t.word_id),
}))

export const pets = pgTable('pets', {
  id:      uuid('id').primaryKey().defaultRandom(),
  species: varchar('species', { length: 100 }).notNull(),
  variant: varchar('variant', { length: 100 }).notNull(),
  name:    varchar('name', { length: 100 }).notNull(),
})

// ── Push 테이블 (사용자 데이터) ─────────────────────────

export const profiles = pgTable('profiles', {
  id:               uuid('id').primaryKey(),
  email:            varchar('email', { length: 255 }).notNull(),
  synced_at:        timestamp('synced_at', { withTimezone: true }),
  current_streak:   integer('current_streak').notNull().default(0),
  last_study_date:  timestamp('last_study_date', { withTimezone: true }),
  pet_position:     petPositionEnum('pet_position').notNull().default('bottom-right'),
  has_seen_nav_hint: boolean('has_seen_nav_hint').notNull().default(false),
  created_at:       timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at:       timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const learning_records = pgTable('learning_records', {
  user_id:             uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  word_id:             uuid('word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
  state:               learningStateEnum('state').notNull().default('New'),
  consecutive_correct: integer('consecutive_correct').notNull().default(0),
  last_reviewed_at:    timestamp('last_reviewed_at', { withTimezone: true }),
  updated_at:          timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at:          timestamp('deleted_at', { withTimezone: true }),
}, (t) => ({
  pk:         primaryKey({ columns: [t.user_id, t.word_id] }),
  stateIdx:   index('lr_state_idx').on(t.user_id, t.state),
  reviewedIdx: index('lr_reviewed_at_idx').on(t.user_id, t.last_reviewed_at),
}))

export const answer_logs = pgTable('answer_logs', {
  id:          uuid('id').primaryKey().defaultRandom(),
  user_id:     uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  word_id:     uuid('word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
  is_correct:  boolean('is_correct').notNull(),
  mode:        answerModeEnum('mode').notNull(),
  answered_at: timestamp('answered_at', { withTimezone: true }).notNull(),
  reviewed_at: timestamp('reviewed_at', { withTimezone: true }),
  updated_at:  timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx:  index('al_user_id_idx').on(t.user_id),
  wrongIdx: index('al_wrong_idx').on(t.user_id, t.is_correct, t.reviewed_at),
}))

export const user_pets = pgTable('user_pets', {
  id:         uuid('id').primaryKey().defaultRandom(),
  user_id:    uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  pet_id:     uuid('pet_id').notNull().references(() => pets.id),
  type:       petTypeEnum('type').notNull(),
  domain:     varchar('domain', { length: 100 }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
