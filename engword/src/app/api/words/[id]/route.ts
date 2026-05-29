import { NextResponse } from 'next/server'
import { serverRegistry } from '@/infra/registry'

interface Params { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const result = await serverRegistry.word.findById(params.id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 })
  return NextResponse.json(result.data)
}
