'use client'

import { useEffect, useRef } from 'react'
import { syncRemoteApi } from '@/api/remote/sync.remote.api'
import { registry } from '@/infra/client-registry'
import { useSyncStore } from '@/stores/sync.store'

const LAST_PULL_KEY = 'engword_last_pull_at'

export function usePullSync() {
  const { setIsSyncing, setLastSyncedAt } = useSyncStore()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const pull = async () => {
      setIsSyncing(true)
      try {
        const since = localStorage.getItem(LAST_PULL_KEY) ?? '1970-01-01T00:00:00.000Z'
        const result = await syncRemoteApi.pull(since)
        if (!result.ok) return

        const { words, sentences, word_sentences } = result.data

        if (words.length) await registry.repos.word.upsertMany(words)
        if (sentences.length) await registry.repos.sentence.upsertMany(sentences)
        if (word_sentences.length) await registry.repos.sentence.upsertManyWordSentences(word_sentences)

        const now = new Date().toISOString()
        localStorage.setItem(LAST_PULL_KEY, now)
        setLastSyncedAt(now)
      } finally {
        setIsSyncing(false)
      }
    }

    pull()
  }, [setIsSyncing, setLastSyncedAt])
}
