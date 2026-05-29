'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLearningQueue } from '@/learning/hooks/useLearningQueue'
import { registry } from '@/infra/client-registry'
import { speak } from '@/lib/tts'
import { SentenceText } from '../words/[id]/SentenceText'
import { Skeleton } from '@/components/Skeleton'
import type { Sentence } from '@/sentence/types'

export function StudyScreen() {
  const router = useRouter()
  const { currentWord, remaining, isLoading, advance } = useLearningQueue()
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setSentences([])
    setShowAll(false)
    if (!currentWord) return
    registry.repos.sentence.findByWordId(currentWord.id).then((r) => {
      if (r.ok) setSentences(r.data)
    })
  }, [currentWord?.id])

  if (isLoading && !currentWord) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-6">
        <p className="text-lg font-semibold text-foreground">외울 단어가 없습니다</p>
        <p className="text-sm text-muted-foreground">단어 목록에서 학습할 단어를 추가해주세요</p>
        <button
          onClick={() => router.push('/words')}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          단어 목록으로
        </button>
      </div>
    )
  }

  const displayedSentences = showAll ? sentences : sentences.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 진행 표시 */}
      <div className="px-6 pt-4 text-xs text-muted-foreground">
        남은 단어 {remaining}개
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* 단어 + TTS */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">{currentWord.text}</h1>
          <button
            onClick={() => speak(currentWord.text)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="발음 듣기"
          >
            <Volume2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* 메타 */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{currentWord.part_of_speech}</span>
          {currentWord.cefr && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{currentWord.cefr}</span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{currentWord.domain}</span>
          {currentWord.origin && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{currentWord.origin}</span>
          )}
        </div>

        {/* 의미 */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">의미</p>
          <p className="text-base text-foreground whitespace-pre-line">{currentWord.meaning}</p>
        </div>

        {/* 예문 */}
        {sentences.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">예문</p>
            {displayedSentences.map((s) => (
              <p key={s.id} className="text-sm text-foreground leading-relaxed">
                <SentenceText text={s.text} />
              </p>
            ))}
            {sentences.length > 3 && !showAll && (
              <button onClick={() => setShowAll(true)} className="text-sm text-primary">
                더 보기 ({sentences.length - 3}개)
              </button>
            )}
          </div>
        )}
      </div>

      {/* 하단 prev/next */}
      <div className="shrink-0 flex justify-between px-6 py-4 border-t border-border">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          이전
        </button>
        <button
          onClick={advance}
          className="flex items-center gap-1 text-sm text-primary font-medium"
        >
          다음
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
