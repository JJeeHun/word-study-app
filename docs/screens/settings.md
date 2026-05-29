---
tags: [screens, settings]
created: 2026-05-28
---

# 설정 화면

---

## 구성

```
[계정]
  로그인 / 로그아웃 / 회원가입

[펫]
  main 펫 변경
  domain 펫 변경 (domain별)
  위치 설정: 좌상 / 우상 / 좌하 / 우하

[학습]
  세션 크기 (SESSION_SIZE, 기본 10)
  Done 기준 (DONE_THRESHOLD, 기본 5)

[동기화]
  수동 동기화 버튼
  마지막 동기화 시각: yyyy-mm-dd hh:mm

[단어 추가 요청]
  단어 입력 → 온라인 필수
```

---

## UX 규칙

- 모든 인터랙션은 하단 영역 우선
- 항목 탭 → 바텀 시트로 세부 설정

---

## 연관 문서
- 동기화 기획 → [[../features/sync]]
- 펫 시스템 → [[../features/pet-system]]
- Config → [[../config]]
