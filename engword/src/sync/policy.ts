/** Push 허용 테이블 목록 — 프론트에서 쓰기 가능한 테이블만 */
export const PUSH_TABLES = new Set([
  'learning_records',
  'answer_logs',
  'profiles',
  'user_pets',
])

/** Pull 전용 테이블 — 서버에서만 쓰기 */
export const PULL_TABLES = new Set([
  'words',
  'sentences',
  'word_sentences',
  'pets',
])
