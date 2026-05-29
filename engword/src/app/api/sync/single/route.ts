import { NextResponse } from 'next/server'
import { z } from 'zod'
import { applySingle } from '@/sync/service'

const schema = z.object({
  table:   z.string().min(1),
  action:  z.enum(['create', 'update']),
  payload: z.record(z.unknown()),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const result = await applySingle(parsed.data)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ ok: true })
}
