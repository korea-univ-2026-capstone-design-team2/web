<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:wiki-workflow-rules -->
# Wiki Workflow (Obsidian)

Use `wiki/` as the persistent project memory.

## Session start
- Read `wiki/index.md`, `wiki/overview.md`, and recent entries in `wiki/log.md`.
- Check current open decisions in `wiki/decisions/`.

## During work
- Add/refresh source summaries in `wiki/sources/` when new references appear.
- Record important design/implementation choices in `wiki/decisions/`.
- Save non-trivial Q&A in `wiki/queries/`.

## Session end
- Create/update a note in `wiki/sessions/` for major work.
- Update `wiki/index.md` links for new pages.
- Append log in `wiki/log.md` (or use `npm run wiki:*` commands).
- Run `npm run wiki:lint` and leave the report in `wiki/lint/`.

## Guardrails
- Raw sources in `wiki/raw/` are immutable source of truth.
- Compiled wiki pages are derived; do not treat them as absolute truth.
- Final claims should be re-grounded to raw sources.
- Do not edit `wiki/insights/` unless the user explicitly asks.
<!-- END:wiki-workflow-rules -->
