import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const assignments = await prisma.assignment.findMany({
    where: { weekId: 'bef6815d-74da-475c-b548-b473783c9df2' }
  });
  const lessons = await prisma.lesson.findMany({
    where: { weekId: 'bef6815d-74da-475c-b548-b473783c9df2' }
  });
  const quizzes = await prisma.quiz.findMany({
    where: { weekId: 'bef6815d-74da-475c-b548-b473783c9df2' }
  });

  console.log(`Assignments for week 10: ${assignments.length}`);
  console.log(`Lessons for week 10: ${lessons.length}`);
  console.log(`Quizzes for week 10: ${quizzes.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
