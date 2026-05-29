---
tags: [checklist, backend]
created: 2026-05-29
---

# 백엔드 체크리스트

> 스킬: `engword-back`, `engword-common`
> 문서: [[features/]], [[schema/]], [[architecture]]
> 전제: [[checklist-setup]] 완료 후 진행

---

## Phase B1 — Repository Interface 정의

> 프론트와 충돌 없음. Interface만 정의하는 단계.

- [ ] `word/repository.ts` — `IWordRepository`
- [ ] `learning/repository.ts` — `ILearningRecordRepository`
- [ ] `answer-log/repository.ts` — `IAnswerLogRepository`
- [ ] `profile/repository.ts` — `IProfileRepository`
- [ ] `auth/repository.ts` — `IAuthRepository`

---

## Phase B2 — Supabase 구현체 + DB 마이그레이션

> 문서: [[schema/words]], [[schema/learning_records]], [[schema/answer_logs]], [[schema/profiles]]

- [ ] Drizzle 스키마 작성 (전체 테이블)
  - [ ] `words`, `sentences`, `word_sentences`
  - [ ] `learning_records`
  - [ ] `answer_logs`
  - [ ] `profiles`, `user_pets`, `pets`
- [ ] DB 마이그레이션 실행
- [ ] Supabase RLS 정책 설정
  - [ ] 관리자 테이블 (words 등) — 읽기 공개, 쓰기 관리자만
  - [ ] 유저 테이블 — 본인 데이터만 read/write
- [ ] `word/infra/supabase.ts` — `SupabaseWordRepository`
- [ ] `learning/infra/supabase.ts` — `SupabaseLearningRecordRepository`
- [ ] `answer-log/infra/supabase.ts` — `SupabaseAnswerLogRepository`
- [ ] `profile/infra/supabase.ts` — `SupabaseProfileRepository`

---

## Phase B3 — 인증 (서버)

> 문서: [[features/auth]]

- [ ] Supabase Auth 설정 (이메일 + Google/Apple OAuth)
- [ ] `auth/infra/supabase.ts` — `SupabaseAuthRepository`
- [ ] `auth/service.ts` — `signUp`, `signIn`, `signOut`, `refreshToken`
- [ ] API Route: `POST /api/auth/signup` + Zod validation
- [ ] API Route: `POST /api/auth/signin` + Zod validation
- [ ] API Route: `POST /api/auth/signout`
- [ ] JWT 만료 감지 처리 (401 응답 시 클라이언트에 재로그인 유도)

---

## Phase B4 — 단어 API (Pull)

> 문서: [[schema/words]], [[schema/sentences]], [[features/word-management]]

- [ ] `word/service.ts` — `getById`, `getAll`, `search`
- [ ] `sentence/service.ts`
- [ ] API Route: `GET /api/words` (필터, 페이지네이션) + Zod validation
- [ ] API Route: `GET /api/words/[id]`
- [ ] API Route: `GET /api/words/[id]/sentences`
- [ ] API Route: `POST /api/words/request` — 단어 추가 요청 (온라인 필수, status=미승인)
- [ ] Delta Sync 엔드포인트: `GET /api/sync/pull?since=<timestamp>`
  - words, sentences, word_sentences, pets 변경분 반환

---

## Phase B5 — 학습 서비스 (서버)

> 문서: [[features/learning]], [[schema/learning_records]], [[config]]

- [ ] `learning/service.ts` — `handleTestResult()` 구현
  - [ ] 정답: `consecutive_correct += 1` → DONE_THRESHOLD 이상이면 `state = Done`
  - [ ] 오답: `consecutive_correct = 0`, `state = Learning`
- [ ] `answer-log/service.ts` — 오답 로그 저장

---

## Phase B6 — 싱크 수신 (Push)

> 문서: [[features/sync]]

- [ ] `sync/policy.ts` — Pull/Push 테이블 목록 정의
- [ ] `sync/service.ts` — `applySingle`, `applyBatch`
  - [ ] `reviewed_at` non-null wins 처리
  - [ ] `applyBatch` 트랜잭션 — validation 전체 통과 후 일괄 insert/update
- [ ] API Route: `POST /api/sync/single` + Zod validation
- [ ] API Route: `POST /api/sync/batch` + Zod validation (배열)

---

## Phase B7 — 백엔드 레지스트리

- [ ] `infra/registry.ts` — 싱글톤 인스턴스 조립
  - 모든 Supabase 구현체 주입
  - NestJS 이전 시 이 파일만 교체

---

## 연관 문서
- 공통 세팅 → [[checklist-setup]]
- 프론트 작업 → [[checklist-front]]
- 동기화 정책 상세 → [[features/sync]]
- 스키마 상세 → [[schema/index]]
