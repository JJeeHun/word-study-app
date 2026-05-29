---
tags: [schema, learning_records]
created: 2026-05-28
---

# learning_records 테이블

> 사용자별 단어 학습 상태.
> 모든 계산 로직은 프론트엔드에서 처리. 서버는 저장·동기화 역할만.
> 동기화: **Push** (로컬 기준, 충돌 시 로컬 우선)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| user_id | UUID | PK (복합키 1) | Supabase Auth ID 또는 Local UUID |
| word_id | UUID | FK → words.id, PK (복합키 2) | 단어 참조 |
| state | ENUM | NOT NULL, DEFAULT 'New' | New / Learning / Done |
| consecutive_correct | INT | NOT NULL, DEFAULT 0 | 현재 연속 정답 횟수 |
| last_reviewed_at | TIMESTAMP | NULL | 마지막 학습 시각 — 하루 1회 제한 체크 기준 |
| updated_at | TIMESTAMP | NOT NULL | Delta Sync 기준 |
| deleted_at | TIMESTAMP | NULL | Soft Delete |

---

## State 전환 정책

| State | 진입 조건 | 펫 반응 |
|---|---|---|
| `New` | 사용자가 단어를 학습 대상으로 직접 선택 | "새로운 게 생겼어!" |
| `Learning` | 큐에서 시험을 봤으나 Done 조건 미달성 | 오답 시 "괜찮아, 같이 다시 해보자!" |
| `Done` | `consecutive_correct >= DONE_THRESHOLD` 달성 | "냠냠 맛있었어!" |

모든 전환은 `handleTestResult()` 단일 함수에서 처리.
오답 시 `consecutive_correct = 0` 리셋.

→ DONE_THRESHOLD 값 [[../config]]

---

## 연관 문서
- 학습 플로우 → [[../features/learning]]
- Config 상수 → [[../config]]
- answer_logs → [[answer_logs]]
