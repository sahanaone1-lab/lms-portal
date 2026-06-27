import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const interns = await prisma.user.findMany({
    where: { role: Role.INTERN },
    select: { id: true, name: true, email: true, domain: true, dob: true },
  });
  console.log('Interns details:');
  console.log(JSON.stringify(interns, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
