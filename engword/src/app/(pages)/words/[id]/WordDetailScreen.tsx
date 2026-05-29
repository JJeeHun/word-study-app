'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Volume2 } from 'lucide-react'
import { useWord } from '@/word/hooks/useWord'
import { registry } from '@/infra/client-registry'
import { speak } from '@/lib/tts'
import { Skeleton } from '@/components/Skeleton'
import { SentenceText } from './SentenceText'
import type { Sentence } from '@/sentence/types'

interface Props {
  id: string
}

const INITIAL_SENTENCE_COUNT = 3

export function WordDetailScreen({ id }: Props) {
  const { word, isLoading } = useWord(id)
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!id) return
    registry.repos.sentence.findByWordId(id).then((r) => {
      if (r.ok) setSentences(r.data)
    })
  }, [id])

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  if (!word) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        단어를 찾을 수 없습니다
      </div>
    )
  }

  const displayedSentences = showAll ? sentences : sentences.slice(0, INITIAL_SENTENCE_COUNT)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-6 space-y-6">
        {/* 단어 + TTS */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">{word.text}</h1>
          <button
            onClick={() => speak(word.text)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="발음 듣기"
          >
            <Volume2 className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* 메타 */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{word.part_of_speech}</span>
          {word.cefr && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{word.cefr}</span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{word.domain}</span>
        </div>

        {/* 어원 */}
        {word.origin && (
          <div className="text-sm">
            <span className="text-muted-foreground">어원 </span>
            <Link
              href={`/words?origin=${encodeURIComponent(word.origin)}`}
              className="text-primary underline underline-offset-2"
            >
              {word.origin}
            </Link>
          </div>
        )}

        {/* 의미 */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">의미</p>
          <p className="text-base text-foreground whitespace-pre-line">{word.meaning}</p>
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
            {sentences.length > INITIAL_SENTENCE_COUNT && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="text-sm text-primary"
              >
                더 보기 ({sentences.length - INITIAL_SENTENCE_COUNT}개)
              </button>
            )}
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="shrink-0 flex justify-between px-6 py-4 border-t border-border">
        <Link href="/words" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 목록
        </Link>
      </div>
    </div>
  )
}
