import { NextResponse } from 'next/server'
import { serverRegistry } from '@/infra/registry'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const since = url.searchParams.get('since') ?? '1970-01-01T00:00:00.000Z'

  const [wordsResult, sentencesResult, wsSentencesResult] = await Promise.all([
    (serverRegistry.word as any).findSince(since),
    (serverRegistry.sentence as any).findSince(since),
    (serverRegistry.sentence as any).findWordSentencesSince(since),
  ])

  if (!wordsResult.ok || !sentencesResult.ok || !wsSentencesResult.ok) {
    return NextResponse.json({ error: 'sync_failed' }, { status: 500 })
  }

  return NextResponse.json({
    words:          wordsResult.data,
    sentences:      sentencesResult.data,
    word_sentences: wsSentencesResult.data,
    pets:           [],
  })
}
