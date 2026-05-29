---
tags: [screens, index, routing]
created: 2026-05-28
---

# 화면 목록 및 라우팅

> [!info] 전체 UX 원칙 (한손 최적화)
> - 인터랙션은 하단 엄지 존에 집중
> - 모달·필터·메뉴는 바텀 시트
> - 닫기(X) 버튼 상단 우측 금지 → 스와이프 다운으로 닫기
> - 주요 액션 버튼은 하단 배치
> - 뒤로가기는 스와이프 제스처

---

## 화면 목록

| 화면 | 경로 | 문서 |
|---|---|---|
| 온보딩 | `/onboarding` | [[onboarding]] |
| 로그인/회원가입 | `/login` | [[login]] |
| 홈 | `/` | [[home]] |
| 단어 목록 | `/words` | [[word-list]] |
| 단어 상세 | `/words/[id]` | [[word-detail]] |
| 외우기 모드 | `/study` | [[study]] |
| 시험 모드 | `/exam` | [[exam]] |
| 세션 완료 | `/exam/complete` | [[session-complete]] |
| 오답 노트 | `/wrong-answers` | [[wrong-answers]] |
| 통계 | `/statistics` | [[statistics]] |
| 설정 | `/settings` | [[settings]] |

---

## 네비게이션

전통적인 네비게이션 바 없음. **main 펫 탭 → 바텀 시트 메뉴**로 이동.

```
main 펫 탭
  └── 단어 목록
  └── 외우기 시작
  └── 시험 시작
  └── 오답 노트
  └── 통계
  └── 설정
```
