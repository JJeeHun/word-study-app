import { NextResponse } from 'next/server'
import { z } from 'zod'
import { serverRegistry } from '@/infra/registry'

const schema = z.object({
  text:           z.string().min(1),
  meaning:        z.string().min(1),
  difficulty:     z.number().int().min(1).max(5),
  frequency:      z.number().int().min(1).max(5),
  cefr:           z.enum(['A1','A2','B1','B2','C1','C2']).optional(),
  part_of_speech: z.enum(['noun','verb','adjective','adverb','preposition','conjunction']),
  origin:         z.string().optional(),
  domain:         z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const result = await serverRegistry.word.request({
    ...parsed.data,
    domain: parsed.data.domain.toUpperCase(),
  })
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(result.data, { status: 201 })
}
