'use client'

import Link from 'next/link'
import { useStatistics } from '@/statistics/useStatistics'

export default function Home() {
  const { stats } = useStatistics()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-6 space-y-6">
        {/* 오늘 현황 */}
        <section className="grid grid-cols-2 gap-3">
          <div className="px-4 py-4 rounded-xl bg-muted">
            <p className="text-xs text-muted-foreground">오늘 학습</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.todayStudied ?? 0}개</p>
          </div>
          <div className="px-4 py-4 rounded-xl bg-muted">
            <p className="text-xs text-muted-foreground">오늘 Done</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.todayDone ?? 0}개</p>
          </div>
        </section>

        {/* domain 진행률 */}
        {stats?.domainStats && stats.domainStats.length > 0 && (
          <section className="space-y-3">
            <p className="text-sm font-medium text-foreground">도메인 진행률</p>
            {stats.domainStats.slice(0, 4).map(({ domain, done, total }) => {
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
      </div>

      {/* 하단 버튼 */}
      <div className="shrink-0 flex gap-3 px-6 pb-8">
        <Link
          href="/study"
          className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center"
        >
          외우기 시작
        </Link>
        <Link
          href="/exam"
          className="flex-1 h-14 rounded-2xl border border-input text-foreground text-sm font-semibold flex items-center justify-center"
        >
          시험 시작
        </Link>
      </div>
    </div>
  )
}
