---
tags: [schema, word_sentences]
created: 2026-05-28
---

# word_sentences 테이블

> words ↔ sentences M:N 관계 테이블.
> 동기화: **Pull** (서버 기준 최신화)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | UUID | PK | 고유 식별자 |
| word_id | UUID | FK → words.id, NOT NULL | 단어 참조 |
| sentence_id | UUID | FK → sentences.id, NOT NULL | 예문 참조 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | Delta Sync 기준 |
| deleted_at | TIMESTAMP | NULL | Soft Delete |

---

## 연관 문서
- words → [[words]]
- sentences → [[sentences]]
