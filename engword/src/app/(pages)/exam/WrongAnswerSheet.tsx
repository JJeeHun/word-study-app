'use client'

import type { Word } from '@/word/types'

interface Props {
  word: Word
  onViewNow: () => void
  onViewLater: () => void
}

export function WrongAnswerSheet({ word, onViewNow, onViewLater }: Props) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" />
      <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 space-y-4">
        <p className="text-sm text-muted-foreground text-center">괜찮아, 같이 다시 해보자!</p>
        <div className="space-y-1">
          <p className="text-xl font-bold text-foreground">{word.text}</p>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{word.meaning}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onViewLater}
            className="flex-1 h-12 rounded-xl border border-input text-sm text-muted-foreground"
          >
            나중에 보기
          </button>
          <button
            onClick={onViewNow}
            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            지금 보기
          </button>
        </div>
      </div>
    </>
  )
}
