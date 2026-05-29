import type { PetEvent } from './types'

interface PetReaction {
  message: string
  emoji: string
}

const REACTIONS: Record<PetEvent, PetReaction> = {
  correct_answer:  { emoji: '😊', message: '' },
  wrong_answer:    { emoji: '🥺', message: '괜찮아, 같이 다시 해보자!' },
  done_achieved:   { emoji: '😋', message: '냠냠 맛있었어!' },
  queue_complete:  { emoji: '🎉', message: '오늘 큐 완료!' },
  long_absence:    { emoji: '🥺', message: '오랜만이야…' },
  new_word_added:  { emoji: '🤩', message: '새로운 게 생겼어!' },
}

export function getPetReaction(event: PetEvent): PetReaction {
  return REACTIONS[event]
}

export type PetMood = 'excited' | 'normal' | 'tired' | 'exhausted'

export function calcPetMood(lastStudyDate: string | null): PetMood {
  if (!lastStudyDate) return 'exhausted'
  const days = Math.floor((Date.now() - new Date(lastStudyDate).getTime()) / 86_400_000)
  if (days === 0) return 'excited'
  if (days <= 3) return 'normal'
  if (days <= 6) return 'tired'
  return 'exhausted'
}
