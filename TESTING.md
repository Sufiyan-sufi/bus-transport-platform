# Testing Guide - Bus Transport Platform

## Overview

This project has two types of tests:
1. **Unit Tests** - Test individual functions and services (Vitest)
2. **E2E Tests** - Test complete user flows in the browser (Playwright)

## Prerequisites

### 1. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Database (required for both unit and E2E tests)
DATABASE_URL="postgresql://user:password@host:6543/postgres"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# NextAuth (required)
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Test accounts (required for E2E tests)
TEST_EMPLOYEE_EMAIL="employee@test.com"
TEST_EMPLOYEE_PASSWORD="password123"

# Optional
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
RESEND_API_KEY="re_your_key"
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed test data (if you have a seed script)
npx prisma db seed
```

### 3. Install Dependencies

```bash
npm install
```

## Running Unit Tests

Unit tests use **Vitest** and test individual services and validators.

### Run all unit tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npx vitest
```

### Run tests with coverage:
```bash
npx vitest --coverage
```

### Current unit tests:
- `src/test/route.service.test.ts` - Route search logic with seat availability
- `src/test/pricing.service.test.ts` - Pricing service operations
- `src/test/validators.test.ts` - Form validation schemas

**Note:** Vitest is configured to exclude the `e2e/` directory, so Playwright tests won't interfere with unit tests.

## Running E2E Tests

E2E tests use **Playwright** and test complete user flows in a real browser.

### First-time setup:

Install Playwright browsers:
```bash
node node_modules/@playwright/test/cli.js install
```

Or add this as an npm script for convenience.

### Prerequisites for E2E:

1. **Create a test employee account** in your database:
   ```sql
   -- Use the credentials from TEST_EMPLOYEE_EMAIL and TEST_EMPLOYEE_PASSWORD
   -- Password should be hashed with bcrypt
   ```

2. **Seed test data** - You need at least:
   - One contractor account
   - One route with multiple stops
   - Pricing configured for the route

### Run E2E tests:

**Step 1:** Start the development server in one terminal:
```bash
npm run dev
```

**Step 2:** In another terminal, run Playwright tests:
```bash
npm run test:e2e
```

### Run E2E tests in UI mode (recommended for debugging):
```bash
npx playwright test --ui
```

### Run E2E tests in headed mode (see the browser):
```bash
npx playwright test --headed
```

### Current E2E tests:
- `e2e/happy-path.spec.ts` - Complete booking flow:
  1. Employee login
  2. Search for routes
  3. View route details
  4. Book a route
  5. Confirm booking success

## Test Structure

### Unit Tests (`src/test/`)
```
src/test/
├── setup.ts                    # Test setup (imports @testing-library/jest-dom)
├── route.service.test.ts       # Route search logic tests
├── pricing.service.test.ts     # Pricing service tests
└── validators.test.ts          # Zod schema validation tests
```

### E2E Tests (`e2e/`)
```
e2e/
└── happy-path.spec.ts          # End-to-end booking flow
```

## Creating Test Data

### Manual Database Seeding

You can create test data manually or via Prisma Studio:

```bash
npx prisma studio
```

### Required test data for E2E:

1. **Employee User:**
   - Email: `employee@test.com` (or your TEST_EMPLOYEE_EMAIL)
   - Password: hashed version of `password123`
   - Role: `EMPLOYEE`

2. **Contractor with Route:**
   - Contractor profile
   - At least one bus
   - One route with 3+ stops
   - Pricing matrix configured between stops

### Example: Create test employee via API

```bash
curl -X POST http://localhost:3000/api/auth/signup/employee \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@test.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Unit Tests

**Issue:** Tests fail with module resolution errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Prisma client not found
```bash
npx prisma generate
```

### E2E Tests

**Issue:** "Timeout waiting for page"
- Ensure dev server is running on `http://localhost:3000`
- Check if the test employee account exists
- Verify database has test data (routes, stops, pricing)

**Issue:** "Element not found"
- Run in headed mode to see what's happening: `npx playwright test --headed`
- Check if the UI components match the test selectors
- Ensure test data exists in the database

**Issue:** Login fails
- Verify TEST_EMPLOYEE_EMAIL and TEST_EMPLOYEE_PASSWORD in `.env`
- Check if the user exists in the database
- Ensure password is correctly hashed

**Issue:** No routes found during search
- Verify routes exist in database with status `ACTIVE`
- Check that stops are properly ordered (orderIndex)
- Ensure pricing is configured between stops

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

## Writing New Tests

### Adding Unit Tests

Create a new file in `src/test/`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Adding E2E Tests

Create a new file in `e2e/`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should perform action', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/bus/i);
  });
});
```

## Test Coverage

Current test coverage:
- ✅ Route search logic
- ✅ Pricing service
- ✅ Form validators
- ✅ Complete booking flow (E2E)

Areas needing tests:
- Authentication flows
- Contractor dashboard features
- Bus management
- Booking status updates
- Payment instructions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
