# E2E Test Setup Instructions

## Current Issue
The E2E test is failing at login because:
1. Dev server might not be running
2. Test employee account doesn't exist in the database

## Step-by-Step Setup

### 1. Start the Dev Server (Terminal 1)
```bash
npm run dev
```
Wait until you see: `✓ Ready on http://localhost:3000`

### 2. Create Test Employee Account

**Option A: Via API (Recommended)**
```bash
curl -X POST http://localhost:3000/api/auth/signup/employee \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"employee@test.com\",\"password\":\"password123\"}"
```

**Option B: Via Prisma Studio**
```bash
npx prisma studio
```
Then manually create a User with:
- email: `employee@test.com`
- passwordHash: (bcrypt hash of `password123`)
- role: `EMPLOYEE`

### 3. Create Test Data

Open Prisma Studio:
```bash
npx prisma studio
```

Create the following:

**A. Contractor Profile:**
- companyName: "Test Transport Co"
- phone: "1234567890"
- subscriptionStatus: `ACTIVE` (not INACTIVE)

**B. Route:**
- name: "Test Route"
- contractorId: (link to contractor above)
- capacity: 50
- status: `ACTIVE`

**C. Stops (at least 3):**
- Stop 1: name="Downtown", orderIndex=0
- Stop 2: name="Midtown", orderIndex=1
- Stop 3: name="Uptown", orderIndex=2

**D. Pricing (between stops):**
- From Downtown to Midtown: amount=10.00
- From Downtown to Uptown: amount=15.00
- From Midtown to Uptown: amount=8.00

### 4. Run E2E Tests (Terminal 2)
```bash
npm run test:e2e
```

Or with visible browser:
```bash
npm run test:e2e:headed
```

---

## Quick Verification

Before running tests, verify:

```bash
# 1. Dev server is running
curl http://localhost:3000

# 2. Test employee exists
# Open Prisma Studio and check Users table
npx prisma studio

# 3. Routes exist
# Check Routes table has at least 1 ACTIVE route
```

---

## Troubleshooting

### Login Timeout Error
- **Cause:** Test employee doesn't exist or wrong credentials
- **Fix:** Create employee account with exact credentials:
  - Email: `employee@test.com`
  - Password: `password123`

### No Routes Found
- **Cause:** No test data in database
- **Fix:** Create contractor, route, stops, and pricing via Prisma Studio

### Dev Server Not Running
- **Cause:** Forgot to start dev server
- **Fix:** Run `npm run dev` in separate terminal

---

## Alternative: Seed Script

You can create a seed script to automate test data creation:

**prisma/seed.ts:**
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create test employee
  const passwordHash = await bcrypt.hash('password123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@test.com' },
    update: {},
    create: {
      email: 'employee@test.com',
      passwordHash,
      role: 'EMPLOYEE',
    },
  });

  console.log('✅ Test employee created:', employee.email);

  // Add contractor, routes, stops, pricing here...
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Then run:
```bash
npx tsx prisma/seed.ts
```

---

**Next:** Start dev server and create test employee account
