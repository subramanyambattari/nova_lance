import { prisma } from './lib/prisma';
async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "username" TEXT UNIQUE;');
    console.log('Successfully added username column');
  } catch (e) {
    console.error('Failed:', e);
  }
}
main();
