'use client'

import { useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { useWords } from '@/word/hooks/useWords'
import { usePullSync } from '@/word/hooks/usePullSync'
import { WordListSkeleton } from '@/components/Skeleton'
import { FilterBottomSheet } from './FilterBottomSheet'
import { WordCard } from './WordCard'
import type { WordFilter } from '@/word/types'

type StatusFilter = 'all' | 'new' | 'learning' | 'done'

const STATUS_CHIPS: { label: string; value: StatusFilter }[] = [
  { label: '전체', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Learning', value: 'learning' },
  { label: 'Done', value: 'done' },
]

export function WordListScreen() {
  usePullSync()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [wordFilter, setWordFilter] = useState<WordFilter>({})
  const [filterOpen, setFilterOpen] = useState(false)

  const { words, isLoading } = useWords(wordFilter)

  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: words.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  })

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 상태 필터 칩 */}
      <div className="flex gap-2 px-4 py-3 border-b border-border overflow-x-auto shrink-0">
        {STATUS_CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setStatusFilter(chip.value)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              statusFilter === chip.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 단어 리스트 */}
      <div ref={parentRef} className="flex-1 overflow-y-auto">
        {isLoading ? (
          <WordListSkeleton />
        ) : words.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            단어가 없습니다
          </div>
        ) : (
          <div
            style={{ height: virtualizer.getTotalSize() }}
            className="relative w-full"
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const word = words[virtualItem.index]
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: virtualItem.size,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <WordCard word={word} />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 하단 필터 버튼 */}
      <div className="shrink-0 p-4 border-t border-border">
        <button
          onClick={() => setFilterOpen(true)}
          className="w-full h-10 rounded-md border border-input bg-background text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          필터
        </button>
      </div>

      <FilterBottomSheet
        open={filterOpen}
        filter={wordFilter}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => {
          setWordFilter(f)
          setFilterOpen(false)
        }}
      />
    </div>
  )
}
