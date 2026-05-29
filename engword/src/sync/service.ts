import { serverRegistry } from '@/infra/registry'
import { PUSH_TABLES } from './policy'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { SyncItem } from '@/api/remote/sync.remote.api'
import type { LearningRecord } from '@/learning/types'
import type { AnswerLog } from '@/answer-log/types'
import type { Profile } from '@/profile/types'

export async function applySingle(item: SyncItem): Promise<Result<void>> {
  if (!PUSH_TABLES.has(item.table)) {
    return err(`table_not_allowed: ${item.table}`)
  }
  return applyItem(item)
}

export async function applyBatch(items: SyncItem[]): Promise<Result<void>> {
  for (const item of items) {
    if (!PUSH_TABLES.has(item.table)) {
      return err(`table_not_allowed: ${item.table}`)
    }
  }
  // 전체 validation 통과 후 일괄 적용
  for (const item of items) {
    const result = await applyItem(item)
    if (!result.ok) return result
  }
  return ok(undefined)
}

async function applyItem(item: SyncItem): Promise<Result<void>> {
  const payload = item.payload as any

  switch (item.table) {
    case 'learning_records':
      return serverRegistry.learning.upsertMany([payload as LearningRecord])

    case 'answer_logs': {
      const log = payload as AnswerLog
      const result = await serverRegistry.answerLog.upsertMany([log])
      return result
    }

    case 'profiles':
      return serverRegistry.profile.upsert(payload as Profile)

    default:
      return err(`unhandled_table: ${item.table}`)
  }
}
