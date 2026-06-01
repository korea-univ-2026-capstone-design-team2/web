# PSAT Exam List UI

## Date
- 2026-06-01

## Context
- 사용자 결정:
  - 현재 백엔드는 PSAT 모의고사 중심이므로 프론트도 mock 기반 범용 시험 설정 UI를 유지하지 않는다.
  - 일단 목록만 보여주고, 백엔드에 이미 생성된 모의고사만 응시한다.
- 관련 근거:
  - Swagger에 `GET /exams`, `GET /exams/{examId}`, `GET /questions/{questionId}/paper`가 있다.
  - 세션 화면은 이미 backend examId 기준으로 `/exams/{examId}`에서 questionIds를 가져오도록 연결되어 있다.

## Changes
- `src/app/(main)/exam/page.tsx`
  - 9급/경찰/소방/전산직 등 기존 mock 카테고리 선택 UI 제거.
  - `GET /exams` 기반 PSAT 모의고사 목록 UI로 교체.
  - `READY` 상태 모의고사만 `응시하기` 버튼 활성화.
  - `GENERATING`, `FAILED` 상태는 목록에 표시하되 응시는 비활성화.
  - API 미설정/조회 실패/빈 목록 상태를 화면에 명시.

## Verification
- `npx tsc --noEmit`: 통과
- `npx eslint 'src/app/(main)/exam/page.tsx'`: 통과
- `npm run wiki:lint`: issues=0 (`wiki/lint/2026-06-01T13-06-44.md`)
- build는 사용자 지시에 따라 실행하지 않음.

## Next
- 백엔드 `GET /exams`가 실제 사용자별 목록인지, 전체 목록인지 확인 필요.
- 응시 결과 저장은 아직 Swagger에 없으므로 `/exam-attempts` 계열 API 확정 후 결과 화면 mock answer 제거 필요.
