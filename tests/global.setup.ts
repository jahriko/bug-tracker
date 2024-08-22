import path from 'node:path';
import { type FullConfig } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } },
});

async function globalSetup(config: FullConfig) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl?.includes('localhost')) {
    throw new Error('Tests should only be run against a local database');
  }

  await seedTestData();
}

async function seedTestData() {
  const testUserEmail = 'playwright_test@example.com';
  const existingUser = await prisma.user.findUnique({
    where: { email: testUserEmail },
  });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: testUserEmail,
        name: 'Test User',
        hashedPassword: await hash('testpassword123', 10),
      },
    });
  }
}

export default globalSetup;
