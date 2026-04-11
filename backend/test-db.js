const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await prisma.$connect();
    console.log('Successfully connected!');
    const admins = await prisma.admin.findMany({ take: 1 });
    console.log('Query successful, found admins:', admins.length);
  } catch (err) {
    console.error('Connection failed:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
