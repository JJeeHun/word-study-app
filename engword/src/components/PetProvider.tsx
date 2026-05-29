'use client'

import { useEffect, useState } from 'react'
import { registry } from '@/infra/client-registry'
import { useAuthStore } from '@/stores/auth.store'
import { calcPetMood } from '@/pet/service'
import { MainPet } from './MainPet'
import type { PetPosition } from '@/profile/types'
import type { PetMood } from '@/pet/service'

export function PetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const [position, setPosition] = useState<PetPosition>('bottom-right')
  const [mood, setMood] = useState<PetMood>('normal')
  const [hasSeenNavHint, setHasSeenNavHint] = useState(true)

  useEffect(() => {
    if (!user) return
    registry.repos.profile.findById(user.id).then((r) => {
      if (!r.ok || !r.data) return
      setPosition(r.data.pet_position)
      setMood(calcPetMood(r.data.last_study_date))
      setHasSeenNavHint(r.data.has_seen_nav_hint)
    })
  }, [user])

  const handleHintSeen = async () => {
    setHasSeenNavHint(true)
    if (!user) return
    await registry.repos.profile.update(user.id, { has_seen_nav_hint: true })
  }

  return (
    <>
      {children}
      <MainPet
        mood={mood}
        position={position}
        reaction={null}
        hasSeenNavHint={hasSeenNavHint}
        onHintSeen={handleHintSeen}
      />
    </>
  )
}
