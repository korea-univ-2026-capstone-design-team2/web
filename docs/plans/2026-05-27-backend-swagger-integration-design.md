# Backend Swagger Integration Design

## Context
- The project is a Next.js 16 App Router application, not Vite.
- Browser-side backend configuration should use `NEXT_PUBLIC_API_BASE_URL`, which is compatible with `.env.local` and Vercel project environment variables.
- Existing question session/result screens already call question paper/review services with mock fallback.

## Approach
- Add a shared API client that reads `NEXT_PUBLIC_API_BASE_URL`, builds query strings, sends JSON requests, and accepts both direct DTO responses and `{ data }` wrappers.
- Extend Swagger-aligned DTO types without removing the normalized question paper/review shapes currently used by UI code.
- Add service methods for exams, question generation, and token usages while preserving legacy mock-backed methods.
- Update exam session/result screens to resolve question IDs from `/exams/{examId}` when the backend is configured, then load paper/review DTOs per question.

## Trade-offs
- Keeping mock fallback avoids blocking local UI development when the backend is unavailable, but can hide integration failures unless logs/tests are checked.
- The Swagger lacks a batch question paper/review endpoint, so the UI must call N endpoints for an exam until the backend adds a batch endpoint.
- `NEXT_PUBLIC_API_BASE_URL` is build-time inlined for client code, so Vercel environment variables must be set before build/deploy.

## Verification
- TypeScript compile and ESLint for changed files.
- Wiki lint after source/session/query/decision updates.
