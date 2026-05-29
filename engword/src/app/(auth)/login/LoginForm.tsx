'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { AlertError } from '@/shared/errors'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어요'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const { signIn, signUp } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    // 로그인 시도 → 실패하면 회원가입 자동 분기
    const loginResult = await signIn(values)
    if (!loginResult.ok) {
      const signupResult = await signUp(values)
      if (!signupResult.ok) {
        throw new AlertError(signupResult.error)
      }
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-foreground">engword</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2">
          {/* 이메일 입력 — 좌측 넓게 */}
          <div className="flex-1 space-y-1">
            <input
              {...register('email')}
              type="email"
              placeholder="이메일"
              autoComplete="email"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* 소셜 버튼 — 우측 세로 */}
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" size="sm" className="text-xs px-3">
              Google
            </Button>
            <Button type="button" variant="outline" size="sm" className="text-xs px-3 bg-yellow-300 border-yellow-300 hover:bg-yellow-400 text-yellow-900">
              Kakao
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <input
            {...register('password')}
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '처리 중...' : '이메일로 계속하기'}
        </Button>
      </form>

      <button
        type="button"
        className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        로그인 없이 계속하기
      </button>
    </div>
  )
}
