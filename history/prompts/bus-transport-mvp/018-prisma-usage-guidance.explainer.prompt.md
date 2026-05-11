---
id: 018
title: Prisma Usage Guidance
stage: explainer
feature: bus-transport-mvp
branch: 001-bus-transport-mvp
date: 2026-05-11
surface: agent
model: gemini-2.0-flash
user: user
command: how can i run the prisma server
labels: ["prisma", "database", "documentation"]
links:
  spec: "specs/001-bus-transport-mvp/spec.md"
---

## Prompt

how can i run the prisma server

## Response snapshot

Explained that Prisma is an ORM, not a standalone server. Provided instructions for running Prisma Studio (GUI), syncing the schema with `prisma db push`, and generating the client.

## Outcome

- ✅ Impact: Clarified Prisma's role in the architecture and provided actionable commands for database management.
- 🧪 Tests: n/a
- 📁 Files: none
- 🔁 Next prompts: Waiting for user instructions.
- 🧠 Reflection: Users often mistake ORM tools for the underlying database server. Providing the distinction between the DB (Supabase/PostgreSQL) and the tool (Prisma) is crucial for mental model alignment.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
