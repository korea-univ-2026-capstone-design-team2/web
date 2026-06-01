---
status: accepted
updated_at: 2026-05-27
---

# Backend API env and Swagger contract v1

## Context
- 사용자 제공 OpenAPI 스냅샷을 기준으로 백엔드 API를 프론트에 적용해야 했다.
- 사용자 질문에는 Vite/Vercel 환경변수 언급이 있었지만, 현재 레포는 Next.js 16 App Router다.
- 기존 `questionService`는 `NEXT_PUBLIC_API_BASE_URL` 기반으로 일부 question paper/review만 연결하고 있었다.

## Decision
- 백엔드 API 주소는 `NEXT_PUBLIC_API_BASE_URL`로 표준화한다.
- `.env.local`과 Vercel Project Environment Variables에 동일한 키를 사용한다.
- 공통 API 클라이언트에서 직접 DTO 응답과 `{ data }` 래퍼 응답을 모두 처리한다.
- Swagger 타입은 보존하되, UI에서 쓰는 normalized question paper/review 타입은 별도 매핑으로 유지한다.
- 백엔드 미설정 또는 일부 조회 실패 시 기존 mock fallback을 유지한다.

## Alternatives
- `VITE_API_BASE_URL`: 현재 Next.js 프로젝트와 맞지 않고 브라우저 번들 노출 규칙도 다르다.
- 서버 전용 환경변수 + Route Handler proxy: 런타임 환경변수 교체에는 유리하지만 현재 인증/비밀 헤더 요구가 없어 복잡도가 증가한다.
- fallback 제거: 통합 실패를 빠르게 드러내지만 백엔드 없이 로컬 UI 개발이 막힌다.

## Consequences
- positive:
  - Vercel과 로컬 `.env.local` 설정이 단순하다.
  - Swagger 응답 차이를 서비스 계층에서 흡수해 화면 변경 범위를 줄인다.
  - 백엔드 없이도 기존 mock 기반 화면 확인이 가능하다.
- negative:
  - `NEXT_PUBLIC_*` 값은 클라이언트 번들에 노출되고 빌드 시점에 고정된다.
  - fallback이 통합 오류를 숨길 수 있어 배포 전 실제 API 검증이 별도로 필요하다.
  - batch question 조회 API 부재로 세션/결과 진입 시 문항 수만큼 API 호출이 발생한다.

## References
- [[sources/psat-generation-openapi-v1]]
- [[decisions/question-id-number-standard-v1]]
