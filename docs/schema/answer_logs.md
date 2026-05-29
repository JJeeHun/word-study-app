---
tags: [schema, answer_logs]
created: 2026-05-28
---

# answer_logs 테이블

> 모든 답변 기록. 오답 큐 관리 + 오답 분석에 활용.
> 동기화: **Push** (로컬 기준)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | UUID | PK | 고유 식별자 |
| user_id | UUID | FK → profiles.id, NOT NULL | 사용자 참조 |
| word_id | UUID | FK → words.id, NOT NULL | 단어 참조 |
| is_correct | BOOLEAN | NOT NULL | 정답 여부 |
| mode | ENUM | NOT NULL | typing / multiple_choice |
| answered_at | TIMESTAMP | NOT NULL | 시험 시각 |
| reviewed_at | TIMESTAMP | NULL | 오답 확인 시각 — NULL이면 오답 큐에 있는 상태 |
| updated_at | TIMESTAMP | NOT NULL | Delta Sync 기준 |

---

## 비즈니스 규칙

**오답 큐**
`is_correct = false AND reviewed_at = NULL` → 오답 큐에 있는 항목

**오답 확인 방식**
- 지금 보기 → `reviewed_at = 즉시 현재 시각`
- 나중에 보기 → `reviewed_at = NULL` 유지 → 오답 노트에서 추후 확인 → `reviewed_at = 확인 시각`

**오답 분석**
`word_id` 기준으로 `is_correct = false` 집계 → 자주 틀리는 단어 파악 가능

> [!warning] 멀티 디바이스 충돌 정책
> `reviewed_at`은 Push 예외 규칙 적용.
> NULL보다 값이 있는 쪽이 항상 우선 (한번 확인한 건 취소되지 않음).

---

## 연관 문서
- 오답 노트 화면 → [[../screens/wrong-answers]]
- 통계 기획 → [[../features/statistics]]
- 학습 플로우 → [[../features/learning]]
