import { NextResponse } from 'next/server'
import { serverRegistry } from '@/infra/registry'

export async function POST() {
  await serverRegistry.auth.signOut()
  const res = NextResponse.json({ ok: true })
  res.cookies.set('sb-access-token', '', { httpOnly: true, maxAge: 0, path: '/' })
  return res
}
