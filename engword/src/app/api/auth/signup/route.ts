import { NextResponse } from 'next/server'
import { z } from 'zod'
import { serverRegistry } from '@/infra/registry'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
})

const COOKIE_NAME = 'sb-access-token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const result = await serverRegistry.auth.signUp(parsed.data)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const res = NextResponse.json({ user: result.data.user }, { status: 201 })
  res.cookies.set(COOKIE_NAME, result.data.access_token, COOKIE_OPTIONS)
  return res
}
