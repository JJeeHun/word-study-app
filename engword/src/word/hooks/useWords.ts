'use client'

import { useState, useEffect, useCallback } from 'react'
import { registry } from '@/infra/client-registry'
import type { Word, WordFilter } from '../types'

interface UseWordsResult {
  words: Word[]
  isLoading: boolean
  reload: () => void
}

export function useWords(filter?: WordFilter): UseWordsResult {
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const result = await registry.apis.localWord.getAll(filter)
    if (result.ok) setWords(result.data)
    setIsLoading(false)
  }, [filter?.domain, filter?.status, filter?.cefr, filter?.part_of_speech]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  return { words, isLoading, reload: load }
}
