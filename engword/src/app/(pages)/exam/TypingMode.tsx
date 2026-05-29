'use client'

import { useState, useRef, useEffect } from 'react'
import { isTypingCorrect } from '@/lib/levenshtein'
import type { Word } from '@/word/types'

interface Props {
  word: Word
  progress: string
  onCorrect: () => void
  onWrong: () => void
}

export function TypingMode({ word, progress, onCorrect, onWrong }: Props) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInput('')
    inputRef.current?.focus()
  }, [word.id])

  const handleSubmit = () => {
    if (!input.trim()) return
    if (isTypingCorrect(input, word.text)) {
      onCorrect()
    } else {
      onWrong()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="px-6 pt-4 text-xs text-muted-foreground">{progress}</div>

      <div className="flex-1 flex flex-col justify-center px-6 space-y-4">
        <p className="text-sm text-muted-foreground">의미</p>
        <p className="text-xl font-semibold text-foreground whitespace-pre-line leading-relaxed">
          {word.meaning}
        </p>
        {word.part_of_speech && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
            {word.part_of_speech}
          </span>
        )}
      </div>

      <div className="shrink-0 px-4 pb-4 space-y-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          type="text"
          placeholder="단어를 입력하세요"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          className="w-full h-12 px-4 rounded-xl border border-input bg-background text-base focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40"
        >
          제출
        </button>
      </div>
    </div>
  )
}
