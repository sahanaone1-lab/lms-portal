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
  console.log('🌱 Starting database-wide Capstone Project seeding...');

  // 1. Fetch all courses
  const courses = await prisma.course.findMany();
  console.log(`Found ${courses.length} courses to seed Capstone Projects for.`);

  for (const course of courses) {
    console.log(`Processing course: "${course.title}" (Domain: ${course.domain || 'N/A'})`);

    // Ensure a Capstone module exists in this course
    let capstoneModule = await prisma.module.findFirst({
      where: {
        courseId: course.id,
        title: { contains: 'Capstone', mode: 'insensitive' },
      },
    });

    if (!capstoneModule) {
      console.log(`  -> Creating Capstone module for "${course.title}"...`);
      capstoneModule = await prisma.module.create({
        data: {
          title: 'Final Capstone Project Module',
          description: 'Apply all course skills in a final, industry-level Capstone project of your choice.',
          order: 10,
          courseId: course.id,
        },
      });
    }

    // Ensure 5 Capstone Projects exist
    const count = await prisma.capstoneProject.count({
      where: { courseId: course.id },
    });

    if (count >= 5) {
      console.log(`  -> Already has ${count} Capstone projects. Skipping.`);
      continue;
    }

    // Determine domain-specific projects
    const domain = (course.domain || '').toLowerCase();
    let projectsList = [];

    if (domain.includes('data') || domain.includes('analytic') || domain.includes('science') || domain.includes('market') || domain.includes('digital')) {
      projectsList = [
        {
          title: 'Predictive Sales Forecasting Model',
          problemStatement: 'Retailers struggle with stock management due to dynamic demand factors. Develop a historical time-series model to forecast sales metrics.',
          objectives: '1. Perform EDA on retail dataset.\n2. Clean outliers and missing values.\n3. Train ARIMA or Prophet forecasting models.\n4. Evaluate MAE, RMSE performance metrics.',
          requiredTech: 'Python, Pandas, Scikit-Learn, Prophet, Jupyter Notebooks',
          deliverables: '1. Python codebase.\n2. Forecast output reports.\n3. Comprehensive analysis PDF.',
          instructions: 'Submit a PDF report detailing your data cleansing steps, model parameters, and forecast charts.',
        },
        {
          title: 'Financial Risk Management Dashboard',
          problemStatement: 'Finance professionals need real-time data visualizations to evaluate portfolio volatility and market asset changes.',
          objectives: '1. Ingest stock price market data.\n2. Build interactive trend charts.\n3. Calculate Value-at-Risk metrics.\n4. Design risk classification dashboards.',
          requiredTech: 'Python, Flask, PostgreSQL, React, Tailwind CSS, Recharts',
          deliverables: '1. Dashboard web application.\n2. Source code repository.\n3. User guide documentation.',
          instructions: 'Upload a PDF summary with screenshots of the dashboard displaying risk indexes and calculation methodology.',
        },
        {
          title: 'Customer Segmentation Analysis',
          problemStatement: 'Marketing teams waste spend targeting generic campaigns without user behavior cluster separation.',
          objectives: '1. Parse behavior data.\n2. Perform K-Means clustering analysis.\n3. Determine optimal clusters with elbow method.\n4. Visualize segments in 3D plots.',
          requiredTech: 'Python, Pandas, Seaborn, Scikit-Learn, Plotly',
          deliverables: '1. Segment visualization workbook.\n2. Customer group classification profile report.',
          instructions: 'Upload an analytics report detailing customer personas per segment and matching recommendations.',
        },
        {
          title: 'Supply Chain Optimization Analytics',
          problemStatement: 'Inventory logistics suffer from routing inefficiencies and high distribution costs.',
          objectives: '1. Parse freight supply schedules.\n2. Design cost optimization algorithms.\n3. Implement shortest-path delivery maps.\n4. Visualize shipping logs on geography heatmaps.',
          requiredTech: 'Python, Folium, NetworkX, SciPy, PostgreSQL',
          deliverables: '1. Network routing workbook.\n2. Cost-benefit analysis documentation PDF.',
          instructions: 'Submit analysis results demonstrating logistical routes before and after algorithmic optimization.',
        },
        {
          title: 'Social Media Sentiment Analyzer',
          problemStatement: 'Brands struggle to track PR feedback trends in real-time across public networks.',
          objectives: '1. Stream raw text data.\n2. Apply NLP sentiment classification.\n3. Calculate polarity and subjectivity indexes.\n4. Visualize aggregate sentiment changes.',
          requiredTech: 'Python, TextBlob, NLTK, React, D3.js, FastAPI',
          deliverables: '1. Analyzer API repository.\n2. Real-time chart visualization dashboard.',
          instructions: 'Upload project work as PDF containing sentiment charts and documentation on accuracy tests.',
        },
      ];
    } else if (domain.includes('security') || domain.includes('cyber')) {
      projectsList = [
        {
          title: 'Enterprise Vulnerability Scanner & Auditor',
          problemStatement: 'Unmonitored systems are vulnerable to exploits. Create a centralized dashboard that audits network infrastructure vulnerability indices.',
          objectives: '1. Build network scanning routines.\n2. Integrate CVE databases.\n3. Design vulnerability severity reports.\n4. Automate alert notifications.',
          requiredTech: 'Python, Nmap, PostgreSQL, React, Tailwind CSS, FastAPI',
          deliverables: '1. Network auditor codebase.\n2. Scan report PDF examples.\n3. Deployment docs.',
          instructions: 'Submit a PDF detailing vulnerability severity metrics and installation setups.',
        },
        {
          title: 'Secure Zero-Trust Identity Gateway',
          problemStatement: 'Static passwords fail to secure enterprise endpoints from identity theft.',
          objectives: '1. Implement OAuth2 and Multi-Factor Auth.\n2. Build role-based security filters.\n3. Integrate hardware key standards (WebAuthn).\n4. Track user session audit trails.',
          requiredTech: 'NestJS, React, PostgreSQL, WebAuthn, JWT, Redis',
          deliverables: '1. Working authentication portal codebase.\n2. Cryptographic token security report.',
          instructions: 'Upload a project report with configuration instructions and zero-trust protocol audits.',
        },
        {
          title: 'Intrusion Detection System (IDS) Engine',
          problemStatement: 'Firewalls cannot scan raw packet contents for advanced persistent threats in real-time.',
          objectives: '1. Capture live packet logs.\n2. Analyze traffic indicators for malicious patterns.\n3. Trigger automated IP blocking rules.\n4. Display incident log maps.',
          requiredTech: 'Python, Scapy, SQLite, React, Socket.io',
          deliverables: '1. IDS system code.\n2. Threat evaluation metrics documentation.',
          instructions: 'Submit matching logs demonstrating detections before and after simulating attack payload vectors.',
        },
        {
          title: 'Encrypted Storage vault (HIPAA Compliant)',
          problemStatement: 'Unsecured patient databases leak confidential health details during storage drive theft.',
          objectives: '1. Implement AES-256 field encryption.\n2. Build cryptographically signed logs.\n3. Design secure key storage mechanics.\n4. Prevent cross-tenant data leaks.',
          requiredTech: 'Next.js, Node.js, PostgreSQL, Crypto-JS, Docker',
          deliverables: '1. Secure vault codebase.\n2. Security assessment documentation.',
          instructions: 'Include key rotation policy guidelines in your final documentation report.',
        },
        {
          title: 'Automated Penetration Testing Workspace',
          problemStatement: 'Manual auditing cannot keep pace with dynamic web platform release schedules.',
          objectives: '1. Scan web endpoints for SQL injection vulnerabilities.\n2. Verify cross-site scripting weaknesses.\n3. Generate security benchmark logs.\n4. Export compliance audits.',
          requiredTech: 'Python, OWASP ZAP API, PostgreSQL, React',
          deliverables: '1. Testing suite repository.\n2. Sample target scan audit PDF.',
          instructions: 'Submit optimization suggestions for securing detected endpoints in your final report.',
        },
      ];
    } else {
      // Default to general full stack / tech projects
      projectsList = [
        {
          title: 'E-Commerce Microservices Platform',
          problemStatement: 'Modern retail systems need to be highly scalable, fault-tolerant, and dynamic. Building a monolithic e-commerce application is no longer viable for high traffic.',
          objectives: '1. Build decentralized Auth using JWT.\n2. Implement a Catalog Service with search filters.\n3. Create an Order processing service with Stripe integration.\n4. Manage transactional emails with RabbitMQ/Kafka.',
          requiredTech: 'NestJS, React, PostgreSQL, Redis, RabbitMQ, Tailwind CSS, Docker',
          deliverables: '1. GitHub Repository URL with clear code structure.\n2. System architecture block diagram.\n3. Postman API collection link.\n4. Brief summary video/presentation.',
          instructions: 'Submit a PDF report detailing your system design, database schemas, and links to your deployment (Vercel/Render). Include screenshots of working services.',
        },
        {
          title: 'Real-time Collaborative Project Workspace',
          problemStatement: 'Distributed teams lack real-time collaborative workspace tools with fluid document updates and live whiteboards without noticeable lag.',
          objectives: '1. Establish real-time sync with WebSockets.\n2. Build a rich-text document editor.\n3. Integrate an interactive canvas whiteboard.\n4. Design task boards with drag-and-drop mechanics.',
          requiredTech: 'TypeScript, Node.js, Socket.io, React, MongoDB, Express',
          deliverables: '1. Fully working workspace URL.\n2. Verified codebase.\n3. API Swagger documentation.\n4. Test coverage reports (>80%).',
          instructions: 'Upload your architectural design document as PDF along with user role credentials for test evaluation.',
        },
        {
          title: 'Cloud-Native Serverless CI/CD Pipeline Dashboard',
          problemStatement: 'Many developers face steep learning curves configuring CI/CD pipelines. Create a visual workspace that connects to GitHub and automates static code analysis, unit testing, and serverless deployment.',
          objectives: '1. Implement GitHub OAuth integration.\n2. Create serverless triggers for build pipelines.\n3. Build static security scanning checks.\n4. Design an interactive analytics chart dashboard.',
          requiredTech: 'AWS Lambda, DynamoDB, API Gateway, React, Recharts, GitHub API',
          deliverables: '1. CI/CD dashboard live URL.\n2. Infrastructure-as-code scripts (Terraform/CloudFormation).\n3. Operational guide PDF.',
          instructions: 'Include step-by-step installation instructions and deploy the app frontend using S3 and CloudFront.',
        },
        {
          title: 'Healthcare EHR & Patient Portal System',
          problemStatement: 'Medical record management is often fragmented. Build a secure, HIPAA-compliant patient management platform where doctors can log diagnoses, issue prescriptions, and patients can schedule consultations.',
          objectives: '1. Implement field-level encryption for health records.\n2. Create appointment booking with automated email reminders.\n3. Build prescription logging with PDF exports.\n4. Implement doctor-patient chat channel.',
          requiredTech: 'Next.js, Node.js, PostgreSQL, Crypto-JS, SendGrid, Material-UI',
          deliverables: '1. HIPAA security documentation report.\n2. Complete application code.\n3. DB migrations and schema details.',
          instructions: 'Ensure field encryption functions are clearly annotated in the codebase. Upload patient audit logs as evidence.',
        },
        {
          title: 'AI-Powered Resume Optimizer & Job Matcher',
          problemStatement: 'Job seekers struggle to align resumes with complex job descriptions. Build a platform that matches resumes with descriptions and suggests key improvements.',
          objectives: '1. Extract text from uploaded PDF/DOCX resume files.\n2. Parse job descriptions and match keyword density.\n3. Generate optimization tips using OpenAI API.\n4. Match user resumes with mock active jobs.',
          requiredTech: 'Python, Flask, NestJS, React, OpenAI API, AWS S3, PDF-Parse',
          deliverables: '1. Job matching algorithm evaluation document.\n2. React frontend application.\n3. Swagger/OpenAPI documentation.',
          instructions: 'Submit matching results as PDF showing the resume analysis before and after OpenAI processing suggestions.',
        },
      ];
    }

    console.log(`  -> Seeding ${projectsList.length} Capstone projects...`);
    const projectsData = projectsList.slice(0, 5 - count);
    for (const proj of projectsData) {
      await prisma.capstoneProject.create({
        data: {
          ...proj,
          courseId: course.id,
        },
      });
    }
  }

  console.log('✅ Capstone Projects seeded for all courses successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding Capstone projects:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
