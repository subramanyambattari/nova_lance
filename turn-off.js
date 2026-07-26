const { PrismaClient } = require('./app/generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
  await prisma.platformSettings.update({
    where: { id: 1 },
    data: { maintenanceMode: false }
  });
  console.log("Maintenance mode disabled");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
