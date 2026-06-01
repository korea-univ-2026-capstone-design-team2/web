# Backend API Gap Request

## Context
Frontend is integrated with the PSAT Swagger endpoints for exam generation and question paper/review reads. The following endpoints are still needed for local UI features that are not covered by the current Swagger snapshot.

## Not Required For Current User UI

### Token usage screen
- Current Swagger includes token usage APIs for AI cost/usage tracking.
- This is an admin/operations feature, not required for the learner-facing UI now.
- Keep backend APIs if useful internally, but frontend does not need a screen unless an admin dashboard is planned.

### Backend-based exam list UI
- Current `/exam` page is an exam setup/category selection screen, not an exam history/list page.
- Swagger `GET /exams` can power a future screen such as "generated mock exams" or "my exam history".
- Not required for the current start-exam flow, because `POST /exams` returns an `examId` and the session loads by `GET /exams/{examId}`.

## Required Missing APIs

### 1. Auth

#### POST /auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

Response:
```json
{
  "accessToken": "jwt-or-session-token",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "targetExam": "PSAT_5_GRADE",
    "targetScore": 85,
    "avatarUrl": null,
    "createdAt": "2026-06-01T12:00:00Z"
  }
}
```

#### POST /auth/signup
Request:
```json
{
  "email": "user@example.com",
  "password": "string",
  "name": "홍길동",
  "targetExam": "PSAT_5_GRADE",
  "targetScore": 85
}
```

Response: same shape as login.

#### GET /auth/me
Response:
```json
{
  "userId": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "targetExam": "PSAT_5_GRADE",
  "targetScore": 85,
  "avatarUrl": null,
  "createdAt": "2026-06-01T12:00:00Z"
}
```

### 2. My Page Settings

#### PATCH /users/me/profile
Request:
```json
{
  "name": "홍길동",
  "targetExam": "PSAT_5_GRADE",
  "targetScore": 90,
  "avatarUrl": null
}
```

Response:
```json
{
  "userId": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "targetExam": "PSAT_5_GRADE",
  "targetScore": 90,
  "avatarUrl": null,
  "updatedAt": "2026-06-01T12:00:00Z"
}
```

### 3. Recommendations

#### GET /recommendations/questions
Query:
```text
?limit=10&subject=VERBAL_LOGIC
```

Response:
```json
{
  "items": [
    {
      "questionId": 101,
      "reason": "최근 언어논리 추론 유형 정답률이 낮아 우선 추천합니다.",
      "priority": 1,
      "subjectName": "언어논리",
      "unitName": "추론",
      "difficulty": "MEDIUM",
      "estimatedMinutes": 3
    }
  ],
  "totalCount": 1
}
```

Notes:
- `questionId` should be loadable through existing `GET /questions/{questionId}/paper` and `GET /questions/{questionId}/review`.

### 4. Bookmarks

Bookmark means the learner saves a question for later review.

#### GET /bookmarks/questions
Response:
```json
{
  "items": [
    {
      "bookmarkId": 1,
      "questionId": 101,
      "createdAt": "2026-06-01T12:00:00Z"
    }
  ],
  "totalCount": 1
}
```

#### PUT /bookmarks/questions/{questionId}
Response:
```json
{
  "questionId": 101,
  "bookmarked": true
}
```

#### DELETE /bookmarks/questions/{questionId}
Response:
```json
{
  "questionId": 101,
  "bookmarked": false
}
```

### 5. Analytics / Dashboard

#### GET /analytics/summary
Query:
```text
?from=2026-05-01&to=2026-06-01
```

Response:
```json
{
  "totalQuestions": 240,
  "totalCorrect": 168,
  "overallAccuracy": 0.7,
  "streakDays": 8,
  "totalStudyMinutes": 620,
  "todayQuestions": 20,
  "todayAccuracy": 0.75,
  "subjectAccuracies": [
    {
      "subject": "VERBAL_LOGIC",
      "subjectName": "언어논리",
      "accuracy": 0.72
    }
  ]
}
```

#### GET /analytics/daily-records
Response:
```json
{
  "items": [
    {
      "date": "2026-06-01",
      "questionCount": 20,
      "correctCount": 15,
      "studyMinutes": 45,
      "accuracy": 0.75
    }
  ]
}
```

#### GET /analytics/weaknesses
Response:
```json
{
  "items": [
    {
      "subject": "VERBAL_LOGIC",
      "subjectName": "언어논리",
      "unitId": "inference",
      "unitName": "추론",
      "accuracy": 0.42,
      "attemptCount": 31,
      "rank": 1,
      "aiRecommendation": "조건 추론 문제를 우선 복습하세요."
    }
  ]
}
```

### 6. CBT Attempt Submit / Result Save

#### POST /exam-attempts
Use this when a user starts an exam session.

Request:
```json
{
  "examId": 123,
  "startedAt": "2026-06-01T12:00:00Z"
}
```

Response:
```json
{
  "attemptId": 987,
  "examId": 123,
  "status": "IN_PROGRESS",
  "startedAt": "2026-06-01T12:00:00Z"
}
```

#### PATCH /exam-attempts/{attemptId}/answers
Use this for autosave or final answer save.

Request:
```json
{
  "answers": [
    {
      "questionId": 101,
      "questionItemId": 1001,
      "selectedNumber": 3,
      "timeSpentSeconds": 82,
      "markedUnknown": false,
      "bookmarked": true
    }
  ]
}
```

Response:
```json
{
  "attemptId": 987,
  "savedCount": 1,
  "updatedAt": "2026-06-01T12:05:00Z"
}
```

#### POST /exam-attempts/{attemptId}/submit
Request:
```json
{
  "submittedAt": "2026-06-01T12:45:00Z",
  "answers": [
    {
      "questionId": 101,
      "questionItemId": 1001,
      "selectedNumber": 3,
      "timeSpentSeconds": 82,
      "markedUnknown": false,
      "bookmarked": true
    }
  ]
}
```

Response:
```json
{
  "attemptId": 987,
  "examId": 123,
  "status": "SUBMITTED",
  "totalCount": 20,
  "correctCount": 15,
  "score": 75,
  "accuracy": 0.75,
  "timeSpentSeconds": 2700,
  "submittedAt": "2026-06-01T12:45:00Z",
  "items": [
    {
      "questionId": 101,
      "questionItemId": 1001,
      "selectedNumber": 3,
      "correctNumber": 3,
      "correct": true,
      "timeSpentSeconds": 82
    }
  ]
}
```

#### GET /exam-attempts/{attemptId}/result
Response: same shape as submit response.

### 7. Optional: Batch Question Reads

Current Swagger only supports per-question reads. This is workable but inefficient for 20+ question exams.

#### POST /questions/papers:batch
Request:
```json
{
  "questionIds": [101, 102, 103]
}
```

Response:
```json
{
  "items": []
}
```

#### POST /questions/reviews:batch
Request:
```json
{
  "questionIds": [101, 102, 103]
}
```

Response:
```json
{
  "items": []
}
```
