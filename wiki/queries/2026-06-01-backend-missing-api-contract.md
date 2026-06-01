---
asked_at: 2026-06-01
confidence: high
---

# 백엔드 개발자에게 전달할 missing API 구조는 무엇인가?

## Answer
- 토큰 사용량 화면은 현재 학습자 UI에는 필요 없다. AI 비용/운영 추적용 admin 기능에 가깝다.
- 모의고사 목록 UI는 `GET /exams` 기반의 생성된 모의고사/응시 이력 목록 화면을 의미한다. 현재 `/exam` 화면은 목록이 아니라 시험 설정/시작 화면이므로 필수는 아니다.
- 북마크는 사용자가 나중에 다시 볼 문제를 저장하는 기능이다.
- 필요한 missing API 구조는 `docs/backend-api-gap-request.md`에 백엔드 전달용으로 정리했다.

## Evidence
- [[sources/psat-generation-openapi-v1]]
- [[queries/2026-05-27-swagger-local-api-gap]]

## Follow-ups
- P0는 CBT attempt submit/result save, auth/current user다.
- P1은 recommendations, analytics/dashboard, bookmarks다.
- token usage와 backend exam list UI는 admin/후속 범위로 분리 가능하다.
