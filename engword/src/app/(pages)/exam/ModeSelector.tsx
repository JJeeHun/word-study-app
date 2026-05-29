'use client'

import type { AnswerMode } from '@/answer-log/types'
import { SESSION_SIZE } from '@/shared/constants'

interface Props {
  open: boolean
  onStart: (mode: AnswerMode, sessionSize: number) => void
  onClose: () => void
}

export function ModeSelector({ open, onStart, onClose }: Props) {
  if (!open) return null

  const handleStart = (mode: AnswerMode) => {
    onStart(mode, SESSION_SIZE)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 space-y-4">
        <h2 className="text-base font-semibold">시험 모드 선택</h2>
        <button
          onClick={() => handleStart('typing')}
          className="w-full h-14 rounded-xl border border-input text-left px-4 hover:bg-muted transition-colors"
        >
          <p className="font-medium text-foreground">타이핑</p>
          <p className="text-xs text-muted-foreground">의미를 보고 단어를 입력해요</p>
        </button>
        <button
          onClick={() => handleStart('multiple_choice')}
          className="w-full h-14 rounded-xl border border-input text-left px-4 hover:bg-muted transition-colors"
        >
          <p className="font-medium text-foreground">객관식</p>
          <p className="text-xs text-muted-foreground">단어를 보고 의미를 선택해요</p>
        </button>
      </div>
    </>
  )
}
