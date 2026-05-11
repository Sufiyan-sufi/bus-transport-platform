# Implementation Plan: Bus Transport MVP

**Branch**: `001-bus-transport-mvp` | **Date**: 2026-05-06 | **Spec**: [specs/001-bus-transport-mvp/spec.md]
**Input**: Feature specification for UAE employee commute booking.

## Summary

Build a Phase 1 MVP for a bus transport platform connecting contractors with employees in the UAE. The project will use Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL, and Prisma. The architecture will follow Clean Architecture principles to ensure modularity and extensibility for future mobile applications.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**: Next.js 14/15, Tailwind CSS, shadcn/ui, Prisma, Lucide React, Zod, NextAuth.js
**Storage**: PostgreSQL (hosted on Supabase or Railway)
**Testing**: Vitest (Unit/Integration), Playwright (E2E)
**Target Platform**: Web (Responsive)
**Project Type**: Web Application
**Performance Goals**: < 1.5s search results, < 2s TTI
**Constraints**: UAE-focused (Dubai, Sharjah, Abu Dhabi), Mobile-ready responsive UI
**Scale/Scope**: MVP (10-50 contractors, 1000+ employees)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Clean & Modular Architecture**: Planning separate `services` and `repositories` layer using Prisma.
- [x] **Component-Driven UI**: Using shadcn/ui (Radix UI) for atomic, accessible components.
- [x] **Security-First**: Mandatory authentication via NextAuth, RBAC for contractors vs employees, Zod validation.
- [x] **Test-Driven Development**: Planning for Vitest and Playwright.
- [x] **Scalability & Extensibility**: Prisma migrations for schema evolution, environment-based config.
- [x] **Mobile-Ready**: Mobile-first Tailwind strategy.

## Project Structure

### Documentation (this feature)

```text
specs/001-bus-transport-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/                 # Next.js App Router (Pages, Layouts)
├── components/          # UI Components (shadcn/ui + custom)
│   ├── ui/              # Base UI primitives
│   ├── shared/          # Reusable domain components
│   └── features/        # Feature-specific components (booking, dashboard)
├── hooks/               # Custom React hooks
├── lib/                 # Shared utilities (Prisma client, cn helper)
├── services/            # Business logic (BookingService, RouteService)
├── repositories/        # Data access layer (Prisma wrappers)
├── types/               # TypeScript definitions
└── validators/          # Zod schemas
```

**Structure Decision**: Single Next.js project with a clear service/repository separation to satisfy the "Clean Architecture" principle from the constitution.

## Complexity Tracking

> No violations detected.
