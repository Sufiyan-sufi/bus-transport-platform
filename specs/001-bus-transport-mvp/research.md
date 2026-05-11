# Research: Bus Transport MVP

## Decision 1: Authentication & RBAC
**Decision**: Use NextAuth.js with Credentials Provider (initially) and Middleware for Role-Based Access Control (RBAC).
**Rationale**: Industry standard for Next.js. Supports roles (ADMIN, CONTRACTOR, EMPLOYEE) out of the box. Middleware ensures secure route protection.
**Alternatives considered**: Clerk (Too expensive for high user count), Custom JWT (Unnecessary complexity).

## Decision 2: Database & ORM
**Decision**: PostgreSQL with Prisma ORM.
**Rationale**: Prisma provides type-safety, easy migrations, and great developer experience. PostgreSQL handles relational data (Routes -> Stops -> Pricing) efficiently.
**Alternatives considered**: MongoDB (Poor fit for complex relational pricing models), Drizzle (Valid alternative, but Prisma has more mature ecosystem for complex relations).

## Decision 3: UI Component System
**Decision**: shadcn/ui (Tailwind + Radix UI).
**Rationale**: High-quality, accessible components that are copied into the project, allowing full customization (Library-First principle).
**Alternatives considered**: Material UI (Heavy, harder to customize), Headless UI (Requires more boilerplate than shadcn).

## Decision 4: Stop-to-Stop Pricing Logic
**Decision**: Adjacency list for stops on a route + a `Pricing` table mapping `(fromStopId, toStopId)`.
**Rationale**: Allows contractors to specify price for any segment. Validation logic in `RouteService` will ensure stops exist in the correct order.
**Alternatives considered**: Flat rate (Too simple), Distance-based (Too complex for MVP manually entered data).

## Decision 5: Deployment Strategy
**Decision**: Vercel for Frontend/API, Supabase for Managed PostgreSQL.
**Rationale**: Zero-config deployment for Next.js. Supabase provides a robust PostgreSQL instance with easy connection pooling.
**Alternatives considered**: Self-hosting (Too much overhead), AWS (Overkill for MVP).
