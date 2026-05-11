# Quickstart: Bus Transport MVP

## Development Environment
1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Set up environment variables in `.env`:
    ```text
    DATABASE_URL="postgresql://user:password@localhost:5432/bus_db"
    NEXTAUTH_SECRET="your-secret"
    ```
4.  Run Prisma migrations: `npx prisma migrate dev`.
5.  Start dev server: `npm run dev`.

## Local Testing
- Run unit tests: `npm run test`.
- Run linting: `npm run lint`.

## Key User Journeys
1.  **Contractor**: Sign up -> Create Route -> Add Stops -> Set Pricing -> Wait for bookings.
2.  **Employee**: Sign up -> Search for Route -> View Details -> Book -> Follow payment instructions.
3.  **Contractor Dashboard**: View "Pending" booking -> Verify payment manually -> Mark as "Confirmed".
