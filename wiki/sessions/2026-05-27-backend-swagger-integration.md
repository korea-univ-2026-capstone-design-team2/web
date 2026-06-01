# Backend Swagger Integration

## Date
- 2026-05-27

## Context
- 사용자 제공 OpenAPI 스냅샷을 기준으로 백엔드 API를 프론트 프로젝트에 적용 요청.
- 백엔드 API 주소 설정은 `.env`와 Vercel 환경변수 모두와 호환되어야 했다.
- 기존 프로젝트는 Vite가 아니라 Next.js 16이므로 `NEXT_PUBLIC_API_BASE_URL`을 사용해야 한다.
- 기존 세션/결과 화면은 question DTO 일부만 mock fallback과 함께 연결되어 있었다.

## Changes
- API 설정/클라이언트
  - `.env.example` 추가: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
  - `src/lib/api/client.ts` 추가: JSON request, query builder, direct DTO와 `{data}` wrapper 자동 처리
- Swagger 타입/서비스
  - `src/types/question-dto.ts`를 Swagger enum/DTO 중심으로 확장
  - `src/lib/services/questionService.ts`: paper/review/detail 직접 DTO 조회 및 normalized UI 타입 매핑
  - `src/lib/services/examService.ts`: `/exams`, `/exams/{examId}`, `POST /exams` 서비스 추가
  - `src/lib/services/questionGenerationService.ts`: `/question-generations`, `/question-generations/ingest` 서비스 추가
  - `src/lib/services/tokenUsageService.ts`: `/token-usages`, `/token-usages/statistics` 서비스 추가
- 화면 연결
  - `src/app/(main)/exam/page.tsx`: 5급 PSAT 선택 + API 설정 시 `POST /exams`로 모의고사 생성 후 backend examId로 이동
  - `src/app/(main)/exam/[examId]/session/page.tsx`: backend examId면 `/exams/{examId}`에서 questionIds를 받아 paper 조회
  - `src/app/(main)/exam/[examId]/result/page.tsx`: backend examId면 `/exams/{examId}`에서 questionIds를 받아 review 조회
- 문서
  - Swagger source summary, API env decision, API gap query, design doc 작성

## Decisions
- [[decisions/backend-api-env-and-swagger-contract-v1]]
- 기존 [[decisions/question-id-number-standard-v1]] 유지

## Verification
- `npx tsc --noEmit`: 통과
- `npx eslint src/lib/api/client.ts src/types/question-dto.ts src/lib/mappers/questionDtoMapper.ts src/lib/services/questionService.ts src/lib/services/examService.ts src/lib/services/questionGenerationService.ts src/lib/services/tokenUsageService.ts 'src/app/(main)/exam/page.tsx' 'src/app/(main)/exam/[examId]/session/page.tsx' 'src/app/(main)/exam/[examId]/result/page.tsx'`: 통과
- `npm run lint`: errors=0, warnings=2
  - 기존 경고: `api-develop/infrastructure/performance/k6/generate-question.js` anonymous default export
  - 기존 경고: `src/components/exam/QuestionNavPanel.tsx` unused `HelpCircle`
- `npm run wiki:lint`: issues=0 (`wiki/lint/2026-05-27T13-09-52.md`)
- `npm run build`: 사용자 지시에 따라 추가 실행하지 않음. 이전 1회 시도는 `next/font/google`의 Google Fonts fetch 네트워크 실패로 종료.

## Next
- 실제 백엔드 URL을 `NEXT_PUBLIC_API_BASE_URL`에 설정한 환경에서 `/exams` 생성부터 세션/결과까지 수동 QA 필요.
- 답안 제출/결과 저장 API가 Swagger에 없어 현재 결과 화면의 사용자 답안은 여전히 로컬 mock 계산이다.
- batch paper/review endpoint 추가 여부를 백엔드와 협의하면 문항 수 N회 호출을 줄일 수 있다.
