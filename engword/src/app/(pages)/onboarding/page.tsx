'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-background px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-5xl">🐣</p>
        <h1 className="text-2xl font-bold text-foreground">engword</h1>
        <p className="text-sm text-muted-foreground">나를 위한 영어 단어 학습</p>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => router.push('/login')}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >
          계정으로 시작
        </button>
        <button
          onClick={() => router.push('/words')}
          className="w-full h-12 rounded-xl border border-input text-sm text-muted-foreground"
        >
          로그인 없이 시작
        </button>
      </div>
    </div>
  )
}
