export function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

/** 오타 허용 정답 판정 — 단어 길이에 비례한 허용 거리 */
export function isTypingCorrect(input: string, answer: string): boolean {
  const a = input.trim().toLowerCase()
  const b = answer.trim().toLowerCase()
  if (a === b) return true
  const maxDist = b.length <= 4 ? 0 : b.length <= 8 ? 1 : 2
  return levenshtein(a, b) <= maxDist
}
