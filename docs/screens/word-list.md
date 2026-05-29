---
tags: [screens, word-list]
created: 2026-05-28
---

# 단어 목록 화면

---

## 구성

```
[상태 필터 칩]  전체 / New / Learning / Done  (상단 고정)

[단어 리스트]
  단어 + 의미
  [외울게요] 버튼 (이미 학습 중이면 비활성)

[필터 버튼]  ← 하단, 탭하면 바텀 시트 오픈
```

---

## 필터 바텀 시트

difficulty / frequency / cefr / part_of_speech / origin / domain

---

## 성능

- 무한 스크롤 + 가상 스크롤 (react-virtual)
- IndexedDB 페이지네이션: 50개씩 로드
- 학습 상태 체크: 화면에 보이는 word_id로 `learning_records` 배치 조회 (로컬 IndexedDB)

---

## UX 규칙

- 필터는 하단 바텀 시트 (상단 고정 X)
- "외울게요" 버튼은 하단 엄지 존

---

## 연관 문서
- 단어 관리 → [[../features/word-management]]
- 단어 상세 → [[word-detail]]
