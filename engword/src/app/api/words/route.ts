import { NextResponse } from 'next/server'
import { serverRegistry } from '@/infra/registry'
import type { WordFilter } from '@/word/types'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const filter: WordFilter = {}

  const domain         = url.searchParams.get('domain')
  const status         = url.searchParams.get('status')
  const cefr           = url.searchParams.get('cefr')
  const part_of_speech = url.searchParams.get('part_of_speech')

  if (domain)         filter.domain = domain
  if (status)         filter.status = status as any
  if (cefr)           filter.cefr = cefr as any
  if (part_of_speech) filter.part_of_speech = part_of_speech as any

  const result = await serverRegistry.word.findAll(filter)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(result.data)
}
