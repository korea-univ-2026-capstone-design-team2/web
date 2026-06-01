# PSAT Question Generation API OpenAPI v1.0.0

## Metadata
- captured_at: 2026-05-27
- source_type: user_provided_openapi_snapshot
- license: Private
- server: http://localhost:8080

## Content
User supplied an OpenAPI 3.1.0 snapshot for the PSAT Question Generation API.

### Paths
- `GET /token-usages`
- `POST /token-usages`
- `POST /questions`
- `POST /question-generations`
- `POST /question-generations/ingest`
- `GET /exams`
- `POST /exams`
- `GET /token-usages/statistics`
- `GET /questions/{questionId}/review`
- `GET /questions/{questionId}/paper`
- `GET /questions/{questionId}/detail`
- `GET /exams/{examId}`

### Core response shape notes
- Question paper/review/detail endpoints return direct DTOs, not a `data` envelope.
- Token usage list/statistics endpoints return `Success*` DTOs with a `data` field.
- Exam list/detail/generate endpoints return direct DTOs.
- Question generation and exam generation are generation-oriented endpoints, while frontend CBT session/result rendering still needs question paper/review reads.

### Enums
- Subject: `VERBAL_LOGIC`, `DATA_INTERPRETATION`, `SITUATIONAL_JUDGMENT`
- Question type: `READING`, `LOGIC_PUZZLE`, `ARGUMENTATION`
- Question subtype: `MATCH`, `KNOWABLE`, `CONTEXT_CORRECTION`, `BLANK_FILLING`, `CORE_ARGUMENT`, `INFERENCE`, `ARGUMENT_ANALYSIS`, `STRENGTHEN_WEAKEN`
- Difficulty: `EASY`, `MEDIUM`, `HARD`
- Exam status: `GENERATING`, `READY`, `FAILED`
- Token provider: `OPENAI`, `ANTHROPIC`
