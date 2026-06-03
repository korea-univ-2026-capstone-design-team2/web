---
source: raw/2026-05-27-psat-generation-openapi-v1.md
source_type: openapi_snapshot
confidence: high
updated_at: 2026-06-02
---

# PSAT Generation OpenAPI v1

## Summary
- 사용자 제공 Swagger는 5급 PSAT 문제 생성/모의고사/토큰 사용량 API 계약이다.
- 프론트에서 즉시 연결 가능한 주요 조회 API는 `/exams`, `/exams/{examId}`, `/questions/{questionId}/paper`, `/questions/{questionId}/review`, `/questions/{questionId}/detail`, `/questions/papers`, `/questions/reviews`이다.
- 생성 계열 API는 `/exams`, `/question-generations`, `/questions`, `/question-generations/ingest`로 나뉜다.
- 토큰 사용량 API는 조회/통계/기록을 제공하지만 현재 UI 화면은 없다.

## Key Facts
- 백엔드 서버 예시는 `http://localhost:8080`이다.
- 문제 paper/review/detail 및 exam 응답은 직접 DTO이고, token usage 조회/통계는 `data` 래퍼를 사용한다.
- exam detail은 `items[].questionId` 목록을 제공한다.
- Swagger의 `GET /questions/papers`, `GET /questions/reviews`는 request body를 요구하므로 실제 프론트 연동은 백엔드와 합의한 `POST /questions/papers`, `POST /questions/reviews`로 처리한다.

## Implications for oh-my-study
- Next.js 클라이언트 코드에서는 `NEXT_PUBLIC_API_BASE_URL`을 사용해야 `.env.local`과 Vercel 환경변수 모두에서 동작한다.
- 시험 세션/결과 화면은 `/exams/{examId}`에서 문항 ID 목록을 가져온 뒤 `/questions/papers`, `/questions/reviews` 다건 조회를 POST로 호출한다.
- API 클라이언트는 직접 DTO와 `{ data }` 래퍼를 모두 처리해야 한다.
- 대형 시험에서도 paper/review 네트워크 호출은 화면당 1회로 제한한다.

## Contradictions / Caveats
- 사용자 문구에는 Vite 언급이 있었지만 현재 레포는 Next.js 16이다.
- Swagger의 `AnswerChoiceViewWithAnswer` 정오답 필드는 `isCorrect`이다.
- 기존 로컬 앱에는 auth/analytics/recommendation/bookmark 등 Swagger 범위 밖 기능이 남아 있다.

## Related
- [[decisions/question-id-number-standard-v1]]
- [[sessions/2026-05-18-exam-dto-direct-migration]]
