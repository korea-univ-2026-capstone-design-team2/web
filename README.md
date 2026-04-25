# oh-my-study (sancap)

공무원 시험 준비를 위한 학습 웹 서비스입니다.  
문제 풀이, 취약점 분석, 추천 문제, 대시보드, 마이페이지 흐름을 Next.js App Router 기반으로 구성합니다.

## 1) 프로젝트 개요

- 목적: 수험생의 학습 루틴을 한 곳에서 관리
- 핵심 화면:
  - 랜딩
  - 인증(`로그인`, `회원가입`)
  - 메인(`대시보드`, `시험`, `추천`, `취약점 분석`, `마이페이지`)
- 디자인: shadcn/ui + Tailwind CSS v4 + 토큰 기반 테마(light/dark)

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
- `src/data/mock/*`: 목업 데이터
- `src/types/*`: 공용 타입

### 문서/지식 계층 (로컬 운영)

- `wiki/`: 프로젝트 메모리(의사결정, 세션 기록, 소스 요약), 기본 `.gitignore` 제외
- `scripts/wiki/wiki.mjs`: wiki ingest/query/lint/session CLI

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

## 5) 실행 방법

```bash
npm install
npm run dev
```

- 기본 주소: `http://localhost:3000`

## 6) 스크립트

```bash
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run start       # 프로덕션 실행
npm run lint        # ESLint

npm run wiki:ingest # wiki 소스 반영
npm run wiki:query  # wiki 질의
npm run wiki:session# wiki 세션 기록
npm run wiki:lint   # wiki 무결성 검사
```

## 7) 개발 규칙(요약)

- 스타일은 전역 토큰(`src/app/globals.css`) 우선
- 중심 색상 버튼 텍스트는 `white` 유지
- 페이지/컴포넌트 하드코딩 색상은 최소화하고 토큰 기반 사용
- 주요 결정사항/작업 기록은 로컬 `wiki/`에 관리(기본 git 제외)

## 8) 배포/운영 메모

- 이 저장소는 GitHub 원격 기준으로 운영
- 환경변수는 `.env*`로 로컬 관리하고 커밋하지 않음
