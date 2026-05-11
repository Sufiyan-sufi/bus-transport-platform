# Tasks: Bus Transport MVP

**Input**: Design documents from `/specs/001-bus-transport-mvp/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md

## Phase 1: Foundation & Setup

**Purpose**: Core infrastructure and database initialization.

- [X] T001 Initialize Prisma with PostgreSQL schema (`prisma/schema.prisma`) per data-model.md
- [X] T002 [P] Configure NextAuth.js with Credentials Provider and RBAC roles in `src/lib/auth.ts`
- [X] T003 Setup global error handling and base API response wrappers in `src/lib/api-utils.ts`
- [X] T004 [P] Install and configure shadcn/ui base components (Button, Input, Form, Card)
- [X] T005 [P] Create Zod schemas for User, Route, and Booking validation in `src/validators/`

---

## Phase 2: User Story 4 - Contractor Onboarding (Priority: P2)

**Goal**: Allow bus service providers to create accounts.

- [X] T006 [P] [US4] Create Contractor signup page in `src/app/auth/signup/contractor/page.tsx`
- [X] T007 [US4] Implement `AuthService.registerContractor` in `src/services/auth.service.ts`
- [X] T008 [US4] Create `ContractorRepository.create` in `src/repositories/contractor.repository.ts`
- [X] T009 [US4] Verify contractor account creation and redirect to empty dashboard

---

## Phase 3: User Story 2 - Route & Pricing Management (Priority: P1)

**Goal**: Contractors create routes, stops, and pricing.

- [X] T010 [US2] Implement Route creation form in `src/app/dashboard/routes/new/page.tsx`
- [X] T011 [US2] Create `RouteService.createRouteWithStops` in `src/services/route.service.ts` (Atomic transaction)
- [X] T012 [US2] Implement stop reordering logic and UI in `src/components/features/routes/StopManager.tsx`
- [X] T013 [US2] Implement stop-to-stop pricing matrix UI and service in `src/services/pricing.service.ts`
- [X] T014 [US2] Add validation to ensure stops are ordered correctly and prices are valid decimals

---

## Phase 4: User Story 1 - Employee Search & Booking (Priority: P1) 🎯 MVP

**Goal**: Employees search for routes and book seats.

- [X] T015 [US1] Build landing page search UI with stop autocomplete in `src/app/page.tsx`
- [X] T016 [US1] Implement `RouteService.searchRoutes` (filtering by stop pairs and capacity)
- [X] T017 [US1] Create Bus Detail page in `src/app/routes/[id]/page.tsx` showing stops and schedules
- [X] T018 [US1] Implement Booking submission form in `src/app/routes/[id]/book/page.tsx`
- [X] T019 [US1] Implement `BookingService.createBooking` with "Max Capacity" validation (FR-011)

---

## Phase 5: User Story 3 - Contractor Dashboard (Priority: P2)

**Goal**: Contractors manage bookings and confirm payments.

- [X] T020 [US3] Build Contractor Dashboard overview in `src/app/dashboard/page.tsx`
- [X] T021 [US3] Create Booking list component with status filters in `src/components/features/dashboard/BookingList.tsx`
- [X] T022 [US3] Implement `BookingService.updateStatus` (Confirm/Cancel)
- [X] T023 [US3] Display platform payment instructions to employees in `src/app/bookings/[id]/confirmation/page.tsx`

---

## Phase 6: Polish & Testing

**Purpose**: Cross-cutting concerns and verification.

- [X] T024 [P] Implement responsive navigation and mobile sidebar in `src/components/shared/Navbar.tsx`
- [X] T025 Write unit tests for `RouteService` search and pricing logic using Vitest
- [ ] T026 Write E2E test for the "Happy Path" (Search -> Book -> Confirm) using Playwright
- [ ] T027 Setup environment variables for production and verify build command (`npm run build`)

---

## Dependencies

- **Phase 1** blocks everything.
- **Phase 2 & 3** can run in parallel (Contractor setup).
- **Phase 4** depends on Phase 3 (Need routes to search).
- **Phase 5** depends on Phase 4 (Need bookings to manage).
- **Phase 6** runs after core features are functional.
