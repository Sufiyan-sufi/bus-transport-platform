#!/usr/bin/env node
/**
 * Quick seed script for E2E test data
 * Run with: node seed-test-data.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...\n');

  // 1. Create test employee (if not exists)
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
  console.log('✅ Test employee:', employee.email);

  // 2. Create test contractor
  const contractorUser = await prisma.user.upsert({
    where: { email: 'contractor@test.com' },
    update: {},
    create: {
      email: 'contractor@test.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'CONTRACTOR',
    },
  });

  const contractor = await prisma.contractorProfile.upsert({
    where: { userId: contractorUser.id },
    update: { subscriptionStatus: 'ACTIVE' },
    create: {
      userId: contractorUser.id,
      companyName: 'Test Transport Co',
      phone: '1234567890',
      subscriptionStatus: 'ACTIVE',
    },
  });
  console.log('✅ Test contractor:', contractor.companyName);

  // 3. Create test route with stops
  const existingRoute = await prisma.route.findFirst({
    where: { contractorId: contractor.id },
  });

  if (existingRoute) {
    console.log('✅ Test route already exists:', existingRoute.name);
  } else {
    const route = await prisma.route.create({
      data: {
        name: 'Downtown Express',
        contractorId: contractor.id,
        capacity: 50,
        status: 'ACTIVE',
        stops: {
          create: [
            { name: 'Downtown Station', location: 'Downtown', orderIndex: 0 },
            { name: 'Midtown Plaza', location: 'Midtown', orderIndex: 1 },
            { name: 'Uptown Mall', location: 'Uptown', orderIndex: 2 },
            { name: 'Airport Terminal', location: 'Airport', orderIndex: 3 },
          ],
        },
      },
      include: { stops: true },
    });
    console.log('✅ Test route created:', route.name);
    console.log('   Stops:', route.stops.map(s => s.name).join(' → '));

    // 4. Create pricing between stops
    const stops = route.stops.sort((a, b) => a.orderIndex - b.orderIndex);
    const pricingData = [];

    for (let i = 0; i < stops.length; i++) {
      for (let j = i + 1; j < stops.length; j++) {
        const distance = j - i;
        const amount = distance * 5; // $5 per stop
        pricingData.push({
          routeId: route.id,
          fromStopId: stops[i].id,
          toStopId: stops[j].id,
          amount,
        });
      }
    }

    await prisma.pricing.createMany({ data: pricingData });
    console.log('✅ Pricing created:', pricingData.length, 'combinations');
  }

  console.log('\n✅ Test data seeding complete!');
  console.log('\nYou can now run E2E tests:');
  console.log('  npm run test:e2e');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
