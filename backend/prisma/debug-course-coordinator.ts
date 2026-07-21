import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const course = await prisma.course.findUnique({
    where: { id: 'ee74c4be-9f18-45d4-b42f-af2299cc4e32' },
    include: { projectCoordinator: true }
  });
  console.log('COURSE COORDINATOR:');
  console.log(JSON.stringify(course?.projectCoordinator, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
