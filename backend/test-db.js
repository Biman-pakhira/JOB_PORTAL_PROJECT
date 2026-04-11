const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Attempting to connect to database...");
    const userCount = await prisma.user.count();
    console.log(`Connection successful! User count: ${userCount}`);
    
    const jobCount = await prisma.job.count();
    console.log(`Job count: ${jobCount}`);
    
  } catch (err) {
    console.error("Database connection failed:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
