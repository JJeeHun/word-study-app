---
tags: [features, word-management]
created: 2026-05-28
---

# 단어 데이터 관리

---

## 데이터 생성 주체

**관리자**
- 크롤링 또는 일괄 입력으로 words / sentences / word_sentences 등록
- 등록 즉시 `status = 승인`

**사용자**
- 단어 추가 요청 가능
- `status = 미승인`으로 등록
- 관리자 승인 후 `status = 승인` 전환
- **온라인 필수** → 오프라인 시 요청 불가 안내

---

## 단어 필터 기준

| 필드 | 설명 |
|---|---|
| `difficulty` | 단어 자체 난이도 (1~5) |
| `frequency` | 사용 빈도 (1~5) |
| `cefr` | 언어 수준 (A1~C2) |
| `part_of_speech` | 품사 |
| `origin` | 어원 — 동일 어원 단어 탐색 가능 |
| `domain` | 사용 분야 (UPPERCASE 정규화) |

---

## 단어 목록 성능

- 무한 스크롤 + 가상 스크롤 적용
- IndexedDB 페이지네이션: `words.offset(page * 50).limit(50)`
- DOM 렌더링: `react-virtual` 사용 — 화면에 보이는 아이템만 렌더링

---

## 연관 문서
- words 스키마 → [[../schema/words]]
- 단어 목록 화면 → [[../screens/word-list]]
- 단어 상세 화면 → [[../screens/word-detail]]
