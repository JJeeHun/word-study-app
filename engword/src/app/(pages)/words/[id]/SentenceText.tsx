'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { tokenize } from '@/lib/nlp'
import { db } from '@/infra/db'

interface Props {
  text: string
}

interface Token {
  raw: string
  wordId: string | null
}

export function SentenceText({ text }: Props) {
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const resolve = async () => {
      const raw = tokenize(text)
      const resolved = await Promise.all(
        raw.map(async ({ raw: rawToken, normalized }) => {
          if (!normalized) return { raw: rawToken, wordId: null }
          const word = await db.words.where('text').equalsIgnoreCase(normalized).first()
          return { raw: rawToken, wordId: word?.id ?? null }
        })
      )
      setTokens(resolved)
    }
    resolve()
  }, [text])

  if (tokens.length === 0) return <span>{text}</span>

  return (
    <span>
      {tokens.map((token, i) => (
        <span key={i}>
          {token.wordId ? (
            <Link
              href={`/words/${token.wordId}`}
              className="text-primary underline underline-offset-2"
            >
              {token.raw}
            </Link>
          ) : (
            token.raw
          )}
          {i < tokens.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
