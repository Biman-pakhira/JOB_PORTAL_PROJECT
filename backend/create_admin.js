const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const email = 'admin@jobportal.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword }
  });
  console.log('ADMIN_CREATED_OR_UPDATED:', admin.email);
}
main().catch(console.error).finally(() => prisma.$disconnect());
