import Link from 'next/link'
import type { Word } from '@/word/types'

interface Props {
  word: Word
}

export function WordCard({ word }: Props) {
  return (
    <Link
      href={`/words/${word.id}`}
      className="flex items-center justify-between px-4 h-full border-b border-border hover:bg-muted/50 transition-colors"
    >
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate">{word.text}</p>
        <p className="text-sm text-muted-foreground truncate">{word.meaning.split('\n')[0]}</p>
      </div>
      <span className="ml-3 shrink-0 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        {word.domain}
      </span>
    </Link>
  )
}
