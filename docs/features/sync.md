---
tags: [features, sync]
created: 2026-05-28
---

# 동기화 전략

---

## 기본 원칙

모든 데이터 생성·수정·조회는 **IndexedDB(로컬) 우선**.
네트워크 연결 시 Sync Queue를 통해 백그라운드 동기화.

---

## 테이블별 동기화 정책

| 분류 | 테이블 | 정책 | 충돌 시 |
|---|---|---|---|
| 관리자 데이터 (Read용) | words, sentences, word_sentences, pets | **Pull** (서버 기준) | 서버 우선 |
| 사용자 데이터 | learning_records, profiles, user_pets, answer_logs | **Push** (로컬 기준) | 로컬 우선 |

---

## Delta Sync

`updated_at` 기준으로 마지막 동기화 이후 변경분만 전송.

```
마지막 동기화 시각 저장
  → 다음 동기화 시 updated_at > 마지막 시각인 레코드만 추출
  → 서버로 전송
```

---

## 예외 케이스

**단어 추가 요청 — 온라인 필수**
오프라인 UUID 중복 문제로 즉시 서버 전송 필요.
네트워크 없을 시 "인터넷 연결 후 시도해주세요" 안내.

**answer_logs.reviewed_at — non-null 우선**
Push 정책 예외. NULL보다 값이 있는 쪽이 항상 우선.
(한번 확인한 오답은 취소되지 않음)

---

## 수동 / 자동 동기화

- 수동: 설정 화면에서 언제든 실행 가능
- 자동: 수동 동기화 기반 백그라운드 주기 실행
- 마지막 동기화 시각 설정 화면에 표시

---

## UX 정책

- 앱 실행 시 로컬 데이터 우선 렌더링 → 서버 비동기 대조 (Stale-While-Revalidate)
- 데이터 업데이트 시 Toast 메시지로만 고지 (학습 흐름 방해 금지)
- 앱 재접속 시 마지막 학습 위치 자동 복구

---

## 연관 문서
- 아키텍처 원칙 → [[../architecture]]
- 인증 헬스체크 → [[auth#Sync 전 인증 헬스체크]]
- 설정 화면 → [[../screens/settings]]
