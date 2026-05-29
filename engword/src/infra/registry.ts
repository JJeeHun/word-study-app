import { SupabaseWordRepository } from '@/word/infra/supabase'
import { SupabaseSentenceRepository } from '@/sentence/infra/supabase'
import { SupabaseLearningRecordRepository } from '@/learning/infra/supabase'
import { SupabaseAnswerLogRepository } from '@/answer-log/infra/supabase'
import { SupabaseProfileRepository } from '@/profile/infra/supabase'
import { SupabaseAuthRepository } from '@/auth/infra/supabase'

/** 서버 싱글톤 레지스트리 — NestJS 전환 시 이 파일만 교체 */
export const serverRegistry = {
  word:     new SupabaseWordRepository(),
  sentence: new SupabaseSentenceRepository(),
  learning: new SupabaseLearningRecordRepository(),
  answerLog: new SupabaseAnswerLogRepository(),
  profile:  new SupabaseProfileRepository(),
  auth:     new SupabaseAuthRepository(),
}
