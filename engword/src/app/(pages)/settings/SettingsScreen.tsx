'use client'

import { useState } from 'react'
import { useAuth } from '@/auth/useAuth'
import { useSync } from '@/sync/useSync'
import { WordRequestSheet } from './WordRequestSheet'
import { SESSION_SIZE, DONE_THRESHOLD } from '@/shared/constants'

function formatDate(iso: string | null) {
  if (!iso) return '없음'
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function SettingsScreen() {
  const { user, isLoggedIn, signOut } = useAuth()
  const { flush, isSyncing, lastSyncedAt } = useSync()
  const [wordRequestOpen, setWordRequestOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="px-4 py-3 border-b border-border">
        <h1 className="text-base font-semibold">설정</h1>
      </div>

      <div className="flex-1 divide-y divide-border">
        {/* 계정 */}
        <section className="px-4 py-5 space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wide">계정</h2>
          {isLoggedIn ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">{user?.email}</p>
              <button
                onClick={() => signOut()}
                className="text-sm text-destructive"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <a href="/login" className="text-sm text-primary">로그인 / 회원가입</a>
          )}
        </section>

        {/* 동기화 */}
        <section className="px-4 py-5 space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wide">동기화</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">수동 동기화</p>
              <p className="text-xs text-muted-foreground">마지막: {formatDate(lastSyncedAt)}</p>
            </div>
            <button
              onClick={flush}
              disabled={!isLoggedIn || isSyncing}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40"
            >
              {isSyncing ? '동기화 중...' : '동기화'}
            </button>
          </div>
          {!isLoggedIn && (
            <p className="text-xs text-muted-foreground">로그인 후 동기화할 수 있어요</p>
          )}
        </section>

        {/* 학습 설정 */}
        <section className="px-4 py-5 space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wide">학습</h2>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">세션 크기</span>
            <span className="text-sm text-muted-foreground">{SESSION_SIZE}개</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">Done 기준 (연속 정답)</span>
            <span className="text-sm text-muted-foreground">{DONE_THRESHOLD}회</span>
          </div>
        </section>

        {/* 단어 추가 요청 */}
        <section className="px-4 py-5 space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wide">단어 추가 요청</h2>
          <button
            onClick={() => setWordRequestOpen(true)}
            disabled={!isLoggedIn}
            className="w-full h-12 rounded-xl border border-input text-sm text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          >
            단어 추가 요청하기
          </button>
          {!isLoggedIn && (
            <p className="text-xs text-muted-foreground">온라인 + 로그인 필수</p>
          )}
        </section>
      </div>

      <WordRequestSheet open={wordRequestOpen} onClose={() => setWordRequestOpen(false)} />
    </div>
  )
}
