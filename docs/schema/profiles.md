---
tags: [schema, profiles]
created: 2026-05-28
---

# profiles 테이블

> Supabase `auth.users`를 확장한 사용자 프로필 테이블.
> 동기화: **Push** (로컬 기준)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | UUID | PK, FK → auth.users.id | Supabase Auth ID |
| email | VARCHAR | NOT NULL | 재로그인 화면 자동 바인딩용 |
| synced_at | TIMESTAMP | NULL | 최초 동기화 시각 — NULL이면 미동기화 |
| current_streak | INT | NOT NULL, DEFAULT 0 | 연속 학습 일수 |
| last_study_date | DATE | NULL | 마지막 학습 날짜 — 스트릭 계산 기준 |
| pet_position | ENUM | NOT NULL, DEFAULT 'bottom-right' | 메인 펫 위치 (top-left / top-right / bottom-left / bottom-right) |
| has_seen_nav_hint | BOOLEAN | NOT NULL, DEFAULT false | 네비게이션 힌트 확인 여부 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | Delta Sync 기준 |

---

## synced_at 흐름

1. 앱 설치 → Local UUID로 데이터 적재
2. 계정 생성/로그인 → `synced_at = NULL` 확인
3. 로컬 데이터의 `user_id`를 Supabase Auth ID로 일괄 교체
4. 서버로 전체 Push
5. `synced_at = 현재 시각`으로 업데이트

동기화 실패 시 `synced_at = NULL` 유지 → 다음 로그인 시 자동 재시도 (멱등성 보장)

---

## 연관 문서
- 인증 기획 → [[../features/auth]]
- 펫 시스템 → [[../features/pet-system]]
- user_pets → [[user_pets]]
