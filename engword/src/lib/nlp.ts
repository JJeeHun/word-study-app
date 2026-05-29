import nlp from 'compromise'

/**
 * 단어를 원형(lemma)으로 정규화.
 * compromise는 브라우저 로컬 실행 — 오프라인 동작.
 */
export function normalize(word: string): string {
  const doc = nlp(word)
  // 동사는 infinitive, 명사는 singular
  const terms = doc.json() as Array<{ terms: Array<{ normal: string }> }>
  return terms[0]?.terms[0]?.normal ?? word.toLowerCase()
}

/**
 * 예문에서 공백 기준으로 토큰 분리 후 각 토큰의 정규화된 원형 반환.
 * Returns array of { raw, normalized } pairs.
 */
export function tokenize(sentence: string): Array<{ raw: string; normalized: string }> {
  return sentence.split(/\s+/).map((raw) => ({
    raw,
    normalized: normalize(raw.replace(/[^a-zA-Z'-]/g, '')),
  }))
}
