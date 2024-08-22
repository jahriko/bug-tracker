import { FullConfig } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function globalTeardown(config: FullConfig) {
  // Instead of truncating, remove only the test data we added
  await prisma.user.deleteMany({
    where: {
      email: 'playwright_test@example.com'
    }
  });

  // Disconnect Prisma
  await prisma.$disconnect();
}

export default globalTeardown;