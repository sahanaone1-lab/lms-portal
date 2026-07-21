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
  console.log('--- DB SUBMISSIONS REPORT ---');

  // 1. Capstone Submissions
  const capstoneSubs = await prisma.capstoneSubmission.findMany({
    include: {
      student: true,
      project: {
        include: {
          course: true
        }
      }
    }
  });

  console.log(`Total Capstone Submissions: ${capstoneSubs.length}`);
  capstoneSubs.forEach((sub, idx) => {
    console.log(`\nSubmission ${idx + 1}:`);
    console.log(`  ID: ${sub.id}`);
    console.log(`  Status: ${sub.status}`);
    console.log(`  File: ${sub.fileName} (${sub.fileUrl})`);
    console.log(`  Student ID: ${sub.studentId}`);
    console.log(`  Student Name: ${sub.student?.name} (Email: ${sub.student?.email}, Domain: ${sub.student?.domain})`);
    console.log(`  Project ID: ${sub.projectId}`);
    console.log(`  Project Title: ${sub.project?.title}`);
    console.log(`  Course ID: ${sub.project?.courseId}`);
    console.log(`  Course Title: ${sub.project?.course?.title}`);
    console.log(`  Course Domain: ${sub.project?.course?.domain}`);
  });

  // 2. Project Submissions (our new model)
  const projSubs = await prisma.projectSubmission.findMany({
    include: {
      student: true,
      projectCoordinator: true
    }
  });

  console.log(`\nTotal Project Submissions: ${projSubs.length}`);
  projSubs.forEach((sub, idx) => {
    console.log(`\nProject Submission ${idx + 1}:`);
    console.log(`  ID: ${sub.id}`);
    console.log(`  Title: ${sub.title}`);
    console.log(`  Status: ${sub.status}`);
    console.log(`  File: ${sub.fileName} (${sub.fileUrl})`);
    console.log(`  Student Name: ${sub.studentName} (Email: ${sub.studentEmail}, Domain: ${sub.domain})`);
    console.log(`  Coordinator Name: ${sub.projectCoordinator?.name}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
