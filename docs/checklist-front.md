---
tags: [checklist, frontend]
created: 2026-05-29
---

# 프론트엔드 체크리스트

> 스킬: `engword-front`, `engword-common`
> 문서: [[screens/]], [[features/]], [[config]]
> 전제: [[checklist-setup]] 완료, [[checklist-back]] Phase B1(Interface) 완료 후 진행

---

## Phase F1 — 기반 레이어

### Dexie 로컬 DB

- [ ] `word/infra/dexie.ts` — `DexieWordRepository` (읽기 전용)
- [ ] `learning/infra/dexie.ts` — `DexieLearningRecordRepository`
- [ ] `answer-log/infra/dexie.ts` — `DexieAnswerLogRepository`
- [ ] `profile/infra/dexie.ts` — `DexieProfileRepository`

### API Client

- [ ] `api/remote/_http.ts` — 공통 fetch 래퍼 (인증 헤더, 에러 변환)
- [ ] `api/local/word.local.api.ts` — Dexie 읽기 전용 (create/update 없음)
- [ ] `api/local/learning.local.api.ts`
- [ ] `api/local/answer-log.local.api.ts`
- [ ] `api/remote/sync.remote.api.ts` — `single()`, `batch()`
- [ ] `api/remote/word-request.remote.api.ts` — 단어 추가 요청 (즉시 서버 전송)

### 클라이언트 레지스트리

- [ ] `infra/client-registry.ts` — Dexie 구현체 싱글톤 조립

### 싱크 큐

- [ ] `sync/sync-queue.ts` — 싱글톤
  - [ ] `enqueue()` — 유저 데이터 쓰기 후 적재
  - [ ] `flush()` — 단건(1개) vs 일괄(2개↑) 자동 분기
  - [ ] 로그인 미충족 시 flush 중단 (큐 유지)

### Zustand 스토어

- [ ] `stores/auth.store.ts` — 로그인 상태, 유저 정보
- [ ] `stores/queue.store.ts` — 학습 큐 (Word[], currentIndex, loadNext)
- [ ] `stores/sync.store.ts` — 마지막 동기화 시각, 동기화 중 여부

### 공통 컴포넌트

- [ ] `components/ui/` — shadcn/ui 기반 버튼, 인풋, 바텀 시트, 토스트
- [ ] `ErrorBoundary` 컴포넌트 — AlertError/ConfirmError/ApiError 인스턴스 분기 처리
- [ ] Skeleton 공통 컴포넌트

---

## Phase F2 — 인증 (프론트)

> 문서: [[features/auth]], [[screens/login]]

- [ ] `auth/infra/dexie.ts` — 로컬 토큰/세션 저장
- [ ] `api/remote/auth.remote.api.ts` — signUp, signIn, signOut fetch 래퍼
- [ ] `useAuth` hook — 로그인/로그아웃, 토큰 만료 감지 → 재로그인 유도
- [ ] 로그인/회원가입 화면 UI — [[screens/login]]
  - [ ] react-hook-form + Zod 스키마
  - [ ] 소셜 로그인 버튼 (Google, Apple)
  - [ ] isSubmitting 시 버튼 disabled
- [ ] 로그인 화면 Storybook (Default, Loading, Error)
- [ ] 앱 진입 시 토큰 유효성 확인

---

## Phase F3 — 단어 데이터 (읽기)

> 문서: [[schema/words]], [[schema/sentences]], [[screens/word-list]], [[screens/word-detail]]

- [ ] Pull 싱크 훅 — `usePullSync()` (앱 진입 시 백그라운드 실행)
- [ ] `useWords(filter?)` hook — SWR 패턴 (로컬 즉시 → 백그라운드 Pull)
- [ ] `useWord(id)` hook
- [ ] compromise.js 연동 — 예문 내 단어 토큰화/정규화 (오프라인 동작 확인)
- [ ] Web Speech API 연동 — TTS (오프라인 동작 확인)
- [ ] 단어 목록 화면 — [[screens/word-list]]
  - [ ] Virtual scroll (react-virtual, 50개 페이지)
  - [ ] Skeleton UI
  - [ ] 도메인 필터 (바텀 시트)
- [ ] 단어 목록 Storybook
- [ ] 단어 상세 화면 — [[screens/word-detail]]
  - [ ] 예문 내 단어 링크 (compromise.js → word id 매핑)
  - [ ] TTS 버튼
- [ ] 단어 상세 Storybook

---

## Phase F4 — 학습 (프론트)

> 문서: [[features/learning]], [[screens/study]], [[config]]

- [ ] `useLearningQueue` hook
  - [ ] 큐 로드 (`QUEUE_BATCH_SIZE=20`, `last_reviewed_at ASC NULLS FIRST`)
  - [ ] 리필 (`QUEUE_REFILL_THRESHOLD=10`)
  - [ ] Done 단어 제외
- [ ] `useTestResult` hook — `handleTestResult()` 호출 + 로컬 저장 + 싱크 큐 적재
- [ ] 외우기 모드 화면 — [[screens/study]]
- [ ] 외우기 모드 Storybook

---

## Phase F5 — 시험 + 오답

> 문서: [[features/learning]], [[screens/exam]], [[screens/session-complete]], [[screens/wrong-answers]]

- [ ] 시험 화면 — [[screens/exam]]
  - [ ] 모드 선택 바텀 시트 (타이핑 / 객관식, 세션 크기)
  - [ ] 타이핑 모드 UI (의미 표시, 키보드 위 입력 필드)
  - [ ] 객관식 모드 UI (4지선다, 세로 정렬, 우측 엄지 존)
  - [ ] 정답 → 펫 반응 → 다음 문제 자동 진행
  - [ ] 오답 → [지금 보기] / [나중에 보기]
    - [ ] 지금 보기: `reviewed_at = 현재 시각`
    - [ ] 나중에 보기: `reviewed_at = NULL` (오답 노트 적재)
- [ ] 시험 화면 Storybook (타이핑/객관식/정답/오답 각각)
- [ ] 세션 완료 화면 — [[screens/session-complete]]
  - [ ] 오늘 학습 N개 / Done 전환 N개 / 오답 N개
  - [ ] 큐 비면 "오늘 큐 완료!" + 펫 특별 반응
- [ ] 오답 노트 화면 — [[screens/wrong-answers]]
  - [ ] `is_correct = false AND reviewed_at = NULL` 목록 조회
  - [ ] [확인 완료] 탭 → `reviewed_at` 업데이트 → 목록에서 제거
  - [ ] 빈 목록 시 "오답 노트가 비었어요!" + 펫 반응
- [ ] 오답 노트 Storybook

---

## Phase F6 — 동기화 (프론트)

> 문서: [[features/sync]], [[screens/settings]]

- [ ] `useSync` hook — flush 실행, 동기화 상태 관리
- [ ] 수동 동기화 버튼 — 로그인 조건 미충족 시 disabled + 안내 문구
- [ ] 마지막 동기화 시각 표시 (`yyyy-mm-dd hh:mm`)
- [ ] 단어 추가 요청 UI — 온라인+로그인 필수, 미충족 시 disabled + 안내 문구
- [ ] 백그라운드 자동 싱크 — 앱 포커스 복귀 시 `syncQueue.flush()` 트리거

---

## Phase F7 — 펫 시스템

> 문서: [[features/pet-system]], [[screens/settings]]

- [ ] `pet/service.ts` — 이벤트 → 펫 반응 매핑 (맵 패턴)
- [ ] `usePet` hook — 펫 상태, 반응 트리거
- [ ] main 펫 컴포넌트 — 플로팅, 4방향 위치 설정
- [ ] main 펫 탭 → 바텀 시트 메뉴
  - [ ] 단어 목록 / 외우기 시작 / 시험 시작 / 오답 노트 / 통계 / 설정
- [ ] 펫 반응 애니메이션
  - [ ] 정답, 오답("괜찮아, 같이 다시 해보자!"), 오랜만 방문, 큐 완료
- [ ] `has_seen_nav_hint` — main 펫 탭 안내 최초 1회 표시
- [ ] domain 펫 팝업 컴포넌트 — 추천 시 잠깐 표시 후 사라짐
- [ ] 펫 컴포넌트 Storybook (각 반응 상태별)
- [ ] 설정 화면 — main/domain 펫 변경, 위치 설정

---

## Phase F8 — 통계

> 문서: [[features/statistics]], [[screens/statistics]]

- [ ] `useStatistics` hook — 집계 쿼리 (로컬 Dexie)
- [ ] 통계 화면 — [[screens/statistics]]
  - [ ] 오늘 학습 수 / Done 수
  - [ ] 연속 학습 스트릭 (숫자만, 경고 없음)
  - [ ] 도메인별 Done 비율 바 차트
  - [ ] 날짜별 학습량 바 차트
  - [ ] 타이핑/객관식 정답률
  - [ ] 자주 틀린 단어 상위 N개
- [ ] 통계 화면 Storybook

---

## Phase F9 — 설정 / 온보딩

> 문서: [[screens/settings]], [[screens/onboarding]]

- [ ] 설정 화면 — [[screens/settings]]
  - [ ] 계정 섹션 (로그인/로그아웃/회원가입)
  - [ ] 학습 설정 (SESSION_SIZE, DONE_THRESHOLD) — 바텀 시트
  - [ ] 동기화 섹션
  - [ ] 단어 추가 요청
- [ ] 온보딩 화면 — 최초 실행 시 빠르게 진입 (빈 페이지)
- [ ] 온보딩 Storybook

---

## Phase F10 — 마무리

- [ ] 멀티 테마 (다크/라이트) 전환
- [ ] Error Boundary 전체 연결 확인
- [ ] PWA 동작 확인
  - [ ] 오프라인 시 캐시된 버전으로 동작하는지
  - [ ] 설치 prompt 동작
- [ ] 모바일 반응형 최종 점검 (모바일 기준, PC 확장)
- [ ] Storybook 전체 스토리 점검
- [ ] Lighthouse 성능/PWA 점수 확인

---

## 연관 문서
- 공통 세팅 → [[checklist-setup]]
- 백엔드 작업 → [[checklist-back]]
- 화면 스펙 → [[screens/index]]
