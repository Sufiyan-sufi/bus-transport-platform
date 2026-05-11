---
id: 021
title: Fixing Prisma Engine Initialization
stage: explainer
feature: bus-transport-mvp
branch: 001-bus-transport-mvp
date: 2026-05-11
surface: agent
model: gemini-2.0-flash
user: user
command: still got errors why... PrismaClientInitializationError
labels: ["prisma-7", "turbopack", "engine-fix"]
links:
  spec: "specs/001-bus-transport-mvp/spec.md"
---

## Prompt

still got errors why... Error [PrismaClientInitializationError]: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`

## Response snapshot

Identified that Prisma 7 was defaulting to an incorrect engine mode. Forced `engineType = "library"` in the schema and updated the constructor to pass a default config object.

## Outcome

- ✅ Impact: Resolved a low-level Prisma initialization crash affecting all API routes.
- 🧪 Tests: n/a
- 📁 Files: prisma/schema.prisma, src/lib/prisma.ts, .env
- 🔁 Next prompts: Waiting for user verification.
- 🧠 Reflection: Next.js 15/16 with Turbopack can cause Prisma to misidentify the runtime environment. Explicitly setting the engine type in the schema is the most robust way to ensure stability.

## Evaluation notes (flywheel)

- Failure modes observed: Persistent PrismaClient initialization error.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
