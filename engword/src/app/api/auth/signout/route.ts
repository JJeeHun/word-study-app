import { NextResponse } from 'next/server'
import { serverRegistry } from '@/infra/registry'

export async function POST() {
  const result = await serverRegistry.auth.signOut()
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
