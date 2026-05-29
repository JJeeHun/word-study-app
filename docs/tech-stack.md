---
tags: [tech-stack, architecture]
created: 2026-05-28
---

# 기술 스택

---

## 핵심 스택

| 영역 | 기술 | 버전 | 역할 |
|---|---|---|---|
| Language | TypeScript | latest | 전체 코드베이스 |
| Frontend | Next.js (React) | 14+ | UI 및 모든 학습 로직 |
| 로컬 DB | IndexedDB + Dexie.js | - | 오프라인 우선 데이터 저장소 |
| 클라우드 DB | Supabase (PostgreSQL) | - | 동기화 서버 |
| ORM | Drizzle ORM | - | DB 접근 추상화 레이어 |
| 배포 | Vercel | - | PWA 지원 |
| 텍스트 정규화 | compromise.js | - | 예문 내 단어 링크 처리 (브라우저 로컬) |
| TTS | Web Speech API | 브라우저 내장 | 단어 발음 (오프라인 지원) |

---

## ORM: Drizzle ORM 선택 이유

> [!note] Prisma vs Drizzle
> 두 가지 모두 사용 가능하나 이 프로젝트에서는 Drizzle을 권장.
>
> | 항목 | Drizzle | Prisma |
> |---|---|---|
> | TypeScript 친화성 | ✅ 완전 TS-first | 보통 |
> | 번들 크기 | 가벼움 | 무거움 |
> | Next.js Edge Runtime | ✅ 지원 | 제한적 |
> | Supabase PostgreSQL 연동 | ✅ | ✅ |
> | 학습 곡선 | 낮음 | 보통 |

---

## 아키텍처 원칙

→ [[architecture]] 참조

Supabase를 직접 호출하지 않음. Repository 인터페이스를 통해 접근하여 DB 교체 시 구현체만 변경.

---

## 연관 문서
- 아키텍처 상세 → [[architecture]]
- Config 상수 → [[config]]
