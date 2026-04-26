## 1) 프로젝트 개요

- 목적: 수험생의 학습 루틴을 한 곳에서 관리
- 핵심 화면:
  - 랜딩
  - 인증(`로그인`, `회원가입`)
  - 메인(`대시보드`, `시험`, `추천`, `취약점 분석`, `마이페이지`)

## 2) 기술 스택

- Framework: `Next.js 16` (App Router)
- Runtime: `React 19`
- Language: `TypeScript`
- Styling: `Tailwind CSS v4`, `shadcn/ui`, `tw-animate-css`
- Form/Validation: `react-hook-form`, `zod`
- State: `zustand`
- Chart: `recharts`

## 3) 아키텍처

### 라우팅 계층

- `src/app/page.tsx`: 랜딩
- `src/app/(auth)/*`: 인증 영역
- `src/app/(main)/*`: 서비스 메인 영역
- `src/app/layout.tsx`: 루트 레이아웃 + 전역 테마/스타일

### UI 계층

- `src/components/ui/*`: shadcn 기반 공용 UI primitive
- `src/components/layout/*`: 헤더/사이드바/푸터/메인 레이아웃
- `src/components/common/*`: 도메인 공용 위젯
- `src/components/analytics/*`, `src/components/exam/*`: 도메인 전용 컴포넌트

### 도메인/상태 계층

- `src/lib/services/*`: 서비스 로직(인증, 문제, 시험, 분석)
- `src/lib/store/*`: zustand 상태 스토어
- `src/data/mock/*`: 목업 데이터 -> 대체 예정
- `src/types/*`: 공용 타입

## 4) 디렉터리 구조

```text
src/
  app/
    (auth)/
    (main)/
    globals.css
    layout.tsx
    page.tsx
  components/
    ui/
    layout/
    common/
    analytics/
    exam/
    theme/
  data/mock/
  lib/
    services/
    store/
    utils/
  types/
scripts/
  wiki/wiki.mjs
wiki/  # local-only (git ignored)
```
