# 🚀 How to Run the Bus Transport Platform

## Prerequisites

Before you start, make sure you have:
- ✅ Node.js (v18 or higher)
- ✅ PostgreSQL database (or Supabase account)
- ✅ Git installed

---

## Step-by-Step Setup Guide

### Step 1: Clone the Repository (if not already done)

```bash
git clone https://github.com/Sufiyan-sufi/bus-transport-platform.git
cd bus-transport-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, React, etc.

### Step 3: Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` file with your actual values:

```env
# Database (PostgreSQL via Supabase or any provider)
DATABASE_URL="postgresql://user:password@host:6543/postgres"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# NextAuth (required for authentication)
NEXTAUTH_SECRET="your-secret-key-min-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (optional, for storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key

# Resend (email - optional for now)
RESEND_API_KEY="re_your_resend_api_key"

# Test accounts (for E2E tests)
TEST_EMPLOYEE_EMAIL="employee@test.com"
TEST_EMPLOYEE_PASSWORD="password123"
```

**Important:** 
- `NEXTAUTH_SECRET` must be at least 32 characters
- Generate one with: `openssl rand -base64 32`

### Step 4: Set Up the Database

Generate Prisma client:
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma migrate dev
```

This will create all necessary tables in your database.

### Step 5: Seed Test Data (Optional but Recommended)

You can seed test data using the provided script:

```bash
node seed-test-data.js
```

Or manually using Prisma Studio:
```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` where you can:
- Create contractor accounts
- Add routes with stops
- Configure pricing
- Create employee accounts

### Step 6: Start the Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

You should see:
```
✓ Ready on http://localhost:3000
```

### Step 7: Access the Application

Open your browser and go to: **http://localhost:3000**

---

## 🎯 What You Can Do Now

### 1. Create Accounts

#### Create Employee Account
- Go to: http://localhost:3000/auth/signup/employee
- Fill in email and password
- Click "Sign Up"

#### Create Contractor Account
- Go to: http://localhost:3000/auth/signup/contractor
- Fill in company details
- Click "Sign Up"

### 2. Login

- Go to: http://localhost:3000/login
- Use your credentials
- You'll be redirected to the dashboard

### 3. As a Contractor

After logging in as a contractor:

1. **Add a Bus** (optional)
   - Go to Dashboard → Fleet
   - Add bus details (type, capacity, plate number)

2. **Create a Route**
   - Go to Dashboard → Routes → New Route
   - Enter route name and capacity
   - Add stops (at least 2):
     - Stop name
     - Location (optional)
     - Stops are ordered automatically
   - Click "Create Route"

3. **Set Pricing**
   - After creating a route, click "Set Pricing"
   - Enter prices for each stop combination
   - Save pricing

4. **View Bookings**
   - Go to Dashboard → Bookings
   - See all booking requests
   - Approve or reject bookings

### 4. As an Employee

After logging in as an employee:

1. **Search for Routes**
   - On the home page, scroll to "Find Your Route"
   - Select "From" stop
   - Select "To" stop
   - Click "Search"

2. **View Route Details**
   - Click "Book Now" on any route
   - See route details, stops, and pricing

3. **Book a Route**
   - Click "Proceed to Booking"
   - Select start date
   - Click "Confirm Booking"
   - Wait for contractor approval

4. **View Your Bookings**
   - Go to Dashboard
   - See all your bookings and their status

---

## 📁 Project Structure

```
project/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Home page
│   │   ├── login/             # Login page
│   │   ├── auth/signup/       # Signup pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── routes/            # Route pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── features/          # Feature-specific components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # UI components
│   ├── lib/                   # Utilities
│   ├── services/              # Business logic
│   └── validators/            # Zod schemas
├── prisma/
│   └── schema.prisma          # Database schema
├── e2e/                       # E2E tests
├── public/                    # Static files
└── Documentation files
```

---

## 🔍 Verify Everything is Working

### 1. Check Database Connection
```bash
npx prisma studio
```
Should open at http://localhost:5555

### 2. Check API Endpoints
```bash
# Get all stops
curl http://localhost:3000/api/stops

# Should return JSON array of stops
```

### 3. Run Tests
```bash
# Unit tests
npm test

# E2E tests (in separate terminal)
npm run test:e2e
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
- Check DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Test connection: `npx prisma db pull`

### Issue: "NEXTAUTH_SECRET is not set"
**Solution:**
- Add to `.env`: `NEXTAUTH_SECRET="your-32-char-secret"`
- Generate: `openssl rand -base64 32`

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Issue: "Port 3000 is already in use"
**Solution:**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
PORT=3001 npm run dev
```

### Issue: "No routes found" when searching
**Solution:**
- Ensure you have created routes with stops
- Check route status is "ACTIVE"
- Verify contractor subscription is not "INACTIVE"
- Check pricing is configured

### Issue: Login fails
**Solution:**
- Check user exists in database (Prisma Studio)
- Verify password is correct
- Check NEXTAUTH_SECRET is set
- Clear browser cookies

---

## 🎨 Available Pages

| URL | Description | Access |
|-----|-------------|--------|
| `/` | Home page with route search | Public |
| `/login` | Login page | Public |
| `/auth/signup/employee` | Employee signup | Public |
| `/auth/signup/contractor` | Contractor signup | Public |
| `/dashboard` | User dashboard | Authenticated |
| `/dashboard/routes` | Contractor routes | Contractor only |
| `/dashboard/routes/new` | Create new route | Contractor only |
| `/dashboard/fleet` | Bus management | Contractor only |
| `/routes/[id]` | Route details | Public |
| `/routes/[id]/book` | Booking page | Employee only |

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes

# Testing
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # E2E with UI

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
```

---

## 📊 Default Test Data

If you ran `seed-test-data.js`, you have:

**Employee Account:**
- Email: employee@test.com
- Password: password123

**Contractor Account:**
- Email: contractor@test.com
- Password: password123
- Company: Test Transport Co

**Test Route:**
- Name: Downtown Express
- Stops: Downtown Station → Midtown Plaza → Uptown Mall → Airport Terminal
- Pricing: $5 per stop distance

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database URL and secrets

# 3. Set up database
npx prisma generate
npx prisma migrate dev

# 4. Seed test data (optional)
node seed-test-data.js

# 5. Start the server
npm run dev

# 6. Open browser
# Go to http://localhost:3000
```

---

## 📚 Additional Resources

- **Testing Guide:** See `TESTING.md`
- **Quick Test Guide:** See `QUICK-TEST-GUIDE.md`
- **API Documentation:** Check `src/app/api/` folders
- **Database Schema:** See `prisma/schema.prisma`

---

## 🎉 You're Ready!

Your Bus Transport Platform should now be running at:
**http://localhost:3000**

Try creating an account and exploring the features!

**Need help?** Check the troubleshooting section above or review the documentation files.
