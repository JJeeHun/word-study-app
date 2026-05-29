'use client'

import { useStatistics } from '@/statistics/useStatistics'
import { Skeleton } from '@/components/Skeleton'

export function StatisticsScreen() {
  const { stats, isLoading } = useStatistics()

  if (isLoading || !stats) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const maxDaily = Math.max(...stats.dailyStats.map(d => d.count), 1)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h1 className="text-base font-semibold">통계</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 오늘 현황 */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard label="오늘 학습" value={`${stats.todayStudied}개`} />
          <StatCard label="오늘 Done" value={`${stats.todayDone}개`} />
        </section>

        {/* 스트릭 */}
        <section className="px-4 py-4 rounded-xl bg-muted">
          <p className="text-xs text-muted-foreground">연속 학습</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.streak}일</p>
        </section>

        {/* domain별 Done 비율 */}
        {stats.domainStats.length > 0 && (
          <section className="space-y-3">
            <p className="text-sm font-medium text-foreground">도메인별 진행률</p>
            {stats.domainStats.map(({ domain, done, total }) => {
              const pct = total ? Math.round(done / total * 100) : 0
              return (
                <div key={domain} className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{domain}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {/* 날짜별 학습량 */}
        <section className="space-y-2">
          <p className="text-sm font-medium text-foreground">최근 14일 학습량</p>
          <div className="flex items-end gap-1 h-20">
            {stats.dailyStats.map(({ date, count }) => (
              <div
                key={date}
                className="flex-1 bg-primary rounded-t"
                style={{ height: `${(count / maxDaily) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                title={`${date}: ${count}개`}
              />
            ))}
          </div>
        </section>

        {/* 정답률 */}
        <section className="grid grid-cols-2 gap-3">
          <StatCard label="타이핑 정답률" value={`${stats.typingAccuracy}%`} />
          <StatCard label="객관식 정답률" value={`${stats.choiceAccuracy}%`} />
        </section>

        {/* 자주 틀린 단어 */}
        {stats.topWrong.length > 0 && (
          <section className="space-y-2">
            <p className="text-sm font-medium text-foreground">자주 틀린 단어</p>
            {stats.topWrong.map(({ word_id, wordText, count }) => (
              <div key={word_id} className="flex justify-between px-4 py-3 rounded-xl bg-muted">
                <span className="text-sm text-foreground">{wordText}</span>
                <span className="text-sm text-muted-foreground">{count}회</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4 rounded-xl bg-muted space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  )
}
