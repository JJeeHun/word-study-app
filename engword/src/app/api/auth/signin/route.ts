import { NextResponse } from 'next/server'
import { z } from 'zod'
import { serverRegistry } from '@/infra/registry'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const result = await serverRegistry.auth.signIn(parsed.data)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }
  return NextResponse.json(result.data)
}
