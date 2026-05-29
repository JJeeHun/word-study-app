'use client'

import { useCallback } from 'react'
import { registry } from '@/infra/client-registry'
import { syncQueue } from '@/sync/sync-queue'
import { useAuthStore } from '@/stores/auth.store'

export function useTestResult() {
  const { user } = useAuthStore()

  const submit = useCallback(
    async (wordId: string, isCorrect: boolean) => {
      const userId = user?.id ?? 'local'

      const result = await registry.apis.localLearning.handleTestResult({
        user_id: userId,
        word_id: wordId,
        is_correct: isCorrect,
      })

      if (!result.ok) return result

      // 로컬 변경분을 싱크 큐에 적재
      await syncQueue.enqueue({
        table: 'learning_records',
        action: 'update',
        payload: result.data,
      })

      return result
    },
    [user]
  )

  return { submit }
}
