'use client'

import { useEffect } from 'react'
import { useQueueStore } from '@/stores/queue.store'

export function useLearningQueue() {
  const { queue, currentIndex, isLoading, loadNext, advance, reset } = useQueueStore()

  useEffect(() => {
    loadNext()
  }, [loadNext])

  const currentWord = queue[currentIndex] ?? null
  const remaining = queue.length - currentIndex

  return { currentWord, remaining, isLoading, advance, reset }
}
