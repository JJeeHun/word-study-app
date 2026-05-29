import { create } from 'zustand'

interface SyncStore {
  isSyncing: boolean
  lastSyncedAt: string | null
  setIsSyncing: (v: boolean) => void
  setLastSyncedAt: (at: string) => void
}

export const useSyncStore = create<SyncStore>((set) => ({
  isSyncing: false,
  lastSyncedAt: null,
  setIsSyncing: (isSyncing) => set({ isSyncing }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
}))
