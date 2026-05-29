'use client'

import { useState, useCallback } from 'react'
import { useLearningQueue } from '@/learning/hooks/useLearningQueue'
import { useTestResult } from '@/learning/hooks/useTestResult'
import { registry } from '@/infra/client-registry'
import { syncQueue } from '@/sync/sync-queue'
import { useAuthStore } from '@/stores/auth.store'
import { useWords } from '@/word/hooks/useWords'
import { ModeSelector } from './ModeSelector'
import { TypingMode } from './TypingMode'
import { MultipleChoice } from './MultipleChoice'
import { WrongAnswerSheet } from './WrongAnswerSheet'
import { SessionComplete } from './SessionComplete'
import type { AnswerMode } from '@/answer-log/types'
import type { Word } from '@/word/types'
import { SESSION_SIZE } from '@/shared/constants'

type Phase = 'select' | 'exam' | 'wrong' | 'complete'

export function ExamScreen() {
  const { currentWord, advance } = useLearningQueue()
  const { submit } = useTestResult()
  const { user } = useAuthStore()
  const { words: allWords } = useWords({ status: '승인' })

  const [phase, setPhase] = useState<Phase>('select')
  const [mode, setMode] = useState<AnswerMode>('typing')
  const [sessionSize, setSessionSize] = useState(SESSION_SIZE)
  const [sessionProgress, setSessionProgress] = useState(0)
  const [stats, setStats] = useState({ studied: 0, doneCount: 0, wrongLater: 0 })
  const [wrongWord, setWrongWord] = useState<Word | null>(null)

  const progress = `${sessionProgress} / ${sessionSize}`

  const handleStart = useCallback((m: AnswerMode, size: number) => {
    setMode(m)
    setSessionSize(size)
    setSessionProgress(0)
    setStats({ studied: 0, doneCount: 0, wrongLater: 0 })
    setPhase('exam')
  }, [])

  const handleCorrect = useCallback(async () => {
    if (!currentWord) return
    const result = await submit(currentWord.id, true)
    const isDone = result.ok && result.data.state === 'Done'

    const userId = user?.id ?? 'local'
    await registry.apis.localAnswerLog.create({
      user_id: userId,
      word_id: currentWord.id,
      is_correct: true,
      mode,
      answered_at: new Date().toISOString(),
    })

    setStats((s) => ({
      ...s,
      studied: s.studied + 1,
      doneCount: s.doneCount + (isDone ? 1 : 0),
    }))

    const next = sessionProgress + 1
    setSessionProgress(next)
    if (next >= sessionSize) {
      setPhase('complete')
    } else {
      advance()
    }
  }, [currentWord, submit, mode, sessionProgress, sessionSize, advance, user])

  const handleWrong = useCallback(() => {
    setWrongWord(currentWord)
    setPhase('wrong')
  }, [currentWord])

  const handleViewNow = useCallback(async () => {
    if (!wrongWord) return
    const userId = user?.id ?? 'local'
    const logResult = await registry.apis.localAnswerLog.create({
      user_id: userId,
      word_id: wrongWord.id,
      is_correct: false,
      mode,
      answered_at: new Date().toISOString(),
    })
    if (logResult.ok) {
      await registry.apis.localAnswerLog.markReviewed(logResult.data.id)
      await syncQueue.enqueue({ table: 'answer_logs', action: 'create', payload: { ...logResult.data, reviewed_at: new Date().toISOString() } })
    }
    await submit(wrongWord.id, false)

    const next = sessionProgress + 1
    setSessionProgress(next)
    setStats((s) => ({ ...s, studied: s.studied + 1 }))
    if (next >= sessionSize) {
      setPhase('complete')
    } else {
      advance()
      setPhase('exam')
    }
  }, [wrongWord, mode, sessionProgress, sessionSize, submit, advance, user])

  const handleViewLater = useCallback(async () => {
    if (!wrongWord) return
    const userId = user?.id ?? 'local'
    const logResult = await registry.apis.localAnswerLog.create({
      user_id: userId,
      word_id: wrongWord.id,
      is_correct: false,
      mode,
      answered_at: new Date().toISOString(),
    })
    if (logResult.ok) {
      await syncQueue.enqueue({ table: 'answer_logs', action: 'create', payload: logResult.data })
    }
    await submit(wrongWord.id, false)

    const next = sessionProgress + 1
    setSessionProgress(next)
    setStats((s) => ({ ...s, studied: s.studied + 1, wrongLater: s.wrongLater + 1 }))
    if (next >= sessionSize) {
      setPhase('complete')
    } else {
      advance()
      setPhase('exam')
    }
  }, [wrongWord, mode, sessionProgress, sessionSize, submit, advance, user])

  const handleRetry = () => {
    setSessionProgress(0)
    setStats({ studied: 0, doneCount: 0, wrongLater: 0 })
    setPhase('exam')
  }

  if (phase === 'complete') {
    return <SessionComplete {...stats} onRetry={handleRetry} />
  }

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        시험할 단어가 없습니다
      </div>
    )
  }

  return (
    <>
      {phase === 'select' || phase === 'exam' ? (
        mode === 'typing' ? (
          <TypingMode word={currentWord} progress={progress} onCorrect={handleCorrect} onWrong={handleWrong} />
        ) : (
          <MultipleChoice word={currentWord} allWords={allWords} progress={progress} onCorrect={handleCorrect} onWrong={handleWrong} />
        )
      ) : null}

      <ModeSelector open={phase === 'select'} onStart={handleStart} onClose={() => {}} />

      {phase === 'wrong' && wrongWord && (
        <WrongAnswerSheet word={wrongWord} onViewNow={handleViewNow} onViewLater={handleViewLater} />
      )}
    </>
  )
}
