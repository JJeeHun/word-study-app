'use client'

import { useState } from 'react'
import type { WordFilter, CefrLevel, PartOfSpeech } from '@/word/types'

interface Props {
  open: boolean
  filter: WordFilter
  onClose: () => void
  onApply: (filter: WordFilter) => void
}

const CEFR_OPTIONS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const POS_OPTIONS: PartOfSpeech[] = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction']

function Chip<T extends string>({
  value,
  selected,
  onToggle,
}: {
  value: T
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
        selected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-input'
      }`}
    >
      {value}
    </button>
  )
}

export function FilterBottomSheet({ open, filter, onClose, onApply }: Props) {
  const [local, setLocal] = useState<WordFilter>(filter)

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        <h2 className="text-base font-semibold">필터</h2>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">CEFR</p>
          <div className="flex flex-wrap gap-2">
            {CEFR_OPTIONS.map((c) => (
              <Chip
                key={c}
                value={c}
                selected={local.cefr === c}
                onToggle={() => setLocal((prev) => ({ ...prev, cefr: prev.cefr === c ? undefined : c }))}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">품사</p>
          <div className="flex flex-wrap gap-2">
            {POS_OPTIONS.map((p) => (
              <Chip
                key={p}
                value={p}
                selected={local.part_of_speech === p}
                onToggle={() =>
                  setLocal((prev) => ({
                    ...prev,
                    part_of_speech: prev.part_of_speech === p ? undefined : p,
                  }))
                }
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setLocal({})}
            className="flex-1 h-10 rounded-md border border-input text-sm text-muted-foreground"
          >
            초기화
          </button>
          <button
            onClick={() => onApply(local)}
            className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium"
          >
            적용
          </button>
        </div>
      </div>
    </>
  )
}
