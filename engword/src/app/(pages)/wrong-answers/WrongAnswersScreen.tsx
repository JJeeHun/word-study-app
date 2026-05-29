'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { registry } from '@/infra/client-registry'
import { syncQueue } from '@/sync/sync-queue'
import { useAuthStore } from '@/stores/auth.store'
import type { AnswerLog } from '@/answer-log/types'

interface WrongItem {
  log: AnswerLog
  wordText: string
  wordMeaning: string
}

export function WrongAnswersScreen() {
  const { user } = useAuthStore()
  const [items, setItems] = useState<WrongItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const userId = user?.id ?? 'local'
    const logsResult = await registry.apis.localAnswerLog.getWrongByUserId(userId)
    if (!logsResult.ok) { setIsLoading(false); return }

    const withWords = await Promise.all(
      logsResult.data.map(async (log) => {
        const wordResult = await registry.apis.localWord.getById(log.word_id)
        return {
          log,
          wordText: wordResult.ok ? wordResult.data.text : log.word_id,
          wordMeaning: wordResult.ok ? wordResult.data.meaning.split('\n')[0] : '',
        }
      })
    )
    setItems(withWords)
    setIsLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const handleReview = async (log: AnswerLog) => {
    await registry.apis.localAnswerLog.markReviewed(log.id)
    await syncQueue.enqueue({
      table: 'answer_logs',
      action: 'update',
      payload: { ...log, reviewed_at: new Date().toISOString() },
    })
    setItems((prev) => prev.filter((i) => i.log.id !== log.id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        불러오는 중...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-center px-6">
        <p className="text-3xl">🎉</p>
        <p className="text-base font-semibold text-foreground">오답 노트가 비었어요!</p>
        <p className="text-sm text-muted-foreground">모두 확인했어요</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="px-4 py-3 border-b border-border">
        <h1 className="text-base font-semibold text-foreground">오답 노트 ({items.length})</h1>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {items.map(({ log, wordText, wordMeaning }) => (
          <div key={log.id} className="flex items-center justify-between px-4 py-4 gap-3">
            <Link href={`/words/${log.word_id}`} className="min-w-0">
              <p className="font-medium text-foreground truncate">{wordText}</p>
              <p className="text-sm text-muted-foreground truncate">{wordMeaning}</p>
            </Link>
            <button
              onClick={() => handleReview(log)}
              className="shrink-0 px-3 py-1.5 rounded-lg border border-input text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              확인 완료
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
