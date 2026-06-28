import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Domains
  const domainsToCreate = [
    { name: 'Full Stack', description: 'Web development with frontend and backend technologies' },
    { name: 'Data Science', description: 'Data analysis, statistics, and visualization' },
    { name: 'Machine Learning', description: 'Predictive modeling, deep learning, and deployment' },
    { name: 'Cyber Security', description: 'Network security, ethical hacking, and forensics' },
    { name: 'Digital Marketing', description: 'SEO, SEM, social media, and analytics' },
    { name: 'Generative AI', description: 'Large Language Models, prompting, and RAG frameworks' },
  ];

  console.log('Creating domains...');
  for (const dom of domainsToCreate) {
    await prisma.domain.upsert({
      where: { name: dom.name },
      update: {},
      create: dom,
    });
  }
  console.log('✅ Domains created.');

  // 2. Create Users
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  const passwordHashCoordinator = await bcrypt.hash('1985-06-15', 10);
  const passwordHashIntern = await bcrypt.hash('intern123', 10);

  console.log('Creating default users...');
  
  // Create Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'System Admin',
      role: Role.ADMIN,
      password: passwordHashAdmin,
      username: 'admin',
      employeeId: 'ADM-001',
      isApproved: true,
      mustChangePassword: false,
    },
  });

  // Create Coordinator
  const coordinatorUser = await prisma.user.upsert({
    where: { email: 'coordinator@company.com' },
    update: {},
    create: {
      email: 'coordinator@company.com',
      name: 'Jane Doe',
      role: Role.PROJECT_COORDINATOR,
      password: passwordHashCoordinator,
      username: 'coordinator',
      employeeId: 'EMP-001',
      domain: 'Full Stack',
      isApproved: true,
      mustChangePassword: false,
    },
  });

  // Create Intern
  await prisma.user.upsert({
    where: { email: 'intern@company.com' },
    update: {},
    create: {
      email: 'intern@company.com',
      name: 'John Smith',
      role: Role.INTERN,
      password: passwordHashIntern,
      username: 'intern',
      employeeId: 'INT-101',
      domain: 'Full Stack',
      isApproved: true,
      mustChangePassword: false,
    },
  });

  console.log('✅ Default users created.');

  // 3. Create Base Courses
  console.log('Creating base courses for updates...');
  
  const coursesToCreate = [
    {
      title: 'Machine Learning Training Program',
      description: 'Master Machine Learning from concepts to deployment.',
      domain: 'Machine Learning',
      projectCoordinatorId: coordinatorUser.id,
      status: 'Draft',
    },
    {
      title: 'Digital Marketing Professional Training Program',
      description: 'Master Digital Marketing campaigns and SEO.',
      domain: 'Digital Marketing',
      projectCoordinatorId: coordinatorUser.id,
      status: 'Draft',
    },
    {
      title: 'Cyber Security Training Program',
      description: 'Master network security and penetration testing.',
      domain: 'Cyber Security',
      projectCoordinatorId: coordinatorUser.id,
      status: 'Draft',
    },
    {
      title: 'Generative AI Training Program',
      description: 'Master large language models and RAG frameworks.',
      domain: 'Generative AI',
      projectCoordinatorId: coordinatorUser.id,
      status: 'Draft',
    },
    {
      title: 'Full Stack Development Program',
      description: 'Master modern frontend and backend development.',
      domain: 'Full Stack',
      projectCoordinatorId: coordinatorUser.id,
      status: 'Draft',
    },
  ];

  for (const c of coursesToCreate) {
    const existing = await prisma.course.findFirst({
      where: { domain: c.domain },
    });
    if (!existing) {
      await prisma.course.create({ data: c });
    }
  }

  console.log('✅ Base courses created.');
  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
