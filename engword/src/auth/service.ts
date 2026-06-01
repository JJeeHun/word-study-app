'use client'

import { useAuthStore } from '@/stores/auth.store'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { SignInDto, SignUpDto } from './types'

async function authFetch<T>(url: string, body?: unknown): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return err(data?.error ?? res.statusText)
    return ok(data as T)
  } catch {
    return err('network_error')
  }
}

export async function signIn(dto: SignInDto): Promise<Result<void>> {
  const result = await authFetch<{ user: { id: string; email: string } }>('/api/auth/signin', dto)
  if (!result.ok) return err(result.error)
  useAuthStore.getState().setUser(result.data.user)
  return ok(undefined)
}

export async function signUp(dto: SignUpDto): Promise<Result<void>> {
  const result = await authFetch<{ user: { id: string; email: string } }>('/api/auth/signup', dto)
  if (!result.ok) return err(result.error)
  useAuthStore.getState().setUser(result.data.user)
  return ok(undefined)
}

export async function signOut(): Promise<Result<void>> {
  await authFetch('/api/auth/signout')
  useAuthStore.getState().setUser(null)
  return ok(undefined)
}

export async function restoreSession(): Promise<void> {
  try {
    const res = await fetch('/api/auth/session')
    const data = await res.json().catch(() => ({}))
    if (data?.user) {
      useAuthStore.getState().setUser(data.user)
    }
  } catch {
    // 오프라인 등 네트워크 오류 시 무시
  }
}
