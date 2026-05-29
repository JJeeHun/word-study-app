import { createClient } from '@supabase/supabase-js'
import { ok, err } from '@/shared/result'
import type { Result } from '@/shared/result'
import type { IAuthRepository } from '../repository'
import type { AuthSession, SignUpDto, SignInDto } from '../types'
import { settings } from '@/config/settings'

const supabase = createClient(settings.supabase.url, settings.supabase.anonKey)

export class SupabaseAuthRepository implements IAuthRepository {
  async signUp(dto: SignUpDto): Promise<Result<AuthSession>> {
    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    })
    if (error || !data.session) return err(error?.message ?? 'signup_failed')
    return ok({
      user: { id: data.session.user.id, email: data.session.user.email! },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at ?? 0,
    })
  }

  async signIn(dto: SignInDto): Promise<Result<AuthSession>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    })
    if (error || !data.session) return err(error?.message ?? 'signin_failed')
    return ok({
      user: { id: data.session.user.id, email: data.session.user.email! },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at ?? 0,
    })
  }

  async signOut(): Promise<Result<void>> {
    const { error } = await supabase.auth.signOut()
    if (error) return err(error.message)
    return ok(undefined)
  }

  async getSession(): Promise<Result<AuthSession | null>> {
    const { data, error } = await supabase.auth.getSession()
    if (error) return err(error.message)
    if (!data.session) return ok(null)
    return ok({
      user: { id: data.session.user.id, email: data.session.user.email! },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at ?? 0,
    })
  }

  async refreshSession(): Promise<Result<AuthSession>> {
    const { data, error } = await supabase.auth.refreshSession()
    if (error || !data.session) return err(error?.message ?? 'refresh_failed')
    return ok({
      user: { id: data.session.user.id, email: data.session.user.email! },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at ?? 0,
    })
  }
}

export const supabaseAuthRepo = new SupabaseAuthRepository()
