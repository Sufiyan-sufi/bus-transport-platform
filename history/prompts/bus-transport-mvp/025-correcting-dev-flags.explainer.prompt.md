---
id: 025
title: Correcting Dev Flags
stage: explainer
feature: bus-transport-mvp
branch: 001-bus-transport-mvp
date: 2026-05-11
surface: agent
model: gemini-2.0-flash
user: user
command: npx next dev --turbo=false ... error: unknown option
labels: ["nextjs", "cli", "turbopack"]
links:
  spec: "specs/001-bus-transport-mvp/spec.md"
---

## Prompt

PS D:\Qoderx\Bus Transport Platform\project> npx next dev --turbo=false
error: unknown option '--turbo=false'

## Response snapshot

Corrected the Next.js CLI flag to `--no-turbo` and suggested retrying the standard `npm run dev` after the deep clean.

## Outcome

- ✅ Impact: Provided the correct syntax for disabling Turbopack to unblock the user.
- 🧪 Tests: n/a
- 📁 Files: none
- 🔁 Next prompts: Waiting for user to confirm if `--no-turbo` or the cleaned `npm run dev` works.
- 🧠 Reflection: Next.js CLI options vary significantly between minor versions in the experimental/v15+ range. `--no-turbo` is the standard opt-out.

## Evaluation notes (flywheel)

- Failure modes observed: Incorrect CLI flag provided for the specific Next.js version.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
