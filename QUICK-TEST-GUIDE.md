# Quick Test Guide

## ✅ Setup Complete

- ✅ Unit tests: Ready to run
- ✅ Playwright browsers: Installed
- ✅ Test scripts: Added to package.json

---

## Run Tests Now

### Unit Tests
```bash
npm test
```
**Status:** ✅ All 8 tests passing

### E2E Tests (Requires Setup)
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:e2e
```

### E2E Debug Mode
```bash
npm run test:e2e:ui        # Interactive UI
npm run test:e2e:headed    # See browser
```

---

## Before Running E2E Tests

### 1. Check Environment Variables
```bash
# .env file must have:
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
TEST_EMPLOYEE_EMAIL="employee@test.com"
TEST_EMPLOYEE_PASSWORD="password123"
```

### 2. Create Test Employee
```bash
curl -X POST http://localhost:3000/api/auth/signup/employee \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@test.com","password":"password123"}'
```

### 3. Verify Test Data Exists
Open Prisma Studio and check:
```bash
npx prisma studio
```

Required data:
- ✅ Employee user (email: employee@test.com)
- ✅ At least 1 contractor with active subscription
- ✅ At least 1 route with status ACTIVE
- ✅ At least 3 stops with proper orderIndex
- ✅ Pricing configured between stops

---

## Available Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests |
| `npm run test:e2e` | Run E2E tests (headless) |
| `npm run test:e2e:ui` | Run E2E with interactive UI |
| `npm run test:e2e:headed` | Run E2E with visible browser |
| `npm run playwright:install` | Install/update Playwright browsers |
| `npx vitest` | Run unit tests in watch mode |
| `npx prisma studio` | Open database GUI |

---

## Test Files

### Unit Tests (src/test/)
- `validators.test.ts` - Form validation
- `pricing.service.test.ts` - Pricing operations
- `route.service.test.ts` - Route search logic

### E2E Tests (e2e/)
- `happy-path.spec.ts` - Complete booking flow

---

## Troubleshooting

### Unit Tests Fail
```bash
npm install
npx prisma generate
npm test
```

### E2E Tests Timeout
1. Ensure dev server is running: `npm run dev`
2. Check test employee exists in database
3. Verify routes and pricing data exist
4. Run in headed mode to see what's happening: `npm run test:e2e:headed`

### No Routes Found
```bash
# Open Prisma Studio and verify data
npx prisma studio

# Check:
# - Routes have status = ACTIVE
# - Contractor subscription is not INACTIVE
# - Stops have proper orderIndex (0, 1, 2, ...)
# - Pricing exists between stops
```

---

## Next Steps

1. ✅ Unit tests are working
2. ✅ Playwright is installed
3. ⏳ Create test employee account
4. ⏳ Seed test data (contractor, routes, stops, pricing)
5. ⏳ Run E2E tests

---

## Full Documentation

- **TEST-SUMMARY.md** - Overview and status
- **TESTING.md** - Complete testing guide
- **This file** - Quick reference

---

**Last Updated:** 2026-05-14
