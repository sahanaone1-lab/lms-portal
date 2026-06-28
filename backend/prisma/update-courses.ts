import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const isRemote = connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');
const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Full Module Definitions ─────────────────────────────────────────────────

const mlModules = [
  { id: 'ml_m1',  number: 1,  title: 'Introduction to Machine Learning' },
  { id: 'ml_m2',  number: 2,  title: 'Python for Machine Learning' },
  { id: 'ml_m3',  number: 3,  title: 'Data Analysis using NumPy & Pandas' },
  { id: 'ml_m4',  number: 4,  title: 'Data Visualization' },
  { id: 'ml_m5',  number: 5,  title: 'Statistics & Mathematics for ML' },
  { id: 'ml_m6',  number: 6,  title: 'Supervised Learning' },
  { id: 'ml_m7',  number: 7,  title: 'Unsupervised Learning' },
  { id: 'ml_m8',  number: 8,  title: 'Model Evaluation & Feature Engineering' },
  { id: 'ml_m9',  number: 9,  title: 'Deep Learning Fundamentals' },
  { id: 'ml_m10', number: 10, title: 'Deployment & Industry Capstone Project' },
];

const mlLessons = [
  { weekId: 'ml_m1',  order: 1,  title: 'Module 1: Introduction to AI, ML & Deep Learning', content: 'Introduction to Artificial Intelligence, Machine Learning, and Deep Learning. Types of ML (Supervised, Unsupervised, Reinforcement). ML Workflow and Applications. Industry Use Cases and Project Lifecycle overview. Python Environment Setup for ML.', videoUrl: 'https://www.youtube.com/watch?v=NWONeJKn6kc' },
  { weekId: 'ml_m2',  order: 2,  title: 'Module 2: Python Fundamentals for ML', content: 'Python Variables, Data Types, Operators, Control Flow (Loops, Conditionals), Functions, File Handling, Exception Handling, and OOP Basics. Practical: Python Exercises and Mini Projects.', videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
  { weekId: 'ml_m3',  order: 3,  title: 'Module 3: Data Analysis using NumPy & Pandas', content: 'NumPy Arrays, broadcasting, and vectorized operations. Pandas DataFrames: loading, cleaning, filtering, handling missing values, transformation, aggregation, merging & joining. Practical: Data Cleaning Project and Exploratory Data Analysis (EDA).', videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
  { weekId: 'ml_m4',  order: 4,  title: 'Module 4: Data Visualization with Matplotlib & Seaborn', content: 'Matplotlib fundamentals: Line Charts, Bar Charts, Pie Charts, Histograms, Scatter Plots. Seaborn for statistical visualization: Heatmaps, Box Plots, Violin Plots. Practical: Dashboard Creation and Visualization Projects.', videoUrl: 'https://www.youtube.com/watch?v=6GUZXRef2D4' },
  { weekId: 'ml_m5',  order: 5,  title: 'Module 5: Statistics & Mathematics for Machine Learning', content: 'Descriptive Statistics: Mean, Median, Mode, Variance, Standard Deviation. Probability, Correlation, Covariance. Normal Distribution and Central Limit Theorem. Linear Algebra essentials for ML: matrices, vectors, eigenvalues. Gradient Descent intuition.', videoUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28' },
  { weekId: 'ml_m6',  order: 6,  title: 'Module 6: Supervised Learning Algorithms', content: 'Linear Regression, Multiple Regression, Polynomial Regression. Logistic Regression for classification. K-Nearest Neighbors (KNN). Decision Trees and Random Forest. Support Vector Machines (SVM) and Naive Bayes. Practical: House Price Prediction, Customer Churn Prediction, Loan Approval Prediction.', videoUrl: 'https://www.youtube.com/watch?v=pqNCD_5r0IU' },
  { weekId: 'ml_m7',  order: 7,  title: 'Module 7: Unsupervised Learning', content: 'K-Means Clustering and choosing optimal K (Elbow Method). Hierarchical Clustering and Dendrograms. DBSCAN for density-based clustering. Principal Component Analysis (PCA) for dimensionality reduction. Practical: Customer Segmentation Project and PCA Project.', videoUrl: 'https://www.youtube.com/watch?v=4b5d3muPQmA' },
  { weekId: 'ml_m8',  order: 8,  title: 'Module 8: Model Evaluation & Feature Engineering', content: 'Feature Selection and Feature Extraction techniques. Feature Scaling: StandardScaler, MinMaxScaler. Cross Validation: K-Fold, Stratified K-Fold. Hyperparameter Tuning: Grid Search CV, RandomizedSearchCV. Understanding Overfitting & Underfitting. Bias-Variance Tradeoff.', videoUrl: 'https://www.youtube.com/watch?v=Vyd9hFQJCrc' },
  { weekId: 'ml_m9',  order: 9,  title: 'Module 9: Deep Learning Fundamentals', content: 'Neural Networks and Perceptron model. Activation Functions: ReLU, Sigmoid, Softmax. Artificial Neural Networks (ANN) architecture. Introduction to TensorFlow and Keras. Forward propagation and Backpropagation. Deep Learning Applications in CV and NLP. Practical: ANN Classification Project.', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk' },
  { weekId: 'ml_m10', order: 10, title: 'Module 10: ML Model Deployment & Capstone Projects', content: 'Model serialization with pickle and joblib. Flask API for ML model serving. Building REST APIs for ML models. Documentation best practices. Resume Building for ML roles. Interview Preparation. Capstone Projects: Fraud Detection System, Employee Attrition Predictor, Movie Recommendation System, Sales Forecasting, Student Performance Prediction.', videoUrl: 'https://www.youtube.com/watch?v=IbCHE-hONow' },
];

const mlAssignments = [
  { weekId: 'ml_m3',  title: 'EDA & Data Cleaning Assignment', instruction: 'Download the Titanic dataset from Kaggle. Perform complete Exploratory Data Analysis (EDA): handle missing values, remove duplicates, perform feature encoding, and generate at least 5 meaningful visualizations. Document your findings.', daysFromNow: 14 },
  { weekId: 'ml_m6',  title: 'Supervised Learning Mini Project', instruction: 'Build a Loan Approval Prediction model using Logistic Regression and Random Forest. Perform feature engineering, model training, evaluation (accuracy, precision, recall, F1), and compare both models. Submit Jupyter Notebook with full code and analysis.', daysFromNow: 21 },
  { weekId: 'ml_m9',  title: 'ANN Classification Project', instruction: 'Build an Artificial Neural Network using Keras/TensorFlow to classify the MNIST handwritten digits dataset. Achieve at least 97% test accuracy. Submit your model architecture, training history plot, and evaluation report.', daysFromNow: 28 },
  { weekId: 'ml_m10', title: 'Capstone: ML Model Deployment', instruction: 'Choose ONE capstone project: Fraud Detection, Employee Attrition, or Sales Forecasting. Build end-to-end: data preprocessing → model training → evaluation → Flask API deployment. Submit GitHub repo link and a 5-minute demo video.', daysFromNow: 42 },
];

// ─── Digital Marketing ────────────────────────────────────────────────────────

const dmModules = [
  { id: 'dm_m1',  number: 1,  title: 'Introduction to Digital Marketing' },
  { id: 'dm_m2',  number: 2,  title: 'Website Creation & Optimization' },
  { id: 'dm_m3',  number: 3,  title: 'Search Engine Optimization (SEO)' },
  { id: 'dm_m4',  number: 4,  title: 'Social Media Marketing' },
  { id: 'dm_m5',  number: 5,  title: 'Google Ads' },
  { id: 'dm_m6',  number: 6,  title: 'Meta Ads – Facebook & Instagram' },
  { id: 'dm_m7',  number: 7,  title: 'Content Marketing' },
  { id: 'dm_m8',  number: 8,  title: 'Email Marketing & Automation' },
  { id: 'dm_m9',  number: 9,  title: 'Analytics & Reporting' },
  { id: 'dm_m10', number: 10, title: 'Live Capstone Project' },
];

const dmLessons = [
  { weekId: 'dm_m1',  order: 1,  title: 'Module 1: Introduction to Digital Marketing', content: 'Overview of Digital Marketing and the digital ecosystem. Traditional vs Digital Marketing comparison. Key Digital Marketing Channels: SEO, SEM, Social Media, Email, Content, Affiliate. Setting SMART Goals and KPIs. Career Paths in Digital Marketing: SEO Specialist, PPC Manager, Social Media Manager, Content Strategist, Digital Marketing Manager.', videoUrl: 'https://www.youtube.com/watch?v=bixR-KIJKYM' },
  { weekId: 'dm_m2',  order: 2,  title: 'Module 2: Website Creation & Optimization', content: 'Domain registration and web hosting basics. WordPress website creation and theme customization. Landing page builders: Elementor, Unbounce, Leadpages. UX/UI Principles for marketers: above-the-fold, CTAs, visual hierarchy. Core Web Vitals and Page Speed optimization. Conversion Rate Optimization (CRO): A/B testing, heatmaps, user journey mapping.', videoUrl: 'https://www.youtube.com/watch?v=pqmcf2BHRFM' },
  { weekId: 'dm_m3',  order: 3,  title: 'Module 3: Search Engine Optimization (SEO)', content: 'On-Page SEO: meta tags, heading structure, keyword density, internal linking. Off-Page SEO: backlink building, domain authority, guest posting. Technical SEO: site speed, mobile-first indexing, structured data, XML sitemaps, robots.txt. Keyword Research with Google Keyword Planner, SEMrush, Ahrefs. Local SEO and Google My Business optimization. SEO Audit process and reporting. Algorithm updates: Core Updates, Panda, Penguin.', videoUrl: 'https://www.youtube.com/watch?v=xsVTqzratPs' },
  { weekId: 'dm_m4',  order: 4,  title: 'Module 4: Social Media Marketing', content: 'Platform-specific strategies: LinkedIn (B2B), Instagram (visual), Facebook (community), Twitter/X (real-time), YouTube (video SEO). Social media content calendars and scheduling tools (Buffer, Hootsuite). Community management and engagement strategies. Influencer marketing: finding, vetting, and collaborating with influencers. Social Media Analytics: reach, engagement rate, impressions, CTR. Organic vs Paid social strategies.', videoUrl: 'https://www.youtube.com/watch?v=F9bMCQIJ-vM' },
  { weekId: 'dm_m5',  order: 5,  title: 'Module 5: Google Ads (PPC)', content: 'Google Ads account structure: Campaigns, Ad Groups, Keywords, Ads. Search Network vs Display Network campaigns. Keyword match types: Broad, Phrase, Exact, Negative. Quality Score, Ad Rank, and CPC bidding strategies. Ad Copywriting: headlines, descriptions, extensions. Smart Bidding: Target CPA, Target ROAS, Maximize Conversions. Performance Measurement: CTR, CPC, CPM, ROAS, Conversion Rate. Google Ads optimization and A/B testing.', videoUrl: 'https://www.youtube.com/watch?v=MHse3M0jzB0' },
  { weekId: 'dm_m6',  order: 6,  title: 'Module 6: Meta Ads – Facebook & Instagram', content: 'Meta Business Suite and Ads Manager overview. Campaign Objectives: Awareness, Traffic, Engagement, Leads, Sales. Audience Targeting: demographics, interests, behaviors, Custom Audiences, Lookalike Audiences. Ad formats: Image, Video, Carousel, Collection, Stories, Reels. Ad Creative best practices for Facebook and Instagram. Retargeting with Facebook Pixel. Campaign budget optimization (CBO) vs Ad Set Budget Optimization. Measuring ROAS and attribution models.', videoUrl: 'https://www.youtube.com/watch?v=ZNRzN7K_JDA' },
  { weekId: 'dm_m7',  order: 7,  title: 'Module 7: Content Marketing', content: 'Content Marketing Strategy: Define audience, set goals, choose channels. Content types: blogs, articles, infographics, videos, podcasts, whitepapers, case studies. SEO-driven blog writing and content clusters. Video content creation for YouTube and social media. Content distribution: owned, earned, paid channels. Content calendar creation and editorial workflow. Measuring Content ROI: organic traffic, leads, engagement, conversions.', videoUrl: 'https://www.youtube.com/watch?v=5KpDQWFbvRo' },
  { weekId: 'dm_m8',  order: 8,  title: 'Module 8: Email Marketing & Automation', content: 'Email marketing fundamentals: building a list, GDPR compliance, opt-in strategies. Email Campaign types: newsletters, promotional, welcome series, re-engagement. Mailchimp / ActiveCampaign: list segmentation, template design, scheduling. A/B Testing for subject lines, CTAs, send times. Marketing Automation Workflows: lead nurturing, drip campaigns, behavioral triggers. Email Analytics: open rate, click rate, bounce rate, unsubscribe rate, conversions. Improving deliverability: SPF, DKIM, DMARC.', videoUrl: 'https://www.youtube.com/watch?v=sUHLMSCKROA' },
  { weekId: 'dm_m9',  order: 9,  title: 'Module 9: Analytics & Reporting', content: 'Google Analytics 4 (GA4) setup and configuration: events, parameters, conversions. Understanding audience reports, acquisition channels, behavior flow. UTM parameters for campaign tracking. Google Search Console: performance reports, index coverage, Core Web Vitals. Building marketing dashboards in Looker Studio (Google Data Studio). Data-driven decision making: attribution models, funnel analysis, cohort analysis.', videoUrl: 'https://www.youtube.com/watch?v=d4MkHFcMfos' },
  { weekId: 'dm_m10', order: 10, title: 'Module 10: Live Capstone Project & Career Preparation', content: 'End-to-End Digital Marketing Campaign: Strategy → Execution → Measurement → Optimization. Multi-Channel Campaign: SEO + Google Ads + Social Media + Email. Campaign Performance Report and Data-driven Presentation. Portfolio Building: document all projects, campaigns, results. Resume Writing for Digital Marketing roles. LinkedIn profile optimization and networking strategies. Interview Preparation: common DM interview questions and case studies.', videoUrl: 'https://www.youtube.com/watch?v=SFLJolO_5zk' },
];

const dmAssignments = [
  { weekId: 'dm_m3',  title: 'SEO Audit Assignment', instruction: 'Perform a complete SEO audit on any website of your choice (not a major brand). Use Google Search Console and a free SEO tool (Ubersuggest/Screaming Frog). Document: on-page issues, broken links, page speed scores, keyword gaps, and provide 10 actionable recommendations. Submit a detailed PDF report.', daysFromNow: 14 },
  { weekId: 'dm_m5',  title: 'Google Ads Campaign Plan', instruction: 'Create a complete Google Search Campaign plan for a fictional e-commerce business. Include: campaign objective, target audience, keyword list (min 20 keywords with match types), 3 ad copies with headlines and descriptions, budget allocation, and expected KPIs. Submit as a structured document.', daysFromNow: 21 },
  { weekId: 'dm_m8',  title: 'Email Marketing Campaign Design', instruction: 'Design a 5-email drip campaign for a SaaS product onboarding sequence. Include: email subject lines, body copy, CTA, segmentation logic, send timing, and success metrics. Use Mailchimp (free plan) to actually build the campaign. Submit screenshots + campaign strategy document.', daysFromNow: 28 },
  { weekId: 'dm_m10', title: 'Capstone: Full Digital Marketing Campaign', instruction: 'Execute a complete digital marketing campaign for a real or fictional brand over 2 weeks. Must include: SEO content piece, social media posts (7 days), one Google/Meta ad mockup, email newsletter, and a GA4 analytics report. Submit: campaign strategy doc, all creatives, and a performance report with learnings.', daysFromNow: 42 },
];

// ─── Cybersecurity ────────────────────────────────────────────────────────────

const csModules = [
  { id: 'cs_m1',  number: 1,  title: 'Introduction to Cyber Security' },
  { id: 'cs_m2',  number: 2,  title: 'Networking Fundamentals for Security' },
  { id: 'cs_m3',  number: 3,  title: 'Linux and Windows Security' },
  { id: 'cs_m4',  number: 4,  title: 'Ethical Hacking & Penetration Testing' },
  { id: 'cs_m5',  number: 5,  title: 'Web Application Security' },
  { id: 'cs_m6',  number: 6,  title: 'SOC Fundamentals' },
  { id: 'cs_m7',  number: 7,  title: 'Digital Forensics & Incident Response' },
  { id: 'cs_m8',  number: 8,  title: 'Cloud Security Fundamentals' },
  { id: 'cs_m9',  number: 9,  title: 'Cyber Security Automation & AI' },
  { id: 'cs_m10', number: 10, title: 'Capstone Project & Career Preparation' },
];

const csLessons = [
  { weekId: 'cs_m1',  order: 1,  title: 'Module 1: Foundations of Cyber Security', content: 'Fundamentals of Cyber Security and the threat landscape. CIA Triad: Confidentiality, Integrity, Availability. Types of Cyber Threats and Attacks: malware, phishing, ransomware, social engineering. Cyber Security Domains: Network, Application, Cloud, Endpoint. Ethical Hacking vs Cyber Crime. Cyber Security Career Paths: SOC Analyst, Penetration Tester, Security Engineer, CISO. Cyber Security Frameworks: NIST, ISO 27001, OWASP. Practical: Cyber Security Lab Setup, Introduction to Kali Linux.', videoUrl: 'https://www.youtube.com/watch?v=2_6AyDurFOI' },
  { weekId: 'cs_m2',  order: 2,  title: 'Module 2: Networking Fundamentals for Security', content: 'OSI Model (7 layers) and TCP/IP stack deep dive. IP Addressing: IPv4, IPv6, subnetting, CIDR notation, VLSM. DNS, DHCP, HTTP/HTTPS, FTP, SSH, SMTP protocols. Routing and Switching: routers, switches, VLANs, spanning tree. Common ports and protocols (80, 443, 22, 21, 25, 53). Network devices security: firewalls, IDS/IPS, WAF, proxy servers. Packet Analysis fundamentals: Wireshark capture and filter. Practical: Wireshark Packet Capture, Network Scanning using Nmap.', videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw' },
  { weekId: 'cs_m3',  order: 3,  title: 'Module 3: Linux and Windows Security', content: 'Linux Fundamentals: filesystem hierarchy, essential commands, shell scripting. File Permissions: chmod, chown, SUID/SGID, sticky bit, ACLs. User Management: useradd, usermod, passwd, sudo, /etc/passwd, /etc/shadow. Windows Security Architecture: security subsystem, SAM database, NTLM/Kerberos. Active Directory: domains, forests, OUs, Group Policies. Log Monitoring: Event Viewer, syslog, /var/log. Practical: Linux Security Hardening Checklist, Windows Security Configuration.', videoUrl: 'https://www.youtube.com/watch?v=ROjZy1WbCIA' },
  { weekId: 'cs_m4',  order: 4,  title: 'Module 4: Ethical Hacking & Penetration Testing', content: 'Penetration Testing Methodology: Planning, Reconnaissance, Scanning, Exploitation, Post-Exploitation, Reporting. Passive & Active Information Gathering: OSINT, Google Dorking, Maltego. Footprinting and Reconnaissance techniques. Vulnerability Assessment vs Penetration Testing. Exploitation Concepts: CVEs, exploits, payloads. Privilege Escalation: Windows and Linux techniques. Post Exploitation: persistence, lateral movement, data exfiltration. Professional Report Writing for pentest findings. Practical: Nmap scanning, Nikto web scanner, Metasploit Framework, Vulnerability Scanning with Nessus.', videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE' },
  { weekId: 'cs_m5',  order: 5,  title: 'Module 5: Web Application Security', content: 'Web Technologies Overview: HTTP/HTTPS, cookies, sessions, REST APIs. OWASP Top 10 (2021): Injection, Broken Auth, XSS, IDOR, Security Misconfig, Cryptographic Failures, SSRF, etc. SQL Injection: Union-based, Blind, Time-based. Blind SQLi. Cross-Site Scripting (XSS): Reflected, Stored, DOM-based. Cross-Site Request Forgery (CSRF): SameSite cookies, CSRF tokens. Broken Authentication: credential stuffing, brute force, MFA bypass. Session Management vulnerabilities. Secure Coding Practices and OWASP ASVS. Practical: DVWA (Damn Vulnerable Web Application) Lab, Burp Suite Hands-on intercepting, scanning, and exploiting.', videoUrl: 'https://www.youtube.com/watch?v=WtHnT73NaaQ' },
  { weekId: 'cs_m6',  order: 6,  title: 'Module 6: SOC Fundamentals', content: 'Security Operations Center (SOC) structure: Tier 1, 2, 3 Analysts, SOC Manager. Security Monitoring: real-time event monitoring, alert triage process. SIEM Concepts: log aggregation, correlation rules, dashboards. Log Management: Windows Event Logs, syslog, application logs. Incident Detection: true positive vs false positive, alert fatigue. Threat Intelligence: IOCs, TTPs, MITRE ATT&CK framework. Security Alerts and Response: escalation procedures, playbooks. Practical: Splunk Basics (search, dashboards, alerts), Log Analysis Exercises.', videoUrl: 'https://www.youtube.com/watch?v=Z13slYLAoAg' },
  { weekId: 'cs_m7',  order: 7,  title: 'Module 7: Digital Forensics & Incident Response', content: 'Digital Forensics Process: identification, preservation, collection, analysis, reporting. Evidence Collection: legal considerations, write blockers, forensic imaging. Chain of Custody documentation. Memory Analysis: volatile data, RAM acquisition, process analysis with Volatility. Disk Forensics: file system analysis, deleted file recovery, timeline analysis. Incident Response Lifecycle: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned. Malware Investigation: static and dynamic analysis basics. Practical: Autopsy forensic tool walkthrough, Basic Incident Investigation lab.', videoUrl: 'https://www.youtube.com/watch?v=wnlI1LjJF3g' },
  { weekId: 'cs_m8',  order: 8,  title: 'Module 8: Cloud Security Fundamentals', content: 'Introduction to Cloud Computing: IaaS, PaaS, SaaS, public/private/hybrid cloud. AWS Security Basics: Shared Responsibility Model, VPC, Security Groups, NACLs. Azure Security Basics: Azure AD, NSGs, Azure Security Center. Cloud Threats and Risks: misconfigured S3 buckets, excessive permissions, credential theft, API abuse. Identity and Access Management (IAM): least privilege, role-based access, MFA for cloud. Data Protection: encryption at rest/transit, KMS, CloudTrail logging. Cloud Compliance: GDPR, SOC2, PCI-DSS, HIPAA in cloud context. Practical: AWS IAM Configuration and Policy Creation, Security Group Management lab.', videoUrl: 'https://www.youtube.com/watch?v=Kx0-P2m-GKs' },
  { weekId: 'cs_m9',  order: 9,  title: 'Module 9: Cyber Security Automation & AI', content: 'Introduction to Security Automation and SOAR. Python for Security: scripting for automation, working with APIs, parsing logs. Security Automation Scripts: port scanner, password checker, log analyzer, hash identifier. AI in Cyber Security: ML for threat detection, anomaly detection, user behavior analytics (UEBA). Threat Detection using AI/ML models. ChatGPT and Security Applications: phishing detection, log analysis, report generation. Security Orchestration Basics: integrating tools via APIs. Practical: Building Python Security Scripts, AI-Based Threat Analysis lab.', videoUrl: 'https://www.youtube.com/watch?v=bMZpDPNPuoA' },
  { weekId: 'cs_m10', order: 10, title: 'Module 10: Capstone Projects & Career Preparation', content: 'Capstone Projects: (1) Complete Vulnerability Assessment of a Web Application, (2) Network Security Monitoring System with Splunk, (3) Phishing Detection System using Python/ML, (4) SOC Dashboard using Splunk, (5) Password Strength Analyzer, (6) Malware Traffic Analysis, (7) Full Web Application Penetration Testing Report, (8) AI-Based Threat Detection System. Career Preparation: Resume Building for Cyber Security roles, LinkedIn Profile Optimization, Certifications Roadmap (CEH, OSCP, CompTIA Security+, CISSP), Interview Preparation: common interview questions, technical challenges, Mock Technical Interviews.', videoUrl: 'https://www.youtube.com/watch?v=ULGILG-ZhO0' },
];

const csAssignments = [
  { weekId: 'cs_m2',  title: 'Network Scanning Lab Report', instruction: 'Using Nmap on your local network or a provided test environment, perform: (1) Host discovery scan, (2) Full port scan on a target, (3) Service version detection, (4) OS detection scan, (5) NSE script scan. Document all findings in a professional penetration testing report format with screenshots.', daysFromNow: 14 },
  { weekId: 'cs_m4',  title: 'Penetration Testing Lab Report', instruction: 'Using Metasploitable 2 (a deliberately vulnerable VM), perform a structured penetration test: Reconnaissance → Scanning → Exploitation → Post-Exploitation. Document all steps with screenshots, commands used, vulnerabilities found, and recommendations. Submit a professional pentest report (min 10 pages).', daysFromNow: 21 },
  { weekId: 'cs_m5',  title: 'Web Application Security Testing', instruction: 'Using DVWA (Damn Vulnerable Web Application) set to low/medium security, demonstrate exploitation of: SQL Injection, Stored XSS, CSRF, File Upload vulnerability, and Brute Force. For each vulnerability: show the exploit, explain the impact, and provide the secure code fix. Submit with Burp Suite screenshots.', daysFromNow: 28 },
  { weekId: 'cs_m10', title: 'Capstone: Full Security Assessment', instruction: 'Choose ONE: (A) Complete Web App Pentest Report on a practice target or (B) Build a Python-based Security Tool (port scanner + vulnerability checker + report generator). For A: submit a professional report following PTES/OWASP methodology. For B: submit GitHub repo with code, README, and demo video.', daysFromNow: 42 },
];

// ─── Main Update Function ────────────────────────────────────────────────────

async function updateCourse(
  domain: string,
  newTitle: string,
  newDescription: string,
  newDuration: string,
  modules: { id: string; number: number; title: string }[],
  lessons: { weekId: string; order: number; title: string; content: string; videoUrl: string }[],
  assignments: { weekId: string; title: string; instruction: string; daysFromNow: number }[],
) {
  console.log(`\n📚 Updating course: ${domain}...`);

  const course = await prisma.course.findFirst({ where: { domain } });
  if (!course) {
    console.log(`  ⚠️  No course found for domain: ${domain}`);
    return;
  }

  console.log(`  Found: "${course.title}" (${course.id})`);

  // 1. Delete old lessons, assignments, quizzes for this course
  await prisma.lessonProgress.deleteMany({ where: { lesson: { courseId: course.id } } });
  await prisma.lesson.deleteMany({ where: { courseId: course.id } });
  await prisma.submission.deleteMany({ where: { assignment: { courseId: course.id } } });
  await prisma.assignment.deleteMany({ where: { courseId: course.id } });
  await prisma.quizResult.deleteMany({ where: { quiz: { courseId: course.id } } });
  await prisma.quiz.deleteMany({ where: { courseId: course.id } });
  console.log(`  ✅ Cleared old content`);

  // 2. Update course metadata with new weeks/modules
  await prisma.course.update({
    where: { id: course.id },
    data: {
      title: newTitle,
      description: newDescription,
      duration: newDuration,
      weeks: modules as any,
      status: 'Published',
    },
  });
  console.log(`  ✅ Updated ${modules.length} modules`);

  // 3. Create lessons
  for (const l of lessons) {
    await prisma.lesson.create({
      data: {
        title: l.title,
        content: l.content,
        videoUrl: l.videoUrl,
        weekId: l.weekId,
        order: l.order,
        courseId: course.id,
      },
    });
  }
  console.log(`  ✅ Created ${lessons.length} lessons`);

  // 4. Create assignments
  for (const a of assignments) {
    await prisma.assignment.create({
      data: {
        title: a.title,
        instruction: a.instruction,
        dueDate: new Date(Date.now() + 86400000 * a.daysFromNow),
        maxMarks: 100,
        submissionType: 'File Upload',
        courseId: course.id,
        weekId: a.weekId,
      },
    });
  }
  console.log(`  ✅ Created ${assignments.length} assignments`);

  // 5. Create a quiz per module (domain knowledge assessment)
  const quizQuestions: Record<string, any[]> = {
    'Machine Learning': [
      { id: 'q1', text: 'Which algorithm is best suited for predicting a continuous value like house price?', options: ['K-Means Clustering', 'Linear Regression', 'Naive Bayes', 'DBSCAN'], correctOption: 1 },
      { id: 'q2', text: 'What does PCA stand for in machine learning?', options: ['Predictive Component Algorithm', 'Principal Component Analysis', 'Partial Correlation Analysis', 'Probabilistic Classification Approach'], correctOption: 1 },
      { id: 'q3', text: 'Which technique helps prevent overfitting in ML models?', options: ['Increasing training data only', 'Using complex models', 'Cross-validation and regularization', 'Removing all features'], correctOption: 2 },
      { id: 'q4', text: 'What is the purpose of the activation function in a neural network?', options: ['Normalize the input data', 'Introduce non-linearity into the model', 'Calculate the loss function', 'Determine the learning rate'], correctOption: 1 },
      { id: 'q5', text: 'Which Python library is commonly used for building and training deep learning models?', options: ['NumPy', 'Pandas', 'TensorFlow/Keras', 'Matplotlib'], correctOption: 2 },
    ],
    'Digital Marketing': [
      { id: 'q1', text: 'What does SEO stand for?', options: ['Social Engagement Optimization', 'Search Engine Optimization', 'Site Efficiency Output', 'Search Experience Operations'], correctOption: 1 },
      { id: 'q2', text: 'Which metric measures the percentage of users who click on a link after seeing it?', options: ['Bounce Rate', 'Conversion Rate', 'Click-Through Rate (CTR)', 'Impressions'], correctOption: 2 },
      { id: 'q3', text: 'What is a Lookalike Audience in Meta Ads?', options: ['An audience that looks at your ads multiple times', 'An audience similar to your existing customers', 'Users who have previously visited your website', 'A custom audience created from your email list'], correctOption: 1 },
      { id: 'q4', text: 'What is the primary purpose of UTM parameters in digital marketing?', options: ['Improve page loading speed', 'Track campaign traffic sources in analytics', 'Create custom landing pages', 'Automate email campaigns'], correctOption: 1 },
      { id: 'q5', text: 'Which tool would you use to measure organic search performance and keyword rankings?', options: ['Facebook Ads Manager', 'Google Search Console', 'Mailchimp', 'Canva'], correctOption: 1 },
    ],
    'Cyber Security': [
      { id: 'q1', text: 'What does the CIA Triad stand for in Cyber Security?', options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Cyber Intelligence Analysis', 'Control, Identification, Authentication'], correctOption: 1 },
      { id: 'q2', text: 'Which OWASP Top 10 vulnerability allows an attacker to execute malicious SQL commands?', options: ['Cross-Site Scripting (XSS)', 'SQL Injection', 'CSRF', 'Broken Authentication'], correctOption: 1 },
      { id: 'q3', text: 'What is the primary purpose of a penetration test?', options: ['Monitor network traffic 24/7', 'Simulate real-world attacks to find vulnerabilities before attackers do', 'Install antivirus on all systems', 'Configure firewall rules'], correctOption: 1 },
      { id: 'q4', text: 'Which framework maps adversary tactics and techniques used in real-world cyberattacks?', options: ['OWASP', 'NIST CSF', 'MITRE ATT&CK', 'ISO 27001'], correctOption: 2 },
      { id: 'q5', text: 'In cloud security, what does the Shared Responsibility Model define?', options: ['How costs are shared between cloud users', 'Which security responsibilities belong to the cloud provider vs the customer', 'The process for sharing encryption keys', 'Data backup procedures'], correctOption: 1 },
    ],
  };

  const domainKey = domain === 'Cyber Security' ? 'Cyber Security' : domain;
  const questions = quizQuestions[domainKey] || quizQuestions['Machine Learning'];

  await prisma.quiz.create({
    data: {
      title: `${newTitle} — Comprehensive Assessment Quiz`,
      passingScore: 70,
      timeLimit: 30,
      courseId: course.id,
      weekId: modules[modules.length - 1].id,
      questions: questions as any,
    },
  });
  console.log(`  ✅ Created assessment quiz`);
  console.log(`  🎉 Course "${newTitle}" fully updated!`);
}

async function main() {
  console.log('🚀 Starting course curriculum update...\n');

  await updateCourse(
    'Machine Learning',
    'Machine Learning Training Program',
    'Industry-Oriented Machine Learning Course — 120 Hours. Master Python, Data Analysis, Supervised & Unsupervised Learning, Deep Learning, and Model Deployment through hands-on projects and real-world capstone challenges.',
    '120 Hours',
    mlModules,
    mlLessons,
    mlAssignments,
  );

  await updateCourse(
    'Digital Marketing',
    'Digital Marketing Professional Training Program',
    'Industry-Oriented Digital Marketing Course — 120 Hours. Master SEO, Google Ads, Meta Ads, Social Media Marketing, Content Marketing, Email Automation, and Analytics through live campaigns and a capstone project.',
    '120 Hours',
    dmModules,
    dmLessons,
    dmAssignments,
  );

  await updateCourse(
    'Cyber Security',
    'Cyber Security Training Program',
    'Industry-Oriented Cyber Security Course — 120 Hours. Master Networking, Ethical Hacking, Penetration Testing, Web App Security, SOC Operations, Digital Forensics, Cloud Security, and Security Automation with real lab environments.',
    '120 Hours',
    csModules,
    csLessons,
    csAssignments,
  );

  console.log('\n✅ All 3 courses updated successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
