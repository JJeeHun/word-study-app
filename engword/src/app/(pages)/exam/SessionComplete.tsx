'use client'

import { useRouter } from 'next/navigation'
import { useQueueStore } from '@/stores/queue.store'

interface Props {
  studied: number
  doneCount: number
  wrongLater: number
  onRetry: () => void
}

export function SessionComplete({ studied, doneCount, wrongLater, onRetry }: Props) {
  const router = useRouter()
  const { queue, currentIndex } = useQueueStore()
  const hasMore = currentIndex < queue.length - 1

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-background px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <p className="text-4xl">{hasMore ? '🎉' : '🏆'}</p>
        <h1 className="text-xl font-bold text-foreground">
          {hasMore ? '세션 완료!' : '오늘 큐 완료!'}
        </h1>

        <div className="w-full max-w-xs space-y-3 text-sm">
          <div className="flex justify-between px-4 py-3 rounded-xl bg-muted">
            <span className="text-muted-foreground">오늘 학습</span>
            <span className="font-semibold text-foreground">{studied}개</span>
          </div>
          <div className="flex justify-between px-4 py-3 rounded-xl bg-muted">
            <span className="text-muted-foreground">Done 전환</span>
            <span className="font-semibold text-foreground">{doneCount}개</span>
          </div>
          <div className="flex justify-between px-4 py-3 rounded-xl bg-muted">
            <span className="text-muted-foreground">오답 나중에 보기</span>
            <span className="font-semibold text-foreground">{wrongLater}개</span>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex-1 h-12 rounded-xl border border-input text-sm text-muted-foreground"
        >
          홈으로
        </button>
        {hasMore && (
          <button
            onClick={onRetry}
            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            한 번 더
          </button>
        )}
      </div>
    </div>
  )
}
