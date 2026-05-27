# Light surface white polish

## Date
- 2026-05-27

## Context
- 사용자 요청:
  - AI 추천 문제, 마이페이지, 실제 문제 화면의 회색/녹회색 배경을 white 중심으로 정리
  - 문제 선지(보기) 배경도 white로 통일
  - 추가로 대시보드, 시험 응시, 취약점 분석 페이지에도 bg white 적용

## Changes
- white surface 통일
  - `src/app/(main)/recommend/page.tsx`
  - `src/app/(main)/mypage/page.tsx`
  - `src/app/(main)/dashboard/page.tsx`
  - `src/app/(main)/analytics/page.tsx`
  - `src/app/(main)/exam/page.tsx`
  - `src/app/(main)/exam/[examId]/session/page.tsx`
  - 카드/패널/칩/요약 박스의 `bg-linear-bg-*`, `bg-white/2`, `bg-white/70` 등 회색 계열 배경을 `bg-white + border-border` 중심으로 정리
- 선지(보기) 배경 정리
  - `src/components/exam/AnswerOption.tsx`
  - 풀이 모드 비선택 선지와 결과 모드 기본 선지 배경을 `bg-white`로 통일
- 부가 정리
  - `src/components/layout/Sidebar.tsx` 포함 레이아웃 관련 작업분과 함께 변경 상태 유지

## Verification
- `npx eslint 'src/app/(main)/recommend/page.tsx' 'src/app/(main)/mypage/page.tsx' 'src/app/(main)/exam/[examId]/session/page.tsx'` 통과
- `npx eslint src/components/exam/AnswerOption.tsx` 통과
- `npx eslint 'src/app/(main)/dashboard/page.tsx' 'src/app/(main)/exam/page.tsx' 'src/app/(main)/analytics/page.tsx'` 통과

## Next
- 라이트 모드 기준에서 페이지 간 surface 톤 통일은 완료. 이후 필요 시 다크 모드 대비(hover/disabled/outline)만 별도 점검.
