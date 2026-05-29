---
name: engword-common
description: Use when implementing any feature in the engword vocabulary app. Provides package structure rules, TypeScript coding style, unidirectional dependency rules, and shared type conventions that apply to both frontend and backend.
---

# engword-common

## 패키지 구조

도메인 기준으로 폴더를 나눈다. 도메인 타입/DTO는 해당 도메인 폴더가 소유.

```
src/
  shared/
    result.ts        ← Result<T> 타입 정의
    constants.ts     ← 앱 전역 상수 (DONE_THRESHOLD 등)

  word/
    types.ts         ← Word, CreateWordDto, WordFilter
    repository.ts    ← IWordRepository interface
    service.ts       ← word 도메인 로직
    infra/
      dexie.ts       ← DexieWordRepository implements IWordRepository
      supabase.ts    ← SupabaseWordRepository implements IWordRepository

  learning/
    types.ts         ← LearningRecord, TestResult
    repository.ts    ← ILearningRecordRepository interface
    service.ts       ← handleTestResult 등 학습 로직
    infra/
      dexie.ts

  answer-log/
    types.ts
    repository.ts
    infra/
      dexie.ts

  sync/
    service.ts       ← 각 도메인 Repository interface만 참조
    policy.ts        ← Pull/Push 정책 정의

  pet/
    types.ts
    service.ts       ← 이벤트 → 펫 반응 매핑 로직

  auth/
    types.ts
    service.ts
    infra/
      supabase.ts

  profile/
    types.ts
    repository.ts
    infra/
      dexie.ts
```

## 단방향 참조 규칙

```
shared              ← 누구나 참조 가능
  ↑
domain types/repo   ← shared만 참조
  ↑
service (application) ← 같은 도메인 types + 타 도메인 types import 허용
  ↑
infra               ← 같은 도메인 types/repo만 참조
```

**금지 사항:**
- `infra/`가 다른 도메인의 `infra/`를 직접 참조 → 금지
- 도메인 `service`가 다른 도메인 `infra/`를 직접 참조 → 금지 (interface만)
- 타 도메인 타입이 필요하면 해당 도메인 `types.ts`에서 import → OK

## TypeScript 규칙

### any 금지
```ts
// ❌
function parse(data: any) {}

// ✅
function parse(data: unknown) {
  if (typeof data === 'string') { ... }
}
```

### Result 타입 (shared/result.ts)
exception throw 금지. 모든 함수는 Result로 반환.

```ts
export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E }

export const ok = <T>(data: T): Result<T> => ({ ok: true, data })
export const err = <E = string>(error: E): Result<never, E> => ({ ok: false, error })
```

사용 예:
```ts
async function getWord(id: string): Promise<Result<Word>> {
  try {
    const word = await wordRepo.findById(id)
    return ok(word)
  } catch {
    return err('word_not_found')
  }
}

// 호출부
const result = await getWord(id)
if (!result.ok) return // 에러 처리
console.log(result.data)
```

### 타입 소유 원칙
- DB row 타입, DTO, Filter 타입은 **해당 도메인 `types.ts`가 소유**
- 외부 도메인은 import해서 return type으로만 사용
- 전역 `types/` 폴더에 도메인 타입 추출 금지

### 함수형 우선
- class 대신 function 사용
- Repository interface 구현체는 예외적으로 class 허용

## ENV 규칙

`.env` 파일 직접 참조 금지. 반드시 `config/settings.ts`를 통해서만 사용.

```ts
// config/settings.ts — env 바인딩 + 타입 정의
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) throw new Error(`ENV 오류: ${parsed.error.message}`)

export const settings = {
  supabase: {
    url: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  env: parsed.data.NODE_ENV,
} as const
```

**목적:** 운영 배포 시 `settings.ts` 한 파일만 보면 필요한 ENV 전체 파악 가능.  
어디서든 `process.env.XXX` 직접 사용 금지 — `settings.XXX`로만 접근.

---

## 공통 상수 (shared/constants.ts)

```ts
export const DONE_THRESHOLD = 5       // 사용자 설정 가능
export const SESSION_SIZE = 10        // 사용자 설정 가능
export const QUEUE_BATCH_SIZE = 20    // 숨김
export const QUEUE_REFILL_THRESHOLD = 10  // 숨김
```

상수 직접 하드코딩 금지 — 반드시 import해서 사용.

## 연관 문서
- 아키텍처 → [[../docs/architecture]]
- Config 상수 → [[../docs/config]]
- 동기화 정책 → [[../docs/features/sync]]
