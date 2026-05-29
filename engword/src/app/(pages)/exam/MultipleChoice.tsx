'use client'

import { useMemo } from 'react'
import type { Word } from '@/word/types'

interface Props {
  word: Word
  allWords: Word[]
  progress: string
  onCorrect: () => void
  onWrong: () => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function MultipleChoice({ word, allWords, progress, onCorrect, onWrong }: Props) {
  const choices = useMemo(() => {
    const distractors = allWords
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => ({ id: w.id, meaning: w.meaning.split('\n')[0], isCorrect: false }))

    return shuffle([
      { id: word.id, meaning: word.meaning.split('\n')[0], isCorrect: true },
      ...distractors,
    ])
  }, [word.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="px-6 pt-4 text-xs text-muted-foreground">{progress}</div>

      <div className="flex-1 flex flex-col justify-center px-6 space-y-2">
        <p className="text-sm text-muted-foreground mb-2">단어</p>
        <h1 className="text-3xl font-bold text-foreground">{word.text}</h1>
        {word.part_of_speech && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
            {word.part_of_speech}
          </span>
        )}
      </div>

      <div className="shrink-0 px-4 pb-6 space-y-3">
        {choices.map((choice, i) => (
          <button
            key={choice.id}
            onClick={() => (choice.isCorrect ? onCorrect() : onWrong())}
            className="w-full min-h-[52px] px-4 py-3 rounded-xl border border-input bg-background text-left text-sm hover:bg-muted transition-colors"
          >
            <span className="text-muted-foreground mr-2">{i + 1}.</span>
            {choice.meaning}
          </button>
        ))}
      </div>
    </div>
  )
}
