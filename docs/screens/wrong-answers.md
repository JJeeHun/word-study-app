---
tags: [screens, wrong-answers]
created: 2026-05-28
---

# 오답 노트 화면

> `answer_logs.is_correct = false AND reviewed_at = NULL` 목록.

---

## 구성

```
[오답 단어 리스트]
  단어 + 의미
  틀린 횟수: N회
  [확인 완료]  ← 탭하면 reviewed_at = 현재 시각

```

---

## UX 규칙

- [확인 완료] 버튼 탭 → 목록에서 사라짐
- 목록이 비면 "오답 노트가 비었어요!" 메시지 + 펫 반응
- 단어 탭 → 단어 상세 화면 이동

---

## 진입

main 펫 메뉴 → 오답 노트

---

## 연관 문서
- answer_logs 스키마 → [[../schema/answer_logs]]
- 학습 플로우 → [[../features/learning#오답 처리]]
