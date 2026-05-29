# engword — Claude Code 가이드

## 프로젝트 개요

오프라인 퍼스트 영어 단어 학습 PWA.  
Next.js 14+ / TypeScript / Dexie.js (로컬) / Supabase (서버) / 헥사고날 아키텍처.

---

## 작업 전 필수 확인

| 작업 유형 | 로드할 스킬 | 참조 문서 |
|---|---|---|
| 모든 작업 공통 | `engword-common` | `docs/architecture.md`, `docs/config.md` |
| 프론트 컴포넌트 / Hook / 화면 | `engword-front` | `docs/screens/<화면명>.md` |
| 백엔드 API / Repository / Service | `engword-back` | `docs/features/<기능명>.md`, `docs/schema/<테이블명>.md` |
| 동기화 관련 | `engword-back` + `engword-front` | `docs/features/sync.md` |
| 학습 로직 (큐, 시험, Done 판정) | `engword-back` | `docs/features/learning.md`, `docs/config.md` |
| 인증 | `engword-back` + `engword-front` | `docs/features/auth.md` |
| 펫 시스템 | `engword-front` | `docs/features/pet-system.md` |
| DB 스키마 확인 | — | `docs/schema/index.md` → 해당 테이블 파일 |

---

## 문서 구조

```
docs/
  index.md              ← 전체 문서 인덱스 (AI 진입점)
  config.md             ← 앱 상수 (DONE_THRESHOLD, SESSION_SIZE 등)
  architecture.md       ← 헥사고날 아키텍처 원칙
  tech-stack.md         ← 기술 스택
  checklist-setup.md    ← 공통 초기 세팅 체크리스트
  checklist-front.md    ← 프론트 개발 체크리스트 (F1~F10)
  checklist-back.md     ← 백엔드 개발 체크리스트 (B1~B7)
  schema/               ← 테이블별 스키마 상세
  features/             ← 기능 기획 상세
  screens/              ← 화면별 UI/UX 스펙

.claude/skills/
  engword-common.md     ← 패키지 구조, TS 규칙, ENV, 단방향 의존성
  engword-front.md      ← API Client, Hook, Storybook, 렌더 최적화, PWA
  engword-back.md       ← 헥사고날, 싱글톤 레지스트리, Zod, 싱크 수신
```

---

## 핵심 원칙 요약

- **오프라인 퍼스트** — 모든 읽기/쓰기는 Dexie(로컬) 우선. 서버는 백그라운드 싱크.
- **단방향 의존성** — 하위 레이어가 상위 참조 금지. 도메인 타입은 도메인이 소유.
- **외부 라이브러리 직접 사용 금지** — Dexie/Supabase/fetch는 infra 또는 API Client 레이어에서만.
- **ENV 직접 참조 금지** — `config/settings.ts` 통해서만.
- **Pull 테이블** (words, sentences, pets) — 프론트에서 쓰기 금지, 읽기 전용.
- **Push 테이블** (learning_records, answer_logs, profiles, user_pets) — 로컬 우선 쓰기 → 싱크 큐.
- **단어 추가 요청** — 온라인 + 로그인 필수. 싱크 큐 우회, 즉시 서버 전송.

---

## 멀티 에이전트 충돌 방지

프론트 에이전트와 백엔드 에이전트가 동시에 작업할 때 겹치는 파일 금지.

| 프론트 에이전트 담당 | 백엔드 에이전트 담당 |
|---|---|
| `src/api/` | `src/infra/registry.ts` |
| `src/stores/` | `src/*/infra/supabase.ts` |
| `src/*/ui/` | `src/*/service.ts` (비즈니스 로직) |
| `src/sync/sync-queue.ts` | `app/api/` (API Routes) |
| `app/(pages)/` | `src/*/repository.ts` (Interface) |
| `src/*/infra/dexie.ts` | Drizzle 스키마, DB 마이그레이션 |
| Storybook stories | Supabase RLS 설정 |

**공유 파일** (양쪽 에이전트 수정 금지 — 별도 합의 필요):
- `src/shared/` — result, errors, constants
- `src/config/settings.ts`
- `src/*/types.ts` — 도메인 타입 변경 시 양쪽 영향

---

## 체크리스트 사용법

작업 시작 전 해당 체크리스트 확인 → 완료 항목 `[x]` 표시.

```
초기 세팅 → docs/checklist-setup.md
프론트 작업 → docs/checklist-front.md
백엔드 작업 → docs/checklist-back.md
```
