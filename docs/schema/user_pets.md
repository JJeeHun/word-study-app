---
tags: [schema, user_pets]
created: 2026-05-28
---

# user_pets 테이블

> 사용자와 펫의 연결 테이블.
> 동기화: **Push** (로컬 기준)

---

## 필드 정의

| 필드 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | UUID | PK | 고유 식별자 |
| user_id | UUID | FK → profiles.id, NOT NULL | 사용자 참조 |
| pet_id | UUID | FK → pets.id, NOT NULL | 펫 참조 |
| type | ENUM | NOT NULL | main / domain |
| domain | VARCHAR | NULL | domain 펫이면 해당 domain 값, main이면 NULL |
| created_at | TIMESTAMP | NOT NULL | |

---

## 비즈니스 규칙

**main 펫**
- 사용자당 1마리
- 글로벌 플로팅 표시 (메뉴 네비게이션 역할)
- 단어 추천 없음

**domain 펫**
- domain당 1마리
- 항상 화면에 표시되지 않음 — 단어 추천 시에만 팝업으로 등장
- 해당 domain의 미학습 단어 추천

**온보딩 시 배정**
- main 펫: 사용자가 직접 선택
- domain 펫: 랜덤 자동 배정 → 설정에서 변경 가능

---

## 연관 문서
- 펫 시스템 기획 → [[../features/pet-system]]
- pets → [[pets]]
- profiles → [[profiles]]
