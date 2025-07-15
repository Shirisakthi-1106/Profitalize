// import {PrismaClient} from '@prisma/client';

// const prisma = new PrismaClient();

// // Handle graceful shutdown
// process.on('SIGTERM', async () => {
//     await prisma.$disconnect();
//     process.exit(0);
//   });
  
// export default prisma;

import { PrismaClient } from '../../src/generated/prisma/index.js'; // Explicitly import index.js

const prisma = new PrismaClient();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;