import { http } from './_http'
import type { Result } from '@/shared/result'
import type { Word } from '@/word/types'
import type { Sentence, WordSentence } from '@/sentence/types'
import type { Pet } from '@/pet/types'

export interface SyncItem {
  table: string
  action: 'create' | 'update'
  payload: unknown
}

export interface PullSyncResponse {
  words: Word[]
  sentences: Sentence[]
  word_sentences: WordSentence[]
  pets: Pet[]
}

class SyncRemoteApi {
  pull(since: string): Promise<Result<PullSyncResponse>> {
    return http.get<PullSyncResponse>(`/api/sync/pull?since=${encodeURIComponent(since)}`)
  }

  single(item: SyncItem): Promise<Result<void>> {
    return http.post<void>('/api/sync/single', item)
  }

  batch(items: SyncItem[]): Promise<Result<void>> {
    return http.post<void>('/api/sync/batch', items)
  }
}

export const syncRemoteApi = new SyncRemoteApi()
