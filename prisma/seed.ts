import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.job.createMany({
    data: [
      {
        id: 'JOB-001',
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        propertyAddress: '123 Main Street',
        damageType: 'WATER',
        damageDescription: 'Water damage affecting the kitchen ceiling and wall.',
        squareFeet: 450,
        status: 'NEW',
        estimatedCost: 0,
      },
      {
        id: 'JOB-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        propertyAddress: '456 Oak Avenue',
        damageType: 'FIRE',
        damageDescription: 'Smoke and fire damage in living room.',
        squareFeet: 800,
        status: 'INSPECTION',
        estimatedCost: 0,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });