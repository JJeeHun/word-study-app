---
tags: [config, constants]
created: 2026-05-28
---

# Config 상수

> [!info]
> 프론트엔드 config 파일로 분리 관리.
> 추후 사용자 설정 화면으로 노출 가능한 항목 표시.

---

## 학습 관련

| 상수 | 기본값 | 사용자 설정 | 설명 |
|---|---|---|---|
| `DONE_THRESHOLD` | `5` | ✅ 가능 | 연속 정답 횟수 — Done 전환 임계값 |
| `SESSION_SIZE` | `10` | ✅ 가능 | 세션 1회 시험 단어 수 |

## 큐 관련

| 상수 | 기본값 | 사용자 설정 | 설명 |
|---|---|---|---|
| `QUEUE_BATCH_SIZE` | `20` | ❌ 숨김 | 큐 1회 로드 단어 수 |
| `QUEUE_REFILL_THRESHOLD` | `10` | ❌ 숨김 | 큐 리필 트리거 잔여량 |

> [!note]
> `QUEUE_BATCH_SIZE`와 `QUEUE_REFILL_THRESHOLD`는 성능 튜닝용 내부 상수.
> 사용자에게 노출하지 않음.
> `QUEUE_REFILL_THRESHOLD`는 항상 `QUEUE_BATCH_SIZE`보다 작아야 함.

---

## 연관 문서
- 학습 플로우 → [[features/learning]]
- 큐 로직 상세 → [[features/learning#큐 구성]]
