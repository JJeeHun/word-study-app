import { DexieWordRepository } from '@/word/infra/dexie'
import { DexieSentenceRepository } from '@/sentence/infra/dexie'
import { DexieLearningRecordRepository } from '@/learning/infra/dexie'
import { DexieAnswerLogRepository } from '@/answer-log/infra/dexie'
import { DexieProfileRepository } from '@/profile/infra/dexie'
import { getLocalWordApi } from '@/api/local/word.local.api'
import { getLocalLearningApi } from '@/api/local/learning.local.api'
import { getLocalAnswerLogApi } from '@/api/local/answer-log.local.api'

const wordRepo = new DexieWordRepository()
const sentenceRepo = new DexieSentenceRepository()
const learningRepo = new DexieLearningRecordRepository()
const answerLogRepo = new DexieAnswerLogRepository()
const profileRepo = new DexieProfileRepository()

export const registry = {
  repos: {
    word: wordRepo,
    sentence: sentenceRepo,
    learning: learningRepo,
    answerLog: answerLogRepo,
    profile: profileRepo,
  },
  apis: {
    localWord: getLocalWordApi(wordRepo),
    localLearning: getLocalLearningApi(learningRepo),
    localAnswerLog: getLocalAnswerLogApi(answerLogRepo),
  },
}
