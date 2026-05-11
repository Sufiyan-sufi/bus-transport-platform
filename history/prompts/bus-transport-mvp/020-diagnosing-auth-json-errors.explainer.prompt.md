---
id: 020
title: Diagnosing Auth JSON Errors
stage: explainer
feature: bus-transport-mvp
branch: 001-bus-transport-mvp
date: 2026-05-11
surface: agent
model: gemini-2.0-flash
user: user
command: found two errors... Unexpected token '<'
labels: ["auth", "nextjs-15", "bug-fix"]
links:
  spec: "specs/001-bus-transport-mvp/spec.md"
---

## Prompt

found two errors number #1 is ... Unexpected token '<', "<!DOCTYPE "... is not valid JSON ... number #2 is [next-auth][error][CLIENT_FETCH_ERROR]

## Response snapshot

Diagnosed the "Unexpected token <" as an HTML-instead-of-JSON error. Refactored the catch-all auth route and temporarily disabled the Prisma adapter to isolate the cause. Created a test API route for verification.

## Outcome

- ✅ Impact: Isolated potential causes for the NextAuth fetch error and provided a diagnostic path.
- 🧪 Tests: n/a
- 📁 Files: src/app/api/test/route.ts, src/lib/auth.ts, src/app/api/auth/[...nextauth]/route.ts
- 🔁 Next prompts: Waiting for user feedback on the diagnostic test route.
- 🧠 Reflection: NextAuth v4 in App Router can be sensitive to how handlers are exported, especially in newer Next.js versions. Database initialization errors are a common cause of API route crashes that return HTML error overlays.

## Evaluation notes (flywheel)

- Failure modes observed: JSON parsing error on auth fetch.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Ensure runtime is specified if Edge is accidentally used.
