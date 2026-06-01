import { z } from 'zod'

const envSchema = z.object({
  // 서버 전용 — 클라이언트에 절대 노출 금지
  SUPABASE_URL:              z.string().url().optional(),
  SUPABASE_ANON_KEY:         z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL:              z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) throw new Error(`ENV 오류: ${parsed.error.message}`)

export const settings = {
  supabase: {
    url:            parsed.data.SUPABASE_URL ?? '',
    anonKey:        parsed.data.SUPABASE_ANON_KEY ?? '',
    serviceRoleKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
  },
  db: {
    url: parsed.data.DATABASE_URL,
  },
  env: parsed.data.NODE_ENV,
} as const
