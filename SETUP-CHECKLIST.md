# ✅ Quick Setup Checklist

Use this checklist to verify your Bus Transport Platform is ready to run.

## Current Status Check

Run these commands to check your setup:

### 1. Check Node.js
```bash
node --version
```
Should show: v18.x or higher ✅

### 2. Check Dependencies
```bash
npm list --depth=0 | head -20
```
Should show all packages installed ✅

### 3. Check Environment File
```bash
cat .env | grep -v "^#" | grep -v "^$"
```
Should show your environment variables ✅

### 4. Check Database Connection
```bash
npx prisma db execute --stdin <<< "SELECT 1"
```
Should connect successfully ✅

### 5. Check Prisma Client
```bash
ls node_modules/.prisma/client/index.js
```
Should exist ✅

---

## Step-by-Step Verification

### ✅ Step 1: Dependencies Installed
```bash
npm install
```
**Expected:** All packages installed without errors

### ✅ Step 2: Environment Variables Set
```bash
# Check if .env exists
ls -la .env

# Verify required variables
grep "DATABASE_URL" .env
grep "NEXTAUTH_SECRET" .env
grep "NEXTAUTH_URL" .env
```
**Expected:** All variables present

### ✅ Step 3: Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```
**Expected:** Migrations applied successfully

### ✅ Step 4: Verify Database Tables
```bash
npx prisma studio
```
**Expected:** Opens at http://localhost:5555 with all tables visible

### ✅ Step 5: Start Development Server
```bash
npm run dev
```
**Expected:** 
```
✓ Ready on http://localhost:3000
```

### ✅ Step 6: Test the Application
Open browser: http://localhost:3000

**Expected:** Home page loads with route search

---

## Quick Test Checklist

Once the server is running, test these:

### Public Pages
- [ ] Home page loads: http://localhost:3000
- [ ] Login page works: http://localhost:3000/login
- [ ] Employee signup: http://localhost:3000/auth/signup/employee
- [ ] Contractor signup: http://localhost:3000/auth/signup/contractor

### API Endpoints
```bash
# Test stops API
curl http://localhost:3000/api/stops

# Should return JSON array
```

### Create Test Account
```bash
# Create employee account
curl -X POST http://localhost:3000/api/auth/signup/employee \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return: {"success":true,"data":{"userId":"..."}}
```

### Login Test
- [ ] Go to http://localhost:3000/login
- [ ] Enter: test@example.com / password123
- [ ] Should redirect to dashboard

---

## Common Issues & Quick Fixes

### ❌ "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### ❌ "Database connection failed"
```bash
# Check your DATABASE_URL in .env
# Test connection:
npx prisma db pull
```

### ❌ "NEXTAUTH_SECRET is not set"
```bash
# Add to .env:
echo 'NEXTAUTH_SECRET="'$(openssl rand -base64 32)'"' >> .env
```

### ❌ "Port 3000 already in use"
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 npm run dev
```

### ❌ "Module not found" errors
```bash
rm -rf node_modules package-lock.json .next
npm install
npx prisma generate
npm run dev
```

---

## Your Current Setup

Based on your project, you already have:

✅ Database configured (Supabase PostgreSQL)  
✅ Test employee account created (employee@test.com)  
✅ Test data exists (dubai routes with stops)  
✅ All tests passing  
✅ Dev server was running  

---

## Next Steps

1. **If dev server is NOT running:**
   ```bash
   npm run dev
   ```

2. **Open the application:**
   - Go to: http://localhost:3000
   - Try logging in with: employee@test.com / password123

3. **Create a contractor account:**
   - Go to: http://localhost:3000/auth/signup/contractor
   - Fill in company details
   - Create routes and pricing

4. **Test the booking flow:**
   - Search for routes (dubai 1 → dubai 3)
   - Click "Book Now"
   - Complete booking

---

## Full Documentation

- **Complete Setup Guide:** `HOW-TO-RUN.md`
- **Testing Guide:** `TESTING.md`
- **Quick Reference:** `QUICK-TEST-GUIDE.md`

---

**Ready to run?** Execute: `npm run dev` and open http://localhost:3000
