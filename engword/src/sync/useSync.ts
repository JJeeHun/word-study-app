'use client'

import { useCallback } from 'react'
import { syncQueue } from './sync-queue'
import { useSyncStore } from '@/stores/sync.store'
import { useAuthStore } from '@/stores/auth.store'

export function useSync() {
  const { isSyncing, lastSyncedAt, setIsSyncing, setLastSyncedAt } = useSyncStore()
  const { isLoggedIn } = useAuthStore()

  const flush = useCallback(async () => {
    if (!isLoggedIn || isSyncing) return
    setIsSyncing(true)
    try {
      await syncQueue.flush()
      setLastSyncedAt(new Date().toISOString())
    } finally {
      setIsSyncing(false)
    }
  }, [isLoggedIn, isSyncing, setIsSyncing, setLastSyncedAt])

  return { flush, isSyncing, lastSyncedAt, isLoggedIn }
}
