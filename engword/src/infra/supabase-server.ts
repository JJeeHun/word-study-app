import { createClient } from '@supabase/supabase-js'
import { settings } from '@/config/settings'

/** 서버 전용 Supabase 클라이언트 (service_role) */
export function getSupabaseServer() {
  if (!settings.supabase.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required on the server')
  }
  return createClient(settings.supabase.url, settings.supabase.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/** 요청 컨텍스트용 Supabase 클라이언트 (사용자 JWT) */
export function getSupabaseUser(accessToken: string) {
  return createClient(settings.supabase.url, settings.supabase.anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
