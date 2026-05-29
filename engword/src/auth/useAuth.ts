'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { restoreSession, signIn, signOut, signUp } from './service'
import type { SignInDto, SignUpDto } from './types'
import type { Result } from '@/shared/result'

export function useAuth() {
  const { user, isLoggedIn } = useAuthStore()

  useEffect(() => {
    restoreSession()
  }, [])

  return {
    user,
    isLoggedIn,
    signIn: (dto: SignInDto): Promise<Result<void>> => signIn(dto),
    signUp: (dto: SignUpDto): Promise<Result<void>> => signUp(dto),
    signOut: (): Promise<Result<void>> => signOut(),
  }
}
