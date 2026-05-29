---
tags: [index, overview]
created: 2026-05-28
---

# 프로젝트 문서 인덱스

> [!info] AI 독자를 위한 안내
> 각 문서는 독립적으로 읽힐 수 있도록 작성됨.
> 필요한 섹션만 선택적으로 읽고, 연관 문서는 링크로 이동.

---

## 빠른 참조

| 목적 | 문서 |
|---|---|
| 전체 기획 파악 | [[features/index]] |
| 특정 기능 구현 | [[features/]] 하위 파일 |
| DB 테이블 확인 | [[schema/index]] |
| 특정 테이블 확인 | [[schema/]] 하위 파일 |
| 화면 구성 확인 | [[screens/index]] |
| Config 상수 | [[config]] |
| 기술 스택 | [[tech-stack]] |
| 아키텍처 원칙 | [[architecture]] |

---

## 문서 구조

```
docs/
├── index.md              ← 현재 파일
├── config.md             ← Config 상수 전체
├── tech-stack.md         ← 기술 스택
├── architecture.md       ← 헥사고날 아키텍처 원칙
│
├── schema/
│   ├── index.md          ← 스키마 전체 개요 + 테이블 목록
│   ├── words.md
│   ├── sentences.md
│   ├── word_sentences.md
│   ├── learning_records.md
│   ├── profiles.md
│   ├── pets.md
│   ├── user_pets.md
│   └── answer_logs.md
│
├── features/
│   ├── index.md          ← 기능 목록 + 링크
│   ├── auth.md           ← 인증
│   ├── learning.md       ← 학습 플로우
│   ├── pet-system.md     ← 펫 시스템
│   ├── sync.md           ← 동기화 전략
│   ├── statistics.md     ← 통계
│   └── word-management.md← 단어 데이터 관리
│
└── screens/
    ├── index.md          ← 화면 목록 + 라우팅
    ├── onboarding.md
    ├── home.md
    ├── word-list.md
    ├── word-detail.md
    ├── study.md
    ├── exam.md
    ├── session-complete.md
    ├── wrong-answers.md
    ├── statistics.md
    ├── settings.md
    └── login.md
```
