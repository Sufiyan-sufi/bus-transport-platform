---
id: 022
title: PowerShell Command Correction
stage: explainer
feature: bus-transport-mvp
branch: 001-bus-transport-mvp
date: 2026-05-11
surface: agent
model: gemini-2.0-flash
user: user
command: rd /s /q .next ... Remove-Item: A positional parameter cannot be found that accepts argument '/q'
labels: ["powershell", "cli", "fix"]
links:
  spec: "specs/001-bus-transport-mvp/spec.md"
---

## Prompt

PS D:\Qoderx\Bus Transport Platform\project> rd /s /q .next
Remove-Item: A positional parameter cannot be found that accepts argument '/q'.

## Response snapshot

Corrected the user's CMD-style command to the appropriate PowerShell `Remove-Item` syntax for clearing the Next.js cache.

## Outcome

- ✅ Impact: Enabled the user to successfully clear their build cache and proceed with the clean restart.
- 🧪 Tests: n/a
- 📁 Files: none
- 🔁 Next prompts: Waiting for user to confirm the server starts correctly after cache clear.
- 🧠 Reflection: Users often mix CMD and PowerShell syntax. Being specific about the terminal environment is important for troubleshooting.

## Evaluation notes (flywheel)

- Failure modes observed: Syntax error due to environment mismatch.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
