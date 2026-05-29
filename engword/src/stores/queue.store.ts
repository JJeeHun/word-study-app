import { create } from 'zustand'
import type { Word } from '@/word/types'
import { registry } from '@/infra/client-registry'
import { useAuthStore } from './auth.store'
import { QUEUE_BATCH_SIZE, QUEUE_REFILL_THRESHOLD } from '@/shared/constants'

interface QueueStore {
  queue: Word[]
  currentIndex: number
  isLoading: boolean
  loadNext: () => Promise<void>
  advance: () => void
  reset: () => void
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isLoading: false,

  loadNext: async () => {
    const { queue, currentIndex, isLoading } = get()
    if (isLoading) return

    const remaining = queue.length - currentIndex
    if (remaining > QUEUE_REFILL_THRESHOLD) return

    set({ isLoading: true })

    const { user } = useAuthStore.getState()
    const userId = user?.id ?? 'local'

    const [wordsResult, learningResult] = await Promise.all([
      registry.apis.localWord.getAll({ status: '승인' }),
      registry.apis.localLearning.getByUserId(userId),
    ])

    if (!wordsResult.ok || !learningResult.ok) {
      set({ isLoading: false })
      return
    }

    const doneIds = new Set(
      learningResult.data.filter(r => r.state === 'Done').map(r => r.word_id)
    )

    const notDone = wordsResult.data.filter(w => !doneIds.has(w.id))

    const byReviewed = new Map(learningResult.data.map(r => [r.word_id, r.last_reviewed_at]))
    notDone.sort((a, b) => {
      const aTime = byReviewed.get(a.id) ?? null
      const bTime = byReviewed.get(b.id) ?? null
      if (aTime === null && bTime === null) return 0
      if (aTime === null) return -1
      if (bTime === null) return 1
      return aTime < bTime ? -1 : 1
    })

    const next = notDone.slice(0, QUEUE_BATCH_SIZE)
    set({ queue: next, currentIndex: 0, isLoading: false })
  },

  advance: () => {
    const { currentIndex, queue } = get()
    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1 })
    }
    get().loadNext()
  },

  reset: () => set({ queue: [], currentIndex: 0 }),
}))
