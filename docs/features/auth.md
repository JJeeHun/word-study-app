---
tags: [features, auth]
created: 2026-05-28
---

# 인증

---

## 지원 방식

Supabase Auth 기본 제공.

- 이메일/비밀번호
- Google OAuth
- Kakao OAuth

---

## 비로그인 → 로그인 전환

회원가입은 선택사항. 앱 시작 시 Local UUID로 임시 유저 자동 생성.

```
비로그인: { id: localUUID, email: null, isGuest: true,  pet: {...} }
로그인:   { id: supabaseId, email: '...', isGuest: false, pet: {...} }
```

로그인 시 `synced_at` 확인 후 최초 동기화 진행.
→ [[../schema/profiles#synced_at 흐름]]

---

## Sync 전 인증 헬스체크

```
Sync 시도
  → JWT 유효성 확인 (Supabase SDK 자동 갱신 시도)
  → Refresh Token 만료 → 재로그인 유도
      → 로컬 user 정보에서 email 자동 바인딩
      → 비밀번호만 입력받아 재인증
  → 인증 완료 → Sync 진행
```

---

## 연관 문서
- profiles 스키마 → [[../schema/profiles]]
- 동기화 전략 → [[sync]]
- 로그인 화면 → [[../screens/login]]
