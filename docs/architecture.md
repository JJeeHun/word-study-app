---
tags: [architecture, hexagonal, repository-pattern]
created: 2026-05-28
---

# 아키텍처 원칙

> [!info] 핵심 원칙
> Supabase를 직접 호출하지 않음.
> Repository 인터페이스(Port)를 통해 접근하여, DB가 바뀌어도 비즈니스 로직은 수정 없이 구현체(Adapter)만 교체.

---

## 헥사고날 아키텍처 (Ports & Adapters)

```
[ UI / Pages ]
      ↓
[ Use Cases / Services ]   ← 비즈니스 로직
      ↓
[ Repository Interface ]   ← Port (TypeScript interface)
      ↓
[ Repository Implementation ] ← Adapter (Supabase / IndexedDB)
```

---

## Repository 인터페이스 예시

```typescript
// Port — 비즈니스 로직이 의존하는 인터페이스
interface IWordRepository {
  findById(id: string): Promise<Word>
  findAll(filter: WordFilter): Promise<Word[]>
  create(data: CreateWordDto): Promise<Word>
  update(id: string, data: UpdateWordDto): Promise<Word>
  delete(id: string): Promise<void>
}

// Adapter — Supabase 구현체
class SupabaseWordRepository implements IWordRepository {
  // Drizzle ORM을 통해 Supabase PostgreSQL 접근
}

// Adapter — IndexedDB 구현체 (로컬 우선)
class DexieWordRepository implements IWordRepository {
  // Dexie.js를 통해 IndexedDB 접근
}
```

---

## 레이어 규칙

| 레이어 | 역할 | 의존 방향 |
|---|---|---|
| UI (Pages/Components) | 화면 렌더링 | → Use Cases |
| Use Cases (Services) | 비즈니스 로직, 학습 알고리즘 | → Repository Interface |
| Repository Interface | 데이터 접근 계약 정의 | 없음 |
| Repository Implementation | 실제 DB 접근 | → Drizzle / Dexie |

> [!warning] 규칙
> - UI에서 직접 DB 접근 금지
> - Use Cases에서 Supabase SDK 직접 임포트 금지
> - 모든 데이터 접근은 Repository Interface를 통해서만

---

## 오프라인 우선 전략

로컬(IndexedDB)과 서버(Supabase) 두 가지 Repository 구현체를 활용.

```
읽기/쓰기  → DexieWordRepository (로컬 우선)
동기화     → SyncService (로컬 ↔ SupabaseWordRepository)
```

→ 동기화 상세 [[features/sync]]

---

## 연관 문서
- 기술 스택 → [[tech-stack]]
- 동기화 전략 → [[features/sync]]
