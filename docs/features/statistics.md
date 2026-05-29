---
tags: [features, statistics]
created: 2026-05-28
---

# 통계

> 남과 비교하지 않음. 나 자신의 성장만 보여줌.
> 압박 없음 — 경고·알림으로 강제하지 않음.

---

## 표시 항목

**오늘 현황**
- 오늘 학습한 단어 수
- 오늘 Done 된 단어 수

**전체 진행률**
- domain별 Done 비율 (예: IT 34% / 일상 60%)

**스트릭**
- 연속 학습 일수 표시만 (`profiles.current_streak`)
- 경고·알림 없음

**날짜별 학습량 그래프**
- `answer_logs.answered_at` 기준 날짜별 COUNT
- 추가 스키마 불필요

**타이핑 / 객관식 정답률 비교**
- `answer_logs.mode` 기준 `is_correct` 평균

**오답 분석**
- `answer_logs.word_id` 기준 오답 횟수 집계
- 자주 틀린 단어 상위 N개

---

## 데이터 소스

모든 통계는 `learning_records`와 `answer_logs`에서 집계. 별도 통계 테이블 없음.

---

## 연관 문서
- answer_logs 스키마 → [[../schema/answer_logs]]
- learning_records 스키마 → [[../schema/learning_records]]
- 통계 화면 → [[../screens/statistics]]
