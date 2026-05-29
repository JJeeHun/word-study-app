---
tags: [schema, sentences]
created: 2026-05-28
---

# sentences 테이블

> 예문 정보 저장소. 관리자 등록.
> 동기화: **Pull** (서버 기준 최신화)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | UUID | PK | 고유 식별자 |
| text | TEXT | NOT NULL | 예문 내용 (순수 텍스트, 마크업 없음) |
| source | VARCHAR | NULL | 예문 출처 메타데이터 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | Delta Sync 기준 |
| deleted_at | TIMESTAMP | NULL | Soft Delete |

---

## 비즈니스 규칙

**예문 내 단어 링크 처리 (프론트 로직)**
1. 공백 기준 split
2. `compromise.js`로 토큰 정규화 (축약형·복수형·동사 변형)
3. IndexedDB words 테이블에서 조회
4. 있으면 → 클릭 가능한 링크 렌더링
5. 없으면 → 일반 텍스트

오프라인 환경에서도 동작 (`compromise.js`는 브라우저 로컬 실행).

---

## 연관 문서
- word_sentences → [[word_sentences]]
- 단어 상세 화면 → [[../screens/word-detail]]
