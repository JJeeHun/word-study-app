'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PetMood } from '@/pet/service'
import type { PetPosition } from '@/profile/types'

const MOOD_EMOJI: Record<PetMood, string> = {
  excited:  '🐣',
  normal:   '🐥',
  tired:    '😴',
  exhausted: '💤',
}

const POSITION_CLASS: Record<PetPosition, string> = {
  'top-left':     'top-4 left-4',
  'top-right':    'top-4 right-4',
  'bottom-left':  'bottom-20 left-4',
  'bottom-right': 'bottom-20 right-4',
}

interface Props {
  mood: PetMood
  position: PetPosition
  reaction: { emoji: string; message: string } | null
  hasSeenNavHint: boolean
  onHintSeen: () => void
}

const MENU_ITEMS = [
  { label: '단어 목록', href: '/words' },
  { label: '외우기 시작', href: '/study' },
  { label: '시험 시작', href: '/exam' },
  { label: '오답 노트', href: '/wrong-answers' },
  { label: '통계', href: '/statistics' },
  { label: '설정', href: '/settings' },
]

export function MainPet({ mood, position, reaction, hasSeenNavHint, onHintSeen }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleTap = () => {
    if (!hasSeenNavHint) onHintSeen()
    setMenuOpen(true)
  }

  return (
    <>
      {/* 플로팅 펫 */}
      <button
        onClick={handleTap}
        className={`fixed z-30 flex flex-col items-center gap-1 ${POSITION_CLASS[position]}`}
        aria-label="메뉴 열기"
      >
        <span className="text-4xl select-none">{MOOD_EMOJI[mood]}</span>
        {!hasSeenNavHint && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground text-background text-xs px-2 py-1">
            탭하면 메뉴가 열려요!
          </span>
        )}
      </button>

      {/* 반응 말풍선 */}
      {reaction && reaction.message && (
        <div className={`fixed z-30 ${POSITION_CLASS[position]} mt-14 pointer-events-none`}>
          <div className="rounded-2xl bg-foreground text-background text-xs px-3 py-2 whitespace-nowrap shadow-lg">
            {reaction.emoji} {reaction.message}
          </div>
        </div>
      )}

      {/* 네비 바텀 시트 */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 space-y-2">
            {MENU_ITEMS.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => { setMenuOpen(false); router.push(href) }}
                className="w-full h-12 rounded-xl text-left px-4 text-sm text-foreground hover:bg-muted transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
