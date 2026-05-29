'use client'

import { useEffect, useState } from 'react'
import { db } from '@/infra/db'
import { useAuthStore } from '@/stores/auth.store'

interface DomainStat { domain: string; done: number; total: number }
interface DailyStat  { date: string; count: number }
interface WrongStat  { word_id: string; wordText: string; count: number }

interface Statistics {
  todayStudied: number
  todayDone: number
  streak: number
  domainStats: DomainStat[]
  dailyStats: DailyStat[]
  typingAccuracy: number
  choiceAccuracy: number
  topWrong: WrongStat[]
}

export function useStatistics() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const userId = user?.id ?? 'local'
      const today = new Date().toISOString().slice(0, 10)

      const [allLogs, allRecords, allWords] = await Promise.all([
        db.answer_logs.where('user_id').equals(userId).toArray(),
        db.learning_records.where('user_id').equals(userId).toArray(),
        db.words.filter(w => w.deleted_at === null).toArray(),
      ])

      // 오늘 학습/Done
      const todayLogs = allLogs.filter(l => l.answered_at.slice(0, 10) === today)
      const todayStudied = new Set(todayLogs.map(l => l.word_id)).size
      const todayDoneIds = new Set(
        allRecords
          .filter(r => r.state === 'Done' && r.last_reviewed_at?.slice(0, 10) === today)
          .map(r => r.word_id)
      )
      const todayDone = todayDoneIds.size

      // 스트릭 — profiles 테이블에서
      const profile = await db.profiles.get(userId)
      const streak = profile?.current_streak ?? 0

      // domain별 통계
      const wordMap = new Map(allWords.map(w => [w.id, w]))
      const doneIds = new Set(allRecords.filter(r => r.state === 'Done').map(r => r.word_id))
      const domainMap = new Map<string, { done: number; total: number }>()
      for (const w of allWords) {
        const entry = domainMap.get(w.domain) ?? { done: 0, total: 0 }
        entry.total++
        if (doneIds.has(w.id)) entry.done++
        domainMap.set(w.domain, entry)
      }
      const domainStats: DomainStat[] = Array.from(domainMap.entries()).map(([domain, v]) => ({ domain, ...v }))

      // 최근 14일 학습량
      const dailyMap = new Map<string, Set<string>>()
      for (const log of allLogs) {
        const date = log.answered_at.slice(0, 10)
        if (!dailyMap.has(date)) dailyMap.set(date, new Set())
        dailyMap.get(date)!.add(log.word_id)
      }
      const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (13 - i))
        return d.toISOString().slice(0, 10)
      })
      const dailyStats: DailyStat[] = dates.map(date => ({
        date,
        count: dailyMap.get(date)?.size ?? 0,
      }))

      // 정답률
      const typingLogs = allLogs.filter(l => l.mode === 'typing')
      const choiceLogs = allLogs.filter(l => l.mode === 'multiple_choice')
      const typingAccuracy = typingLogs.length
        ? Math.round(typingLogs.filter(l => l.is_correct).length / typingLogs.length * 100)
        : 0
      const choiceAccuracy = choiceLogs.length
        ? Math.round(choiceLogs.filter(l => l.is_correct).length / choiceLogs.length * 100)
        : 0

      // 자주 틀린 단어 TOP 5
      const wrongCount = new Map<string, number>()
      for (const log of allLogs.filter(l => !l.is_correct)) {
        wrongCount.set(log.word_id, (wrongCount.get(log.word_id) ?? 0) + 1)
      }
      const topWrong: WrongStat[] = Array.from(wrongCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word_id, count]) => ({
          word_id,
          wordText: wordMap.get(word_id)?.text ?? word_id,
          count,
        }))

      setStats({ todayStudied, todayDone, streak, domainStats, dailyStats, typingAccuracy, choiceAccuracy, topWrong })
      setIsLoading(false)
    }
    load()
  }, [user])

  return { stats, isLoading }
}
