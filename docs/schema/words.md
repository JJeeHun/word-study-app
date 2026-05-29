---
tags: [schema, words]
created: 2026-05-28
---

# words 테이블

> 단어 정보 저장소. 관리자 등록 + 사용자 요청(미승인) 포함.
> 동기화: **Pull** (서버 기준 최신화)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | UUID | PK | 고유 식별자 |
| text | VARCHAR | UNIQUE, NOT NULL | 단어 원문 |
| meaning | TEXT | NOT NULL | 의미 (복수 의미는 줄바꿈 구분) |
| difficulty | INT | NOT NULL | 단어 난이도 (1~5, 1 = 쉬움) |
| frequency | INT | NOT NULL | 사용 빈도 (1~5, 1 = 가장 자주 쓰임) |
| cefr | ENUM | NULL | A1 / A2 / B1 / B2 / C1 / C2 |
| part_of_speech | ENUM | NOT NULL | noun / verb / adjective / adverb / preposition / conjunction |
| origin | VARCHAR | NULL | 어원 (Latin / Greek / French / Anglo-Saxon 등) |
| domain | VARCHAR | NOT NULL | 사용 분야 — 저장 시 UPPERCASE 정규화 |
| status | ENUM | NOT NULL, DEFAULT '미승인' | 미승인 / 승인 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | Delta Sync 기준 |
| deleted_at | TIMESTAMP | NULL | Soft Delete |

---

## 비즈니스 규칙

**status 정책**
- 관리자 등록 → 즉시 `승인`
- 사용자 요청 → `미승인` → 관리자 승인 후 `승인`
- 미승인 단어도 조회 가능 (상태 표시)

**단어 추가 요청 — 온라인 필수**
오프라인 UUID 중복 문제로 오프라인 우선 원칙의 예외 케이스.
네트워크 없을 시 요청 불가 안내.

**domain 정규화**
저장 시 항상 UPPERCASE 변환. 필터 목록은 `SELECT DISTINCT domain FROM words`로 동적 생성.

**origin 탐색**
origin 클릭 시 동일 어원 단어 목록 탐색 가능. 예문 링크와 동일한 지식 연결 컨셉.

---

## 연관 문서
- 단어 관리 기획 → [[../features/word-management]]
- word_sentences → [[word_sentences]]
- learning_records → [[learning_records]]
