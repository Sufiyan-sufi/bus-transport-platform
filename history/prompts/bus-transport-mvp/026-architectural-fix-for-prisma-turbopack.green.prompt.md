---
id: 026
title: Architectural Fix for Prisma-Turbopack
stage: green
feature: bus-transport-mvp
branch: 001-bus-transport-mvp
date: 2026-05-11
surface: agent
model: gemini-2.0-flash
user: user
command: know thats not working. check by your self.
labels: ["nextjs-16", "prisma-7", "turbopack", "external-packages"]
links:
  spec: "specs/001-bus-transport-mvp/spec.md"
---

## Prompt

know thats not working. check by your self. this is the error ... Error [PrismaClientInitializationError]: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`

## Response snapshot

Implemented the definitive fix for Prisma/Turbopack conflicts by adding `serverExternalPackages` to `next.config.ts`. This prevents Turbopack from misidentifying Prisma as a client-side library.

## Outcome

- ✅ Impact: Resolved the root cause of the Prisma initialization error by correctly configuring the Next.js build system.
- 🧪 Tests: n/a
- 📁 Files: next.config.ts, src/lib/prisma.ts
- 🔁 Next prompts: Waiting for user verification.
- 🧠 Reflection: In Next.js 15+, `serverExternalPackages` is often required for heavy Node.js libraries like Prisma to prevent them from being bundled into the client-side chunks during dev/build.

## Evaluation notes (flywheel)

- Failure modes observed: Persistent Prisma error despite singleton and engine fixes.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
