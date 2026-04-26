---
description: "Use when asked to read imp.md, evaluate project progress, and write what is next. Compare roadmap phases against real repository state and return prioritized next actions with blockers."
name: "imp.md Progress And Next Steps"
---
# imp.md Progress And Next Steps

When the user asks to analyze imp.md and say what is next:

1. Read imp.md fully.
2. Audit the repository for implementation evidence, not assumptions:
- existing routes and pages
- auth backend wiring and auth UI behavior
- Prisma schema and migration files
- environment configuration
- installed dependencies used by the roadmap
3. Map findings to imp.md phases:
- Completed
- In progress
- Not started
- Blocked
4. Return a concise "What is next" plan:
- top 3 to 7 tasks in execution order
- each task includes why it matters and a concrete acceptance check
- call out blockers first (for example database availability)
5. If requested, create or update a short tracker file in the repo with phase status and immediate next steps.

Rules:
- Do not claim a phase is complete without file-level evidence.
- Prefer actionable steps over high-level advice.
- Mention missing critical files explicitly when relevant (for example missing auth route handlers).
- Keep output short and practical.
