---
tags: [features, learning]
created: 2026-05-28
---

# 학습 플로우

---

## State 관리

→ [[../schema/learning_records]]

| State | 진입 조건 |
|---|---|
| `New` | 사용자가 단어를 학습 대상으로 직접 선택 |
| `Learning` | 큐에서 시험을 봤으나 Done 조건 미달성 |
| `Done` | 연속 정답 임계값 달성, 큐에서 자동 제외 |

---

## 학습 모드

세션 시작 시 사용자가 선택. 세션 내내 동일 모드 유지.

| 타입 | 방식 | 정답 처리 |
|---|---|---|
| **타이핑** | 의미 보고 단어 입력 | 대소문자 무시 + 레벤슈타인 거리 허용 |
| **객관식** | 단어 보고 의미 선택 (4지선다) | 선택지는 words에서 랜덤 추출 |

---

## 큐 구성

**목표:** 큐 제로 (New/Learning 단어를 전부 Done으로 전환)

**가상 큐(Virtual Queue) 방식** — 전체 단어를 메모리에 올리지 않고 배치 로드.

```
큐 잔여 <= QUEUE_REFILL_THRESHOLD
  → IndexedDB에서 추가 로드
  → 조건: state = New / Learning
  → 정렬: last_reviewed_at ASC (NULL 먼저 = New 단어 우선)
  → 중복 제거: 현재 큐의 word_id 제외
  → 1회 로드량: QUEUE_BATCH_SIZE
```

단어당 하루 1회 제한 (`last_reviewed_at` 기준).

→ Config 값 [[../config]]

---

## Done 판정 로직 — handleTestResult()

모든 State 전환은 이 함수에서만 처리.

```typescript
function handleTestResult(isCorrect: boolean, record: LearningRecord): LearningRecord {
  if (isCorrect) {
    record.consecutive_correct += 1
    if (record.consecutive_correct >= DONE_THRESHOLD) {
      record.state = 'Done'
    } else {
      record.state = 'Learning'
    }
  } else {
    record.consecutive_correct = 0
    record.state = 'Learning'
  }
  record.last_reviewed_at = new Date()
  return record
}
```

---

## 오답 처리

→ [[../schema/answer_logs]]

- **지금 보기** → `reviewed_at = 즉시 현재 시각`
- **나중에 보기** → `reviewed_at = NULL` → 오답 노트에서 추후 확인

뇌과학 근거: 모르는 것을 스스로 기억하려는 노력(인출 연습)이 기억력에 더 효과적.
바로 보여주면 뇌가 다시 잊을 수 있음.

---

## 세션 구성

```
모드 선택 (타이핑 / 객관식) + 세션 크기 설정 (기본: SESSION_SIZE = 10)
→ 큐에서 SESSION_SIZE개 단어로 시험
→ SESSION_SIZE개 완료 → 세션 종료 화면
→ 큐에 남은 단어는 다음 세션에서 이어서
```

---

## 연관 문서
- learning_records 스키마 → [[../schema/learning_records]]
- answer_logs 스키마 → [[../schema/answer_logs]]
- Config → [[../config]]
- 시험 화면 → [[../screens/exam]]
- 세션 완료 화면 → [[../screens/session-complete]]
