---
tags: [checklist, setup]
created: 2026-05-29
---

# 세팅 체크리스트 (공통)

> 프론트/백 작업 전 완료되어야 할 기반 세팅.
> 스킬: `engword-common`
> 문서: [[architecture]], [[tech-stack]], [[config]]

---

## 프로젝트 초기화

- [ ] Next.js 14+ 프로젝트 생성 (App Router, TypeScript strict)
- [ ] Tailwind CSS 설치
- [ ] shadcn/ui 설치
- [ ] Drizzle ORM 설치 + Supabase 연결 설정
- [ ] Dexie.js 설치
- [ ] Zod 설치
- [ ] react-hook-form + `@hookform/resolvers` 설치
- [ ] Storybook 설치 및 기본 설정
- [ ] Zustand 설치

---

## 공통 모듈 (`shared/`)

- [ ] `shared/result.ts` — `Result<T>`, `ok()`, `err()`
- [ ] `shared/errors.ts` — `AlertError`, `ConfirmError`, `ApiError`
- [ ] `shared/constants.ts` — `DONE_THRESHOLD`, `SESSION_SIZE`, `QUEUE_BATCH_SIZE`, `QUEUE_REFILL_THRESHOLD`

---

## ENV / 설정

- [ ] `config/settings.ts` — Zod 스키마로 ENV 바인딩
  - 프론트용: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - 백엔드용: `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`
- [ ] `.env.example` 작성 — `settings.ts` 기준으로 필요한 ENV 전체 나열

---

## 도메인 폴더 구조 생성

```
src/
  shared/
  config/
  word/        types.ts, repository.ts, service.ts, infra/
  learning/    types.ts, repository.ts, service.ts, infra/
  answer-log/  types.ts, repository.ts, infra/
  auth/        types.ts, service.ts, infra/
  profile/     types.ts, repository.ts, infra/
  pet/         types.ts, service.ts
  sync/        service.ts, sync-queue.ts, policy.ts
  api/         _interfaces/, local/, remote/
  infra/       registry.ts (백엔드), client-registry.ts (프론트)
  stores/      (Zustand)
```

---

## PWA 기반

- [ ] `next-pwa` 또는 Workbox 설치
- [ ] `public/manifest.json` 작성 (앱 이름, 아이콘, display: standalone)
- [ ] Service Worker 설정
  - 정적 assets + API 응답 캐시 전략
  - **캐시 버전 관리** — 배포 시 새 버전, 구 버전은 캐시된 버전으로 동작 유지
  - 오프라인 fallback 페이지
- [ ] `next.config.js` PWA 설정

---

## 연관 문서
- [[architecture]], [[tech-stack]], [[config]]
- 프론트 작업 → [[checklist-front]]
- 백엔드 작업 → [[checklist-back]]
