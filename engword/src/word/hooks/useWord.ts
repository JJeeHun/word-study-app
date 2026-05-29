'use client'

import { useState, useEffect } from 'react'
import { registry } from '@/infra/client-registry'
import type { Word } from '../types'

interface UseWordResult {
  word: Word | null
  isLoading: boolean
}

export function useWord(id: string): UseWordResult {
  const [word, setWord] = useState<Word | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    registry.apis.localWord.getById(id).then((result) => {
      if (result.ok) setWord(result.data)
      setIsLoading(false)
    })
  }, [id])

  return { word, isLoading }
}
