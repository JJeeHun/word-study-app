'use client'

import { supabaseAuthRepo } from './infra/supabase'
import { useAuthStore } from '@/stores/auth.store'
import type { Result } from '@/shared/result'
import { ok, err } from '@/shared/result'
import type { SignInDto, SignUpDto } from './types'

export async function signIn(dto: SignInDto): Promise<Result<void>> {
  const result = await supabaseAuthRepo.signIn(dto)
  if (!result.ok) return err(result.error)
  useAuthStore.getState().setUser(result.data.user)
  return ok(undefined)
}

export async function signUp(dto: SignUpDto): Promise<Result<void>> {
  const result = await supabaseAuthRepo.signUp(dto)
  if (!result.ok) return err(result.error)
  useAuthStore.getState().setUser(result.data.user)
  return ok(undefined)
}

export async function signOut(): Promise<Result<void>> {
  const result = await supabaseAuthRepo.signOut()
  if (!result.ok) return err(result.error)
  useAuthStore.getState().setUser(null)
  return ok(undefined)
}

export async function restoreSession(): Promise<void> {
  const result = await supabaseAuthRepo.getSession()
  if (result.ok && result.data) {
    useAuthStore.getState().setUser(result.data.user)
  }
}
