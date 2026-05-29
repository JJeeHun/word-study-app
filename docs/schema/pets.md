---
tags: [schema, pets]
created: 2026-05-28
---

# pets 테이블

> 선택 가능한 펫 종류 레퍼런스 테이블. 관리자 관리.
> 동기화: **Pull** (서버 기준)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | UUID | PK | 고유 식별자 |
| species | VARCHAR | NOT NULL | 종류 (강아지 / 고양이 / 햄스터 등) |
| variant | VARCHAR | NOT NULL | 타입 (A / B / C 등) |
| name | VARCHAR | NOT NULL | 표시 이름 |

---

## 연관 문서
- 펫 시스템 기획 → [[../features/pet-system]]
- user_pets → [[user_pets]]
