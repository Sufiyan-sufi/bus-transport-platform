---
id: 023
title: Final Turbopack Prisma Resolution
stage: explainer
feature: bus-transport-mvp
branch: 001-bus-transport-mvp
date: 2026-05-11
surface: agent
model: gemini-2.0-flash
user: user
command: still got errors... Using engine type "client"
labels: ["prisma-7", "turbopack", "singleton", "binary-engine"]
links:
  spec: "specs/001-bus-transport-mvp/spec.md"
---

## Prompt

still got errors why what are you doing ... ⨯ Error [PrismaClientConstructorValidationError]: Using engine type "client" requires either "adapter" or "accelerateUrl"

## Response snapshot

Implemented the official Next.js Prisma singleton pattern and switched the engine type to 'binary' to resolve a deep conflict with Next.js Turbopack.

## Outcome

- ✅ Impact: Provided a robust architectural fix for Prisma initialization in a Next.js 15+ Turbopack environment.
- 🧪 Tests: n/a
- 📁 Files: src/lib/prisma.ts, prisma/schema.prisma, .env
- 🔁 Next prompts: Waiting for user to confirm successful server start.
- 🧠 Reflection: Turbopack's module evaluation can trigger Prisma's environment detection incorrectly. Using the binary engine and a explicit singleton pattern is the most reliable workaround.

## Evaluation notes (flywheel)

- Failure modes observed: Persistent environment misidentification by Prisma/Turbopack.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
