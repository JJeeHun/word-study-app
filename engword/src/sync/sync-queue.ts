import { syncRemoteApi, type SyncItem } from '@/api/remote/sync.remote.api'
import { useAuthStore } from '@/stores/auth.store'

class SyncQueue {
  private queue: SyncItem[] = []

  enqueue(item: SyncItem): void {
    this.queue.push(item)
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const { user } = useAuthStore.getState()
    if (!user) return

    const items = [...this.queue]

    const result = items.length === 1
      ? await syncRemoteApi.single(items[0])
      : await syncRemoteApi.batch(items)

    if (result.ok) {
      this.queue = this.queue.filter(i => !items.includes(i))
    }
  }

  get size(): number {
    return this.queue.length
  }
}

export const syncQueue = new SyncQueue()
