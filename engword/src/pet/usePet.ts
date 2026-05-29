'use client'

import { useState, useCallback } from 'react'
import { getPetReaction, calcPetMood, type PetMood } from './service'
import type { PetEvent } from './types'

interface PetState {
  mood: PetMood
  reaction: { emoji: string; message: string } | null
}

export function usePet(lastStudyDate: string | null) {
  const [state, setState] = useState<PetState>({
    mood: calcPetMood(lastStudyDate),
    reaction: null,
  })

  const trigger = useCallback((event: PetEvent) => {
    const reaction = getPetReaction(event)
    setState((prev) => ({ ...prev, reaction }))
    setTimeout(() => setState((prev) => ({ ...prev, reaction: null })), 2500)
  }, [])

  return { mood: state.mood, reaction: state.reaction, trigger }
}
