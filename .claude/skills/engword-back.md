---
name: engword-back
description: Use when implementing any backend feature in the engword vocabulary app — API routes, services, repositories, sync logic, or auth. Covers hexagonal architecture, singleton DI registry, Zod validation, service reuse patterns, and NestJS migration compatibility.
---

# engword-back

> 공통 규칙은 `engword-common` 참조. 이 문서는 백엔드 전용 규칙.

---

## 아키텍처 — 유연한 헥사고날

엄격한 헥사고날(entity를 service 밖으로 못 내보냄 등) 적용 안 함.  
핵심 원칙만 지킨다:

1. **외부 라이브러리(Supabase, Drizzle)는 infra 레이어에만** — service/controller에서 직접 import 금지
2. **infra는 interface를 구현** — 교체해도 service 코드는 변경 없음
3. **단방향 의존성** — controller → service → repository interface ← infra

```
[Controller / API Route]
        ↓
   [Service]           ← 비즈니스 로직, interface만 알고 있음
        ↓
[IRepository interface]
        ↑
   [infra/]            ← Dexie / Supabase 실제 구현체
```

---

## 싱글톤 DI 레지스트리

NestJS로 이전 시 이 파일을 NestJS Module로 교체하면 끝.  
서비스 클래스 자체는 수정 없음.

```ts
// infra/registry.ts (서버 전용 — API Route에서 사용)
// Dexie는 브라우저 전용(IndexedDB). 서버에서는 Supabase 구현체 사용.

import { SupabaseWordRepository } from '@/word/infra/supabase'
import { WordService } from '@/word/service'
import { SupabaseLearningRecordRepository } from '@/learning/infra/supabase'
import { LearningService } from '@/learning/service'
import { SupabaseAnswerLogRepository } from '@/answer-log/infra/supabase'
import { SyncService } from '@/sync/service'

// 싱글톤 인스턴스 — 서버 요청 간 공유
const wordRepo = new SupabaseWordRepository()
const learningRepo = new SupabaseLearningRecordRepository()
const answerLogRepo = new SupabaseAnswerLogRepository()

export const wordService = new WordService(wordRepo)
export const learningService = new LearningService(learningRepo, wordRepo)
export const syncService = new SyncService(wordRepo, learningRepo, answerLogRepo)
```

```ts
// 사용 — API route에서 registry에서 꺼내쓰기
import { wordService } from '@/infra/registry'

export async function GET(req: Request) {
  const result = await wordService.getAll()
  ...
}
```

**NestJS 이전 시 교체 범위:**
- `infra/registry.ts` → NestJS `@Module({ providers: [...] })` 로 교체
- Service 클래스는 생성자 주입 형태 유지했으므로 `@Injectable()` 데코레이터만 추가

---

## Service 설계 원칙

### 생성자 주입 — 직접 인스턴스화 금지

```ts
// ❌ service 내부에서 직접 생성
class WordService {
  private repo = new DexieWordRepository() // NestJS 이전 불가
}

// ✅ 생성자 주입
class WordService {
  constructor(private readonly repo: IWordRepository) {}
}
```

### Service 재사용 — 컨트롤러가 분기

같은 비즈니스 로직은 service 하나로. 입력값 검증 차이는 컨트롤러에서 처리.

```ts
// service — 공통 로직
class AuthService {
  async signUp(email: string, hashedPassword?: string): Promise<Result<User>> {
    // 공통: user 생성, profile 초기화
  }
}

// controller — 일반 회원가입 (email + password 필수)
const schema = z.object({ email: z.string().email(), password: z.string().min(8) })

// controller — 소셜 회원가입 (email만)
const schema = z.object({ email: z.string().email() })

// 둘 다 authService.signUp() 호출
```

### Service validation 범위

service는 **비즈니스 규칙 위반만** 검증. 입력 형식 검증은 controller 책임.

```ts
// ❌ service가 이메일 형식 검사
if (!email.includes('@')) throw new Error(...)

// ✅ service는 비즈니스 규칙만
if (await this.repo.existsByEmail(email)) return err('email_already_exists')
```

---

## Validation — Zod 필수

모든 API 입력값은 Zod 스키마로 검증. controller 진입 전에 통과.

```ts
// app/api/words/route.ts
import { z } from 'zod'

const createWordSchema = z.object({
  text: z.string().min(1).max(100),
  meaning: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  domain: z.string().transform(v => v.toUpperCase()),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = createWordSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const result = await wordService.create(parsed.data)
  ...
}
```

---

## Repository Interface 규칙

```ts
// word/repository.ts
export interface IWordRepository {
  findById(id: string): Promise<Result<Word>>
  findAll(filter: WordFilter): Promise<Result<Word[]>>
  create(data: CreateWordDto): Promise<Result<Word>>
  update(id: string, data: Partial<CreateWordDto>): Promise<Result<Word>>
  softDelete(id: string): Promise<Result<void>>
}
```

- `delete` 대신 `softDelete` — `deleted_at` 설정
- 반환은 항상 `Result<T>` — throw 금지

---

## 싱크 수신 처리 — 단건 / 일괄

프론트 싱크 큐가 단건 또는 일괄로 전송. 백엔드는 두 엔드포인트 모두 제공.

```ts
// app/api/sync/single/route.ts — 단건
export async function POST(req: Request) {
  const body = await req.json()
  const parsed = syncItemSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const result = await syncService.applySingle(parsed.data)
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
  return Response.json({ ok: true })
}

// app/api/sync/batch/route.ts — 일괄 (트랜잭션)
export async function POST(req: Request) {
  const body = await req.json()
  const parsed = z.array(syncItemSchema).safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  // validation 먼저 전체 체크 → 통과 시 일괄 insert/update
  const result = await syncService.applyBatch(parsed.data)
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
  return Response.json({ ok: true })
}
```

**일괄 처리 원칙:**
- validation 전체 통과 후 DB 작업 시작 (부분 성공 없음)
- Supabase 트랜잭션 또는 `Promise.all` + rollback 전략 적용
- 실패 시 전체 롤백 → 프론트 큐에 항목 유지

---

## 동기화 정책 요약

| 테이블 | 방향 | 비고 |
|---|---|---|
| words, sentences | Pull | 관리자 데이터, 로컬 write 없음 |
| learning_records | Push | 로컬 wins |
| answer_logs | Push | reviewed_at은 non-null wins |
| profiles, user_pets | Push | 로컬 wins |

`reviewed_at` conflict 처리:
```ts
// NULL vs timestamp → timestamp 채택
const resolved = local.reviewedAt ?? remote.reviewedAt  // 둘 다 null이면 null 유지
// 단, remote가 non-null이면 remote 우선
const resolved = (local.reviewedAt && remote.reviewedAt)
  ? local.reviewedAt  // 둘 다 있으면 로컬 wins
  : local.reviewedAt ?? remote.reviewedAt  // 하나만 있으면 non-null 채택
```

상세 → [[../docs/features/sync]]

---

## 에러 처리

Result 타입 사용. throw는 예외 상황만(예: 설정 오류, 프로그래밍 실수).

```ts
// ✅ 정상 에러 흐름
async function createWord(dto: CreateWordDto): Promise<Result<Word>> {
  const exists = await this.repo.findByText(dto.text)
  if (exists.ok) return err('word_already_exists')
  return this.repo.create(dto)
}

// API route에서 Result 언래핑
const result = await wordService.create(dto)
if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
return Response.json(result.data)
```

---

## ENV 규칙

`process.env` 직접 참조 금지. `settings.ts` 통해서만.  
→ 공통 규칙 [[engword-common#ENV 규칙]] 참조

백엔드 전용 env 예시:
```ts
// config/settings.ts 백엔드 섹션
supabaseServiceKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,  // 서버 전용
databaseUrl: parsed.data.DATABASE_URL,
```

---

## 연관 문서
- 공통 규칙 → [[engword-common]]
- 동기화 기획 → [[../docs/features/sync]]
- 스키마 → [[../docs/schema/index]]
- 인증 → [[../docs/features/auth]]
