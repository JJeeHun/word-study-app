---
tags: [schema, index]
created: 2026-05-28
---

# 스키마 전체 개요

> [!info] 공통 규칙
> - 모든 테이블은 `updated_at`, `deleted_at` 보유 → Delta Sync + Soft Delete 지원
> - 동기화 정책: **관리자 데이터(Read용) → Pull** / **사용자 데이터 → Push**
> - 아키텍처 원칙 → [[../architecture]]

---

## 테이블 목록

| 테이블 | 설명 | 동기화 | 문서 |
|---|---|---|---|
| words | 단어 정보 | Pull (서버 기준) | [[words]] |
| sentences | 예문 정보 | Pull (서버 기준) | [[sentences]] |
| word_sentences | 단어-예문 M:N | Pull (서버 기준) | [[word_sentences]] |
| learning_records | 사용자 학습 상태 | Push (로컬 기준) | [[learning_records]] |
| profiles | 사용자 프로필 | Push (로컬 기준) | [[profiles]] |
| pets | 펫 종류 레퍼런스 | Pull (서버 기준) | [[pets]] |
| user_pets | 사용자-펫 연결 | Push (로컬 기준) | [[user_pets]] |
| answer_logs | 답변 기록 + 오답 큐 | Push (로컬 기준) | [[answer_logs]] |

---

## 관계 다이어그램

```
words ──────────── word_sentences ──── sentences
  │
  └── learning_records (user_id + word_id)
  └── answer_logs (user_id + word_id)

profiles ──── user_pets ──── pets
```
