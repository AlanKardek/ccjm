import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL ?? "") });

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "leitora@montello.app" } });
  console.log(user ? 'FOUND' : 'NOT FOUND');
  if (user) console.log(user);
  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
