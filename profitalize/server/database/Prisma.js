import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  
export default prisma;