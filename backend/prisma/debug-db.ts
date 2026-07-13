import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- DATABASE DIAGNOSTIC REPORT ---');
  
  // 1. Courses
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        orderBy: { order: 'asc' }
      },
      capstoneProjects: true
    }
  });

  console.log(`Total Courses: ${courses.length}`);
  
  for (const c of courses) {
    console.log(`\nCourse: "${c.title}" (ID: ${c.id})`);
    console.log(`Domain: ${c.domain}`);
    console.log(`Modules Count: ${c.modules.length}`);
    c.modules.forEach(m => {
      console.log(`  - Module: "${m.title}" (ID: ${m.id}, Order: ${m.order})`);
    });
    console.log(`Capstone Projects Count: ${c.capstoneProjects.length}`);
    c.capstoneProjects.forEach((p, idx) => {
      console.log(`  - Project ${idx + 1}: "${p.title}" (ID: ${p.id})`);
    });
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
