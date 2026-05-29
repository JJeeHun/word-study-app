import { http } from './_http'
import type { Result } from '@/shared/result'
import type { Word, CreateWordRequestDto } from '@/word/types'

class WordRequestRemoteApi {
  request(dto: CreateWordRequestDto): Promise<Result<Word>> {
    return http.post<Word>('/api/words/request', dto)
  }
}

export const wordRequestRemoteApi = new WordRequestRemoteApi()
