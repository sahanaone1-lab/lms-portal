import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const domains = await prisma.domain.findMany();
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, domain: true, weeks: true }
  });
  console.log('DOMAINS:');
  console.log(JSON.stringify(domains, null, 2));
  console.log('COURSES:');
  console.log(JSON.stringify(courses, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
