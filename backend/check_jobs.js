const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const jobs = await prisma.job.findMany();
  console.log('JOBS_COUNT:', jobs.length);
  if (jobs.length > 0) {
    console.log('CATEGORIES:', [...new Set(jobs.map(j => j.category))]);
    console.log('FIRST_JOB_CATEGORY:', jobs[0].category);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
