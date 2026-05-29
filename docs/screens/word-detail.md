---
tags: [screens, word-detail]
created: 2026-05-28
---

# 단어 상세 화면

---

## 구성

```
단어 (크게)
🔊 발음 듣기 (Web Speech API, 오프라인 동작)
품사  /  난이도  /  도메인
어원 → 탭하면 동일 어원 단어 목록 (새 페이지 이동)
의미
예문 (기본 2~3개, 더 보기로 나머지)
  └ 각 단어 → compromise.js 정규화 후 words 링크
[외울게요] 버튼 (이미 학습 중이면 비활성)

← prev    next →  (하단 네비게이션)
```

---

## 진입 경로별 prev/next 기준

| 진입 경로 | prev/next 기준 |
|---|---|
| 외우기 모드에서 진입 | 외우기 리스트 (New/Learning 단어) |
| 단어 목록에서 진입 | 현재 필터 적용된 단어 목록 |

---

## UX 규칙

- 닫기(X) 없음 → 스와이프 백 또는 prev/next
- prev/next는 하단 배치
- "더 보기" 버튼으로 예문 펼치기

---

## 연관 문서
- sentences 스키마 → [[../schema/sentences]]
- words 스키마 → [[../schema/words]]
- 외우기 모드 → [[study]]
