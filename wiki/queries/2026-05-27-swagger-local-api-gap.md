---
asked_at: 2026-05-27
confidence: high
---

# Swagger와 로컬 기능/API 차이는 무엇인가?

## Answer
- Swagger에는 있지만 현재 로컬 UI에 없는 기능:
  - 토큰 사용량 목록/통계/기록 화면: `GET/POST /token-usages`, `GET /token-usages/statistics`
  - 문제 생성 단독 화면: `POST /question-generations`
  - 생성 프레임 ingest 관리 기능: `POST /question-generations/ingest`
  - 관리자용 문제 상세 화면: `GET /questions/{questionId}/detail`
  - 모의고사 목록 화면의 백엔드 목록 연동: `GET /exams`는 서비스만 추가했고 현재 UI는 정적 카테고리 중심이다.
- 로컬에는 있지만 Swagger에 없는 API 후보:
  - 인증/회원: login, signup, current user, profile update
  - 사용자 목표 시험/마이페이지 설정 저장
  - 추천 문제 목록/추천 사유: current user 기준 recommendations
  - 북마크 목록/토글
  - 취약점/학습 통계/대시보드 analytics
  - CBT 답안 제출 및 결과 저장: selected answer, time spent, unknown/bookmark state 포함
  - 시험 카테고리/과목 목록: 현재 로컬은 9급/경찰/소방/전산직 카테고리도 보유

## Proposed API Gap Report Format
- `area`: 기능 영역
- `frontend_route`: 관련 화면
- `needed_endpoint`: 필요한 API
- `method`: HTTP method
- `request_shape`: 주요 request 필드
- `response_shape`: 주요 response 필드
- `priority`: P0/P1/P2
- `swagger_status`: missing / partial / present
- `notes`: 의존성, fallback, 보안 고려

## Evidence
- [[sources/psat-generation-openapi-v1]]
- [[sessions/2026-05-18-exam-dto-direct-migration]]

## Follow-ups
- 답안 제출/결과 저장 API를 우선 확정해야 실제 CBT 플로우가 mock user answer에서 벗어날 수 있다.
- batch paper/review API 추가 여부를 백엔드와 협의해야 한다.
- 토큰 사용량 화면은 현재 학습자 UI 범위에서는 제외한다. 운영/admin 비용 추적 기능으로 별도 분리한다.
- 백엔드 전달용 missing API 구조는 [[queries/2026-06-01-backend-missing-api-contract]] 및 `docs/backend-api-gap-request.md`를 기준으로 한다.
