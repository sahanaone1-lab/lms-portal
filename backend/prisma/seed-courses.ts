/**
 * seed-courses.ts
 *
 * Comprehensive, idempotent course content seeder.
 * Populates Supabase with ALL courses, modules, and lessons (with YouTube URLs).
 * Safe to run multiple times — uses upsert/findFirst patterns.
 *
 * Domains: Full Stack, Machine Learning, Generative AI, Cyber Security,
 *          Digital Marketing, Data Analytics
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register prisma/seed-courses.ts
 */

import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Type Definitions ─────────────────────────────────────────────────────────

interface ModuleDef {
  order: number;
  title: string;
  description?: string;
  lessons: LessonDef[];
}

interface LessonDef {
  order: number;
  title: string;
  content: string;
  videoUrl: string;
  duration?: string;
}

interface CourseDef {
  domain: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  learningOutcomes: string[];
  modules: ModuleDef[];
}

// ─── Full Stack Development ───────────────────────────────────────────────────

const fullStackCourse: CourseDef = {
  domain: 'Full Stack',
  title: 'Full Stack Development Program',
  description:
    'Industry-Oriented Full Stack Development Course — 120 Hours. Master HTML, CSS, JavaScript, React, Node.js, Express, PostgreSQL, and modern deployment practices through hands-on projects.',
  duration: '120 Hours',
  difficulty: 'Beginner',
  learningOutcomes: [
    'Build responsive UIs with HTML, CSS, and JavaScript',
    'Develop dynamic applications with React',
    'Create RESTful APIs with Node.js and Express',
    'Manage databases with PostgreSQL and Prisma ORM',
    'Deploy full-stack applications to cloud platforms',
    'Implement authentication and authorization',
  ],
  modules: [
    {
      order: 1,
      title: 'Introduction to Web Development',
      description: 'Foundations of the web, how browsers work, and the full stack ecosystem.',
      lessons: [
        {
          order: 1,
          title: 'How the Web Works — HTTP, Browsers & Full Stack Overview',
          content:
            'Introduction to the Internet, how browsers request and render pages, HTTP/HTTPS protocol, DNS, client-server architecture, and what full-stack development means in the modern industry.',
          videoUrl: 'https://www.youtube.com/watch?v=EqzUcMzfB1s',
          duration: '45 min',
        },
      ],
    },
    {
      order: 2,
      title: 'HTML & CSS Fundamentals',
      description: 'Build structured and styled web pages from scratch.',
      lessons: [
        {
          order: 1,
          title: 'HTML5 & CSS3 — Complete Beginner Course',
          content:
            'HTML5 semantic elements, document structure, forms, tables, accessibility basics. CSS selectors, box model, Flexbox, Grid, responsive design with media queries, and CSS custom properties.',
          videoUrl: 'https://www.youtube.com/watch?v=mU6anWqZJcc',
          duration: '60 min',
        },
      ],
    },
    {
      order: 3,
      title: 'JavaScript & ES6+',
      description: 'Master JavaScript from basics to advanced patterns.',
      lessons: [
        {
          order: 1,
          title: 'JavaScript Full Course — Variables, Functions, DOM & Async',
          content:
            'Variables, data types, operators, control flow, functions, scope, closures, ES6+ features (arrow functions, destructuring, spread, template literals), DOM manipulation, events, fetch API, Promises, async/await.',
          videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
          duration: '60 min',
        },
      ],
    },
    {
      order: 4,
      title: 'React — Frontend Framework',
      description: 'Build component-based UIs with React and modern hooks.',
      lessons: [
        {
          order: 1,
          title: 'React Full Course — Components, Hooks, State & Context',
          content:
            'React fundamentals: JSX, functional components, props, state with useState, side effects with useEffect, React Router for navigation, Context API for global state, and custom hooks for reusable logic.',
          videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
          duration: '60 min',
        },
      ],
    },
    {
      order: 5,
      title: 'Node.js & Express — Backend Development',
      description: 'Build scalable RESTful APIs with Node.js and Express.',
      lessons: [
        {
          order: 1,
          title: 'Node.js & Express Full Course — REST APIs & Middleware',
          content:
            'Node.js event loop, modules (CommonJS, ESM), npm ecosystem, Express routing, middleware, error handling, RESTful API design principles, request/response lifecycle, environment variables, and CORS configuration.',
          videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
          duration: '60 min',
        },
      ],
    },
    {
      order: 6,
      title: 'Databases — PostgreSQL & Prisma ORM',
      description: 'Store and query data with PostgreSQL and modern ORM patterns.',
      lessons: [
        {
          order: 1,
          title: 'PostgreSQL Full Course — SQL Queries, Joins & Prisma ORM',
          content:
            'Relational database concepts, PostgreSQL setup, SQL fundamentals (SELECT, INSERT, UPDATE, DELETE, JOINs, aggregations), Prisma ORM setup with schema definition, migrations, and CRUD operations.',
          videoUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
          duration: '60 min',
        },
      ],
    },
    {
      order: 7,
      title: 'Authentication & Security',
      description: 'Implement JWT authentication and secure your application.',
      lessons: [
        {
          order: 1,
          title: 'JWT Authentication with Node.js — Login, Tokens & Security',
          content:
            'JWT structure and validation, bcrypt for password hashing, refresh tokens, secure cookie storage, role-based access control (RBAC), HTTPS, CORS policies, SQL injection prevention, and XSS/CSRF protection.',
          videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
          duration: '50 min',
        },
      ],
    },
    {
      order: 8,
      title: 'TypeScript for Full Stack Development',
      description: 'Add type safety to your JavaScript with TypeScript.',
      lessons: [
        {
          order: 1,
          title: 'TypeScript Full Course — Types, Interfaces & Generics',
          content:
            'TypeScript basics: static typing, interfaces, type aliases, generics, enums, decorators. Using TypeScript with React (TSX), Express, and Prisma. tsconfig.json configuration and compilation.',
          videoUrl: 'https://www.youtube.com/watch?v=30LWjhZzg50',
          duration: '55 min',
        },
      ],
    },
    {
      order: 9,
      title: 'DevOps & Deployment',
      description: 'Deploy your full stack app to the cloud using modern CI/CD practices.',
      lessons: [
        {
          order: 1,
          title: 'Full Stack Deployment — Git, Docker & Cloud Platforms',
          content:
            'Git workflow (branching, PRs, rebase), Docker containers and docker-compose, environment management, deploying Node.js APIs to Render/Railway/Heroku, deploying React apps to Vercel/Netlify, GitHub Actions CI/CD pipeline basics.',
          videoUrl: 'https://www.youtube.com/watch?v=9zUHg7xjIqQ',
          duration: '55 min',
        },
      ],
    },
    {
      order: 10,
      title: 'Capstone Project — Full Stack Application',
      description: 'Build and deploy a complete full stack application end-to-end.',
      lessons: [
        {
          order: 1,
          title: 'MERN Stack Capstone — Build & Deploy a Real-World App',
          content:
            'End-to-end full stack project: requirements analysis → API design → database schema → React frontend → Node/Express backend → JWT auth → PostgreSQL → deployment. Capstone projects: E-Commerce Store, Task Manager, Blog Platform, Social Media Dashboard.',
          videoUrl: 'https://www.youtube.com/watch?v=mrHNSanmqQ4',
          duration: '90 min',
        },
      ],
    },
  ],
};

// ─── Machine Learning ─────────────────────────────────────────────────────────

const mlCourse: CourseDef = {
  domain: 'Machine Learning',
  title: 'Machine Learning Training Program',
  description:
    'Industry-Oriented Machine Learning Course — 120 Hours. Master Python, Data Analysis, Supervised & Unsupervised Learning, Deep Learning, and Model Deployment through hands-on projects and real-world capstone challenges.',
  duration: '120 Hours',
  difficulty: 'Intermediate',
  learningOutcomes: [
    'Implement supervised and unsupervised ML algorithms from scratch',
    'Perform exploratory data analysis with NumPy and Pandas',
    'Build and evaluate deep learning models with TensorFlow/Keras',
    'Deploy ML models as REST APIs using Flask',
    'Apply feature engineering and hyperparameter tuning',
    'Solve real-world problems: fraud detection, recommendation systems',
  ],
  modules: [
    {
      order: 1,
      title: 'Introduction to Machine Learning',
      description: 'Understand ML concepts, types, and the ML workflow.',
      lessons: [
        {
          order: 1,
          title: 'Introduction to AI, ML & Deep Learning — Concepts & Applications',
          content:
            'Artificial Intelligence vs Machine Learning vs Deep Learning. Types of ML: Supervised, Unsupervised, Reinforcement Learning. ML workflow, Python environment setup with Anaconda, Jupyter Notebook basics, and real-world industry applications.',
          videoUrl: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
          duration: '50 min',
        },
      ],
    },
    {
      order: 2,
      title: 'Python for Machine Learning',
      description: 'Python programming essentials for data science and ML.',
      lessons: [
        {
          order: 1,
          title: 'Python Full Course for Beginners — Data Structures & OOP',
          content:
            'Python variables, data types, lists, tuples, dictionaries, sets, control flow, functions, file handling, exception handling, and OOP basics (classes, inheritance). Practical: Python exercises for ML workflows.',
          videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
          duration: '60 min',
        },
      ],
    },
    {
      order: 3,
      title: 'Data Analysis using NumPy & Pandas',
      description: 'Clean, transform, and explore data for ML pipelines.',
      lessons: [
        {
          order: 1,
          title: 'NumPy & Pandas Full Tutorial — Data Cleaning & EDA',
          content:
            'NumPy arrays, broadcasting, vectorized operations. Pandas DataFrames: loading, cleaning, filtering, handling missing values, transformation, aggregation, merging & joining. Practical: Titanic EDA and data cleaning project.',
          videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
          duration: '60 min',
        },
      ],
    },
    {
      order: 4,
      title: 'Data Visualization',
      description: 'Create insightful charts and dashboards with Python.',
      lessons: [
        {
          order: 1,
          title: 'Matplotlib & Seaborn — Data Visualization Masterclass',
          content:
            'Matplotlib: line charts, bar charts, pie charts, histograms, scatter plots, subplots. Seaborn for statistical visualization: heatmaps, box plots, violin plots, pair plots. Practical: building a marketing analytics dashboard.',
          videoUrl: 'https://www.youtube.com/watch?v=UO98lJQ3QGI',
          duration: '55 min',
        },
      ],
    },
    {
      order: 5,
      title: 'Statistics & Mathematics for ML',
      description: 'Master the math behind machine learning algorithms.',
      lessons: [
        {
          order: 1,
          title: 'Statistics for Data Science — Probability, Distributions & Hypothesis Testing',
          content:
            'Descriptive statistics, probability theory, normal distribution, Central Limit Theorem, hypothesis testing, p-values. Linear algebra: vectors, matrices, dot product, eigenvalues. Gradient descent intuition for optimization.',
          videoUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28',
          duration: '60 min',
        },
      ],
    },
    {
      order: 6,
      title: 'Supervised Learning',
      description: 'Build predictive models with regression and classification algorithms.',
      lessons: [
        {
          order: 1,
          title: 'Supervised Learning — Regression & Classification Algorithms',
          content:
            'Linear Regression, Multiple Regression, Logistic Regression. Decision Trees and Random Forest ensemble methods. K-Nearest Neighbors (KNN), Support Vector Machines (SVM), Naive Bayes classifier. Practical: House Price Prediction, Customer Churn Prediction.',
          videoUrl: 'https://www.youtube.com/watch?v=pqNCD_5r0IU',
          duration: '60 min',
        },
      ],
    },
    {
      order: 7,
      title: 'Unsupervised Learning',
      description: 'Discover hidden patterns with clustering and dimensionality reduction.',
      lessons: [
        {
          order: 1,
          title: 'Unsupervised Learning — Clustering & Dimensionality Reduction',
          content:
            'K-Means Clustering, Elbow Method for optimal K, Hierarchical Clustering, DBSCAN. Principal Component Analysis (PCA) for dimensionality reduction. Practical: Customer Segmentation Project, PCA visualization project.',
          videoUrl: 'https://www.youtube.com/watch?v=4b5d3muPQmA',
          duration: '55 min',
        },
      ],
    },
    {
      order: 8,
      title: 'Model Evaluation & Feature Engineering',
      description: 'Build robust models with proper evaluation and feature optimization.',
      lessons: [
        {
          order: 1,
          title: 'Model Evaluation, Cross-Validation & Feature Engineering',
          content:
            'Feature selection techniques, Feature Scaling (StandardScaler, MinMaxScaler). Cross-validation: K-Fold, Stratified K-Fold. Hyperparameter tuning with GridSearchCV and RandomizedSearchCV. Bias-Variance tradeoff, overfitting and underfitting detection.',
          videoUrl: 'https://www.youtube.com/watch?v=85dtiMz9tSo',
          duration: '50 min',
        },
      ],
    },
    {
      order: 9,
      title: 'Deep Learning Fundamentals',
      description: 'Build neural networks with TensorFlow/Keras.',
      lessons: [
        {
          order: 1,
          title: 'Neural Networks & Deep Learning — 3Blue1Brown Explained',
          content:
            'Neural network architecture, perceptrons, activation functions (ReLU, Sigmoid, Softmax). Forward and backpropagation. ANN implementation with TensorFlow/Keras. CNNs for image recognition, RNNs for sequence data. Practical: MNIST digit classification.',
          videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
          duration: '60 min',
        },
      ],
    },
    {
      order: 10,
      title: 'ML Model Deployment & Capstone Projects',
      description: 'Deploy ML models as APIs and build end-to-end capstone projects.',
      lessons: [
        {
          order: 1,
          title: 'ML Model Deployment with Flask — Build & Serve ML APIs',
          content:
            'Model serialization with pickle/joblib, Flask API for ML model serving, building REST endpoints for predictions. Capstone projects: Fraud Detection System, Employee Attrition Predictor, Movie Recommendation System, Sales Forecasting, Student Performance Prediction.',
          videoUrl: 'https://www.youtube.com/watch?v=mrExsjcvF4o',
          duration: '60 min',
        },
      ],
    },
  ],
};

// ─── Generative AI ────────────────────────────────────────────────────────────

const genaiCourse: CourseDef = {
  domain: 'Generative AI',
  title: 'Generative AI Training Program',
  description:
    'Industry-Oriented Generative AI Course — 120 Hours. Master LLMs, Prompt Engineering, ChatGPT, RAG frameworks, AI Agents, LangChain, and OpenAI API integration through practical projects.',
  duration: '120 Hours',
  difficulty: 'Intermediate',
  learningOutcomes: [
    'Understand LLM architecture and training methodologies',
    'Master prompt engineering patterns for production use',
    'Build RAG pipelines with vector databases',
    'Create AI agents with LangChain and tool use',
    'Integrate OpenAI API into real applications',
    'Generate AI images and videos for business use cases',
  ],
  modules: [
    {
      order: 1,
      title: 'Introduction to Artificial Intelligence & Generative AI',
      description: 'Foundations of AI, generative models, and the transformer revolution.',
      lessons: [
        {
          order: 1,
          title: 'Introduction to AI & Generative AI — History, Transformers & Use Cases',
          content:
            'History and evolution of AI, neural networks, and the shift to Generative AI. Transformers and self-attention mechanisms explained. Real-world generative AI applications across industries: healthcare, finance, marketing, education. AI ethics and responsible AI principles.',
          videoUrl: 'https://www.youtube.com/watch?v=2IK3DFHRFfw',
          duration: '50 min',
        },
      ],
    },
    {
      order: 2,
      title: 'Large Language Models (LLMs)',
      description: 'Deep dive into LLM architecture, training, and capabilities.',
      lessons: [
        {
          order: 1,
          title: 'Large Language Models Explained — GPT, LLaMA, Claude & Gemini',
          content:
            'LLM architectures: GPT series, LLaMA, Claude, Gemini. Tokenization, pre-training, fine-tuning, RLHF. Model parameters, temperature, top-p, top-k sampling. Context windows, attention mechanisms. Comparing open-source vs proprietary models.',
          videoUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
          duration: '55 min',
        },
      ],
    },
    {
      order: 3,
      title: 'Prompt Engineering',
      description: 'Design effective prompts for production AI applications.',
      lessons: [
        {
          order: 1,
          title: 'Prompt Engineering Full Course — Zero-shot, Few-shot & Chain-of-Thought',
          content:
            'Prompt design patterns: Zero-shot, Few-shot, Chain-of-Thought (CoT), ReAct prompting. System instructions, prompt templates, few-shot demonstration selection. Safety guardrails, hallucination mitigation, structured output with JSON mode.',
          videoUrl: 'https://www.youtube.com/watch?v=1bUy-1hGZpI',
          duration: '50 min',
        },
      ],
    },
    {
      order: 4,
      title: 'ChatGPT for Productivity',
      description: 'Unlock ChatGPT for professional and business workflows.',
      lessons: [
        {
          order: 1,
          title: 'ChatGPT Mastery — Advanced Productivity & Custom GPTs',
          content:
            'ChatGPT for professional writing, brainstorming, code generation, and data analysis. Advanced Data Analysis (Code Interpreter) mode. Building Custom GPTs with instructions and knowledge files. Workspace and tool integrations (Zapier, Make.com).',
          videoUrl: 'https://www.youtube.com/watch?v=sTeoEFzVNSc',
          duration: '55 min',
        },
      ],
    },
    {
      order: 5,
      title: 'AI Tools & Applications',
      description: 'Explore the generative AI ecosystem of tools for every use case.',
      lessons: [
        {
          order: 1,
          title: 'AI Tools Ecosystem — Writing, Design, Coding & Productivity',
          content:
            'AI writing tools: Jasper, Copy.ai, Writesonic. AI design: Canva AI, Adobe Firefly. Coding companions: GitHub Copilot, Cursor IDE. AI search: Perplexity AI. Productivity: Notion AI, Otter.ai, ElevenLabs for voice. Tool evaluation frameworks.',
          videoUrl: 'https://www.youtube.com/watch?v=JyOPfbSHb-k',
          duration: '50 min',
        },
      ],
    },
    {
      order: 6,
      title: 'AI Image Generation',
      description: 'Create stunning images with Midjourney, DALL-E, and Stable Diffusion.',
      lessons: [
        {
          order: 1,
          title: 'AI Image Generation — Midjourney, DALL-E 3 & Stable Diffusion',
          content:
            'Midjourney prompt structures, aspect ratios, styling filters, seed parameters, inpainting, and outpainting. DALL-E 3 via ChatGPT. Stable Diffusion setup and ControlNet for consistent characters. Real-world business use cases for generated images.',
          videoUrl: 'https://www.youtube.com/watch?v=1CIpzeNxIhU',
          duration: '55 min',
        },
      ],
    },
    {
      order: 7,
      title: 'AI Video Generation',
      description: 'Generate professional videos with AI tools.',
      lessons: [
        {
          order: 1,
          title: 'AI Video Generation — Sora, RunwayML & HeyGen',
          content:
            'Text-to-video generation with Sora, RunwayML Gen-2, and Pika Labs. AI avatar tools: HeyGen, Synthesia for corporate training videos. Video editing with Descript and Captions.ai. Use cases: marketing videos, product demos, educational content.',
          videoUrl: 'https://www.youtube.com/watch?v=mPGjYp0e6mE',
          duration: '50 min',
        },
      ],
    },
    {
      order: 8,
      title: 'AI for Business Automation',
      description: 'Automate business workflows with AI agents and no-code tools.',
      lessons: [
        {
          order: 1,
          title: 'AI Business Automation — Zapier AI, Make.com & n8n Workflows',
          content:
            'No-code AI automation with Zapier AI and Make.com. Building multi-step workflows with AI decisions. n8n for self-hosted automation. AI for customer support: chatbots, FAQ systems. Email automation with AI personalization. ROI calculation for AI implementations.',
          videoUrl: 'https://www.youtube.com/watch?v=l7n2NHpXz9w',
          duration: '55 min',
        },
      ],
    },
    {
      order: 9,
      title: 'Python for Generative AI',
      description: 'Code AI applications with Python and popular AI libraries.',
      lessons: [
        {
          order: 1,
          title: 'Python for AI — OpenAI Library, HuggingFace & LangChain Basics',
          content:
            'Python essentials for AI: functions, classes, async programming. Working with OpenAI Python SDK. HuggingFace Transformers library for open-source models. API integration patterns, rate limiting, error handling. Building a simple AI chatbot from scratch.',
          videoUrl: 'https://www.youtube.com/watch?v=R8E2VKJQZ24',
          duration: '60 min',
        },
      ],
    },
    {
      order: 10,
      title: 'OpenAI API & LLM Integration',
      description: 'Build production AI features with the OpenAI API.',
      lessons: [
        {
          order: 1,
          title: 'OpenAI API Full Course — Chat, Embeddings & Function Calling',
          content:
            'OpenAI API setup, authentication, and rate limits. Chat completions API, streaming responses. Embeddings for semantic search. Function calling and tool use. Vision API for image understanding. Whisper for speech-to-text. Cost optimization strategies.',
          videoUrl: 'https://www.youtube.com/watch?v=c-g6epk3fFE',
          duration: '55 min',
        },
      ],
    },
    {
      order: 11,
      title: 'Retrieval Augmented Generation (RAG)',
      description: 'Build knowledge-grounded AI systems with vector databases.',
      lessons: [
        {
          order: 1,
          title: 'RAG Pipeline — Vector Databases, Embeddings & Retrieval Systems',
          content:
            'RAG architecture: chunking, embedding, vector storage, retrieval, and generation. Vector databases: Pinecone, ChromaDB, Weaviate. Embedding models and similarity search. Advanced RAG: hybrid search, reranking, query expansion. Practical: Build a document Q&A system.',
          videoUrl: 'https://www.youtube.com/watch?v=ea2W8IogX80',
          duration: '60 min',
        },
      ],
    },
    {
      order: 12,
      title: 'AI Agents',
      description: 'Build autonomous AI agents that can use tools and plan tasks.',
      lessons: [
        {
          order: 1,
          title: 'AI Agents — Tool Use, Planning & Multi-Agent Systems',
          content:
            'AI agent architecture: perception, planning, memory, and action. ReAct and Plan-and-Execute patterns. Tool integration: web search, code execution, API calls. Memory types: in-context, episodic, semantic. Multi-agent coordination. Practical: Build a research agent.',
          videoUrl: 'https://www.youtube.com/watch?v=zy6-FVn5_lQ',
          duration: '55 min',
        },
      ],
    },
    {
      order: 13,
      title: 'LangChain Framework',
      description: 'Build complex AI pipelines with the LangChain framework.',
      lessons: [
        {
          order: 1,
          title: 'LangChain Full Course — Chains, Agents & Memory',
          content:
            'LangChain components: LLMs, prompts, chains, memory, and tools. Building sequential chains, router chains, and parallel chains. LangChain agents with custom tools. Conversational memory: buffer, summary, entity memory. LangServe for deployment.',
          videoUrl: 'https://www.youtube.com/watch?v=LbT1yp6quS8',
          duration: '60 min',
        },
      ],
    },
    {
      order: 14,
      title: 'Generative AI Projects & Capstone',
      description: 'Build and present real-world generative AI capstone projects.',
      lessons: [
        {
          order: 1,
          title: 'GenAI Capstone Projects — RAG Chatbot, AI Agent & Content Generator',
          content:
            'Capstone projects: (1) Enterprise Document Q&A RAG System, (2) AI Research Agent with web search and tool use, (3) Personalized Content Generator for marketing, (4) AI Code Review Assistant, (5) Multi-modal product description generator. Portfolio building and deployment.',
          videoUrl: 'https://www.youtube.com/watch?v=qv2Ix7_Z2xA',
          duration: '90 min',
        },
      ],
    },
  ],
};

// ─── Cyber Security ───────────────────────────────────────────────────────────

const cyberSecurityCourse: CourseDef = {
  domain: 'Cyber Security',
  title: 'Cyber Security Training Program',
  description:
    'Industry-Oriented Cyber Security Course — 120 Hours. Master Networking, Ethical Hacking, Penetration Testing, Web App Security, SOC Operations, Digital Forensics, Cloud Security, and Security Automation with real lab environments.',
  duration: '120 Hours',
  difficulty: 'Intermediate',
  learningOutcomes: [
    'Perform professional penetration testing using industry tools',
    'Analyze network traffic and detect intrusions with Wireshark and Nmap',
    'Test web applications for OWASP Top 10 vulnerabilities using Burp Suite',
    'Operate a Security Operations Center (SOC) with Splunk',
    'Conduct digital forensic investigations with Autopsy and Volatility',
    'Automate security tasks with Python scripting',
  ],
  modules: [
    {
      order: 1,
      title: 'Introduction to Cyber Security',
      description: 'Cyber security fundamentals, threat landscape, and career paths.',
      lessons: [
        {
          order: 1,
          title: 'Cyber Security Full Course — CIA Triad, Threats & Frameworks',
          content:
            'CIA Triad: Confidentiality, Integrity, Availability. Types of cyber threats: malware, ransomware, phishing, social engineering. Cyber security domains: Network, Application, Cloud, Endpoint. Ethical Hacking vs Cybercrime. Career paths: SOC Analyst, Pen Tester, Security Engineer. Frameworks: NIST, ISO 27001, OWASP. Kali Linux setup.',
          videoUrl: 'https://www.youtube.com/watch?v=U_P23SqJaDc',
          duration: '55 min',
        },
      ],
    },
    {
      order: 2,
      title: 'Networking Fundamentals for Security',
      description: 'Deep dive into networking protocols and packet analysis.',
      lessons: [
        {
          order: 1,
          title: 'Networking Full Course — OSI Model, TCP/IP, Wireshark & Nmap',
          content:
            'OSI Model (7 layers) and TCP/IP stack. IP addressing, subnetting, CIDR, VLANs. DNS, DHCP, HTTP/HTTPS, FTP, SSH protocols. Common ports. Firewall, IDS/IPS, WAF concepts. Wireshark packet capture and filtering. Nmap network scanning techniques.',
          videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
          duration: '60 min',
        },
      ],
    },
    {
      order: 3,
      title: 'Linux and Windows Security',
      description: 'Harden Linux and Windows systems against attacks.',
      lessons: [
        {
          order: 1,
          title: 'Linux Security — File Permissions, User Management & Shell Scripting',
          content:
            'Linux filesystem hierarchy, essential commands, shell scripting. File permissions: chmod, chown, SUID/SGID, ACLs. User management: useradd, sudo, /etc/passwd, /etc/shadow. Windows Active Directory, Group Policies, NTLM/Kerberos. Log monitoring: Event Viewer, syslog. Security hardening checklists.',
          videoUrl: 'https://www.youtube.com/watch?v=sWbUDq4S6Y8',
          duration: '60 min',
        },
      ],
    },
    {
      order: 4,
      title: 'Ethical Hacking & Penetration Testing',
      description: 'Learn professional penetration testing methodology using industry tools.',
      lessons: [
        {
          order: 1,
          title: 'Ethical Hacking Full Course — Recon, Exploitation & Reporting',
          content:
            'Penetration testing methodology: Planning, Reconnaissance, Scanning, Exploitation, Post-Exploitation, Reporting. OSINT, Google Dorking, Maltego. CVEs and vulnerability assessment. Privilege escalation techniques. Metasploit Framework hands-on. Professional penetration test report writing.',
          videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
          duration: '60 min',
        },
      ],
    },
    {
      order: 5,
      title: 'Web Application Security',
      description: 'Test and secure web applications against OWASP Top 10 vulnerabilities.',
      lessons: [
        {
          order: 1,
          title: 'Web App Security — OWASP Top 10, SQLi, XSS & Burp Suite',
          content:
            'OWASP Top 10 (2021): Injection, Broken Auth, XSS, IDOR, Misconfiguration. SQL Injection: Union-based, Blind, Time-based. XSS: Reflected, Stored, DOM-based. CSRF, session management attacks. DVWA lab exploitation. Burp Suite intercepting, scanning, and exploiting. Secure coding practices.',
          videoUrl: 'https://www.youtube.com/watch?v=WtHnT73NaaQ',
          duration: '60 min',
        },
      ],
    },
    {
      order: 6,
      title: 'SOC Fundamentals',
      description: 'Operate a Security Operations Center and respond to alerts.',
      lessons: [
        {
          order: 1,
          title: 'SOC Analyst Course — Splunk, Log Analysis & Incident Triage',
          content:
            'SOC structure: Tier 1, 2, 3 Analysts. SIEM concepts: log aggregation, correlation rules. Splunk basics: search, dashboards, alerts. MITRE ATT&CK framework for threat intelligence. Alert triage, true positives vs false positives. Incident response playbooks and escalation procedures.',
          videoUrl: 'https://www.youtube.com/watch?v=Z13slYLAoAg',
          duration: '55 min',
        },
      ],
    },
    {
      order: 7,
      title: 'Digital Forensics & Incident Response',
      description: 'Investigate cyber incidents and collect digital evidence.',
      lessons: [
        {
          order: 1,
          title: 'Digital Forensics — Evidence Collection, Memory Analysis & Autopsy',
          content:
            'Digital forensics process: identification, preservation, collection, analysis, reporting. Evidence collection with write blockers, chain of custody. Memory forensics with Volatility (process analysis, network connections). Disk forensics with Autopsy: deleted file recovery, timeline analysis. Incident response lifecycle.',
          videoUrl: 'https://www.youtube.com/watch?v=wnlI1LjJF3g',
          duration: '55 min',
        },
      ],
    },
    {
      order: 8,
      title: 'Cloud Security Fundamentals',
      description: 'Secure AWS and Azure environments against cloud-specific threats.',
      lessons: [
        {
          order: 1,
          title: 'Cloud Security — AWS IAM, VPC, Security Groups & Compliance',
          content:
            'Cloud computing: IaaS, PaaS, SaaS, shared responsibility model. AWS Security: VPC, Security Groups, NACLs, IAM policies, least privilege. Azure Security: Azure AD, NSGs, Azure Security Center. Cloud threats: S3 misconfiguration, excessive permissions, API abuse. Data protection: encryption at rest/transit, CloudTrail. GDPR, SOC2, PCI-DSS compliance.',
          videoUrl: 'https://www.youtube.com/watch?v=Kx0-P2m-GKs',
          duration: '55 min',
        },
      ],
    },
    {
      order: 9,
      title: 'Cyber Security Automation & AI',
      description: 'Automate security tasks and leverage AI for threat detection.',
      lessons: [
        {
          order: 1,
          title: 'Python for Cyber Security — Security Scripts, SOAR & AI Threat Detection',
          content:
            'Python for security: scripting for automation, API integration, log parsing. Security scripts: port scanner, password checker, log analyzer, hash identifier. SOAR concepts: integrating security tools via APIs. AI in cyber security: ML for anomaly detection, UEBA. ChatGPT for phishing detection and report generation.',
          videoUrl: 'https://www.youtube.com/watch?v=bMZpDPNPuoA',
          duration: '55 min',
        },
      ],
    },
    {
      order: 10,
      title: 'Capstone Project & Career Preparation',
      description: 'Complete real security assessments and prepare for certifications.',
      lessons: [
        {
          order: 1,
          title: 'Cyber Security Capstone — Penetration Test, SOC Dashboard & Career Prep',
          content:
            'Capstone projects: Complete Web Application Penetration Test Report (OWASP methodology), Network Security Monitoring System with Splunk, Python-based Phishing Detection System, Password Strength Analyzer. Career preparation: Resume for Cyber Security roles, CEH/OSCP/CompTIA Security+ certification roadmap, Mock technical interviews.',
          videoUrl: 'https://www.youtube.com/watch?v=ULGILG-ZhO0',
          duration: '90 min',
        },
      ],
    },
  ],
};

// ─── Digital Marketing ────────────────────────────────────────────────────────

const digitalMarketingCourse: CourseDef = {
  domain: 'Digital Marketing',
  title: 'Digital Marketing Professional Training Program',
  description:
    'Industry-Oriented Digital Marketing Course — 120 Hours. Master SEO, Google Ads, Meta Ads, Social Media Marketing, Content Marketing, Email Automation, and Analytics through live campaigns and a capstone project.',
  duration: '120 Hours',
  difficulty: 'Beginner',
  learningOutcomes: [
    'Plan and execute end-to-end digital marketing campaigns',
    'Optimize websites for search engines with proven SEO techniques',
    'Run profitable Google Search and Display ad campaigns',
    'Create targeted Meta (Facebook/Instagram) advertising campaigns',
    'Analyze campaign performance with Google Analytics 4 and Looker Studio',
    'Design email marketing sequences and automation workflows',
  ],
  modules: [
    {
      order: 1,
      title: 'Introduction to Digital Marketing',
      description: 'Digital marketing channels, career paths, and strategy fundamentals.',
      lessons: [
        {
          order: 1,
          title: 'Digital Marketing Full Course — Channels, SMART Goals & Career Paths',
          content:
            'Overview of Digital Marketing and the digital ecosystem. Traditional vs Digital Marketing. Key channels: SEO, SEM, Social Media, Email, Content, Affiliate. Setting SMART Goals and KPIs. Career paths: SEO Specialist, PPC Manager, Social Media Manager, Content Strategist, Digital Marketing Manager.',
          videoUrl: 'https://www.youtube.com/watch?v=bixR-KIJKYM',
          duration: '55 min',
        },
      ],
    },
    {
      order: 2,
      title: 'Website Creation & Optimization',
      description: 'Build and optimize websites for conversion and user experience.',
      lessons: [
        {
          order: 1,
          title: 'WordPress & Landing Page Optimization — CRO & Core Web Vitals',
          content:
            'Domain registration, web hosting. WordPress theme customization, Elementor page builder. Landing page best practices: above-the-fold, CTAs, visual hierarchy. Core Web Vitals and page speed optimization. Conversion Rate Optimization (CRO): A/B testing with Google Optimize, heatmaps with Hotjar.',
          videoUrl: 'https://www.youtube.com/watch?v=pqmcf2BHRFM',
          duration: '55 min',
        },
      ],
    },
    {
      order: 3,
      title: 'Search Engine Optimization (SEO)',
      description: 'Rank higher on Google with technical and content SEO strategies.',
      lessons: [
        {
          order: 1,
          title: 'SEO Full Course — On-Page, Off-Page, Technical SEO & Keyword Research',
          content:
            'On-Page SEO: meta tags, heading structure, keyword density, internal linking. Off-Page SEO: backlink building, domain authority, guest posting. Technical SEO: site speed, mobile-first indexing, structured data, XML sitemaps. Keyword research with Ahrefs, SEMrush, Google Keyword Planner. SEO audit process.',
          videoUrl: 'https://www.youtube.com/watch?v=xsVTqzratPs',
          duration: '60 min',
        },
      ],
    },
    {
      order: 4,
      title: 'Social Media Marketing',
      description: 'Build brand presence and community across social platforms.',
      lessons: [
        {
          order: 1,
          title: 'Social Media Marketing — Strategy, Content & Analytics',
          content:
            'Platform-specific strategies: LinkedIn (B2B), Instagram (visual), Facebook (community), YouTube (video SEO). Content calendars and scheduling with Buffer/Hootsuite. Community management, influencer marketing. Social media analytics: engagement rate, reach, impressions. Organic vs paid social strategies.',
          videoUrl: 'https://www.youtube.com/watch?v=F9bMCQIJ-vM',
          duration: '55 min',
        },
      ],
    },
    {
      order: 5,
      title: 'Google Ads (PPC)',
      description: 'Run profitable Google Search and Display advertising campaigns.',
      lessons: [
        {
          order: 1,
          title: 'Google Ads Full Course — Search, Display, Smart Bidding & Optimization',
          content:
            'Google Ads account structure: Campaigns, Ad Groups, Keywords, Ads. Search vs Display Network. Keyword match types: Broad, Phrase, Exact, Negative. Quality Score, Ad Rank, CPC bidding. Ad copywriting: headlines, descriptions, extensions. Smart Bidding: Target CPA, ROAS. Performance metrics: CTR, CPC, ROAS. A/B testing ads.',
          videoUrl: 'https://www.youtube.com/watch?v=MHse3M0jzB0',
          duration: '60 min',
        },
      ],
    },
    {
      order: 6,
      title: 'Meta Ads — Facebook & Instagram',
      description: 'Create and optimize Meta advertising campaigns for every objective.',
      lessons: [
        {
          order: 1,
          title: 'Meta Ads Masterclass — Facebook & Instagram Advertising',
          content:
            'Meta Business Suite and Ads Manager. Campaign objectives: Awareness, Traffic, Leads, Sales. Audience targeting: demographics, interests, Custom Audiences, Lookalike Audiences. Ad formats: Image, Video, Carousel, Stories, Reels. Facebook Pixel and retargeting. Campaign Budget Optimization. ROAS measurement and attribution models.',
          videoUrl: 'https://www.youtube.com/watch?v=ZNRzN7K_JDA',
          duration: '60 min',
        },
      ],
    },
    {
      order: 7,
      title: 'Content Marketing',
      description: 'Build authority and drive traffic through strategic content creation.',
      lessons: [
        {
          order: 1,
          title: 'Content Marketing Strategy — Blogs, Video & Distribution',
          content:
            'Content marketing strategy: audience definition, goal setting, channel selection. Content types: blogs, infographics, videos, podcasts, whitepapers, case studies. SEO-driven blog writing and content clusters. Video for YouTube and social media. Content distribution: owned, earned, paid channels. Measuring content ROI.',
          videoUrl: 'https://www.youtube.com/watch?v=5KpDQWFbvRo',
          duration: '55 min',
        },
      ],
    },
    {
      order: 8,
      title: 'Email Marketing & Automation',
      description: 'Build email lists and automate customer journeys for revenue.',
      lessons: [
        {
          order: 1,
          title: 'Email Marketing Full Course — Campaigns, Automation & Deliverability',
          content:
            'Email marketing fundamentals: list building, GDPR compliance, opt-in strategies. Campaign types: newsletters, promotional, welcome series, re-engagement. Mailchimp/ActiveCampaign: segmentation, templates, scheduling. A/B testing for subject lines and CTAs. Marketing automation: drip campaigns, behavioral triggers. Email analytics: open rate, click rate, conversions.',
          videoUrl: 'https://www.youtube.com/watch?v=sUHLMSCKROA',
          duration: '55 min',
        },
      ],
    },
    {
      order: 9,
      title: 'Analytics & Reporting',
      description: 'Make data-driven decisions with Google Analytics 4 and Looker Studio.',
      lessons: [
        {
          order: 1,
          title: 'Google Analytics 4 Full Course — Events, Conversions & Dashboards',
          content:
            'GA4 setup: events, parameters, conversions. Audience reports, acquisition channels, behavior flow. UTM parameters for campaign tracking. Google Search Console: keyword performance, index coverage. Looker Studio marketing dashboards. Attribution models and funnel analysis. Data-driven decision making.',
          videoUrl: 'https://www.youtube.com/watch?v=d4MkHFcMfos',
          duration: '55 min',
        },
      ],
    },
    {
      order: 10,
      title: 'Capstone — Full Digital Marketing Campaign',
      description: 'Execute a complete multi-channel campaign and build your portfolio.',
      lessons: [
        {
          order: 1,
          title: 'Digital Marketing Capstone — Multi-Channel Campaign Execution',
          content:
            'End-to-end digital marketing campaign: Strategy → Execution → Measurement → Optimization. Multi-channel: SEO content piece, social media posts (7 days), Google/Meta ad mockup, email newsletter, GA4 analytics report. Portfolio building: documenting campaigns, results, and learnings for job applications.',
          videoUrl: 'https://www.youtube.com/watch?v=SFLJolO_5zk',
          duration: '90 min',
        },
      ],
    },
  ],
};

// ─── Data Analytics ───────────────────────────────────────────────────────────

const dataAnalyticsCourse: CourseDef = {
  domain: 'Data Analytics',
  title: 'Data Analytics Training Program',
  description:
    'Industry-Oriented Data Analytics Course — 120 Hours. Master Excel, SQL, Python (Pandas), Power BI, Tableau, and statistical analysis to extract actionable business insights from data.',
  duration: '120 Hours',
  difficulty: 'Beginner',
  learningOutcomes: [
    'Clean and transform raw datasets using Excel and Python Pandas',
    'Write complex SQL queries for business data extraction',
    'Create interactive dashboards with Power BI and Tableau',
    'Apply statistical analysis to derive business insights',
    'Perform exploratory data analysis (EDA) on real datasets',
    'Present data-driven recommendations to stakeholders',
  ],
  modules: [
    {
      order: 1,
      title: 'Introduction to Data Analytics',
      description: 'Data analytics fundamentals, career paths, and the analytics workflow.',
      lessons: [
        {
          order: 1,
          title: 'Data Analytics Full Course — What is Data Analytics & Career Paths',
          content:
            'What is data analytics and why it matters. Types: Descriptive, Diagnostic, Predictive, Prescriptive. Data analytics workflow: business question → data collection → cleaning → analysis → visualization → insights. Career paths: Data Analyst, Business Analyst, BI Developer. Tools overview: Excel, SQL, Python, Power BI, Tableau.',
          videoUrl: 'https://www.youtube.com/watch?v=yZvFH7B6gKI',
          duration: '50 min',
        },
      ],
    },
    {
      order: 2,
      title: 'Excel for Data Analytics',
      description: 'Master Excel for data cleaning, analysis, and visualization.',
      lessons: [
        {
          order: 1,
          title: 'Excel for Data Analysis — Pivot Tables, VLOOKUP & Power Query',
          content:
            'Excel fundamentals: formulas, functions, conditional formatting. Pivot Tables and Pivot Charts for summarization. VLOOKUP, INDEX-MATCH, IF, SUMIFS, COUNTIFS. Data cleaning with Power Query. Statistical functions: AVERAGE, STDEV, CORREL. Dashboard creation with charts and slicers.',
          videoUrl: 'https://www.youtube.com/watch?v=WZ5KLBM-_GE',
          duration: '55 min',
        },
      ],
    },
    {
      order: 3,
      title: 'SQL for Data Analytics',
      description: 'Extract and analyze data from relational databases with SQL.',
      lessons: [
        {
          order: 1,
          title: 'SQL Full Course for Data Analysts — Joins, CTEs & Window Functions',
          content:
            'SQL fundamentals: SELECT, WHERE, GROUP BY, ORDER BY, HAVING. Joins: INNER, LEFT, RIGHT, FULL OUTER. Subqueries and CTEs (WITH clauses). Window functions: ROW_NUMBER, RANK, LEAD, LAG, SUM OVER. Aggregate functions for business metrics. Real-world queries: customer segmentation, sales analysis, cohort analysis.',
          videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
          duration: '60 min',
        },
      ],
    },
    {
      order: 4,
      title: 'Python for Data Analytics',
      description: 'Analyze and visualize data with Python, Pandas, and Matplotlib.',
      lessons: [
        {
          order: 1,
          title: 'Python Data Analysis — Pandas, NumPy & EDA',
          content:
            'Python basics for analytics: data structures, functions, file I/O. Pandas DataFrames: loading CSV/Excel, data cleaning, filtering, groupby, merging. NumPy for numerical operations. Exploratory Data Analysis (EDA) workflow. Matplotlib and Seaborn for visualizations: histograms, scatter plots, heatmaps, box plots.',
          videoUrl: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
          duration: '60 min',
        },
      ],
    },
    {
      order: 5,
      title: 'Statistics for Data Analytics',
      description: 'Apply statistics to describe, infer, and forecast from data.',
      lessons: [
        {
          order: 1,
          title: 'Statistics for Data Analytics — Descriptive, Inferential & Regression',
          content:
            'Descriptive statistics: mean, median, mode, variance, standard deviation, percentiles. Probability distributions: normal, binomial, Poisson. Inferential statistics: hypothesis testing, t-tests, chi-square, ANOVA. Correlation and linear regression for forecasting. P-values and confidence intervals.',
          videoUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28',
          duration: '55 min',
        },
      ],
    },
    {
      order: 6,
      title: 'Power BI',
      description: 'Build interactive business intelligence dashboards with Power BI.',
      lessons: [
        {
          order: 1,
          title: 'Power BI Full Course — DAX, Data Modeling & Interactive Dashboards',
          content:
            'Power BI Desktop: data import, Power Query transformations, data modeling. DAX (Data Analysis Expressions): calculated columns, measures, time intelligence. Report design: slicers, drill-through, bookmarks, tooltip pages. Publishing to Power BI Service and sharing dashboards. Real-world project: Sales Performance Dashboard.',
          videoUrl: 'https://www.youtube.com/watch?v=TmhQCQr_JGY',
          duration: '60 min',
        },
      ],
    },
    {
      order: 7,
      title: 'Tableau',
      description: 'Create stunning interactive data visualizations with Tableau.',
      lessons: [
        {
          order: 1,
          title: 'Tableau Full Course — Charts, Dashboards & Tableau Public',
          content:
            'Tableau Desktop interface, data connections. Dimensions vs Measures, continuous vs discrete. Building charts: bar, line, scatter, map, treemap, Gantt, bullet. Calculated fields, table calculations, LOD expressions. Dashboard and story creation. Tableau Public for portfolio sharing. Real-world project: Customer Insights Dashboard.',
          videoUrl: 'https://www.youtube.com/watch?v=jEgVto5QME8',
          duration: '60 min',
        },
      ],
    },
    {
      order: 8,
      title: 'Advanced Data Analysis Techniques',
      description: 'Apply advanced analytical methods for deeper business insights.',
      lessons: [
        {
          order: 1,
          title: 'Advanced Analytics — Cohort Analysis, Forecasting & A/B Testing',
          content:
            'Cohort analysis for customer retention. Time series analysis and forecasting (moving averages, exponential smoothing). A/B testing: experiment design, sample size calculation, statistical significance. Customer segmentation with RFM analysis. Funnel analysis and conversion optimization. Building KPI frameworks.',
          videoUrl: 'https://www.youtube.com/watch?v=6F8QgG5K5eM',
          duration: '55 min',
        },
      ],
    },
    {
      order: 9,
      title: 'Data Storytelling & Communication',
      description: 'Present data insights effectively to business stakeholders.',
      lessons: [
        {
          order: 1,
          title: 'Data Storytelling — Visualization Best Practices & Executive Reporting',
          content:
            'Principles of effective data visualization: chart selection, color, typography, layout. Data storytelling: framing, narrative structure, executive summaries. Choosing the right chart for the right question. Avoiding misleading visualizations. Creating data-driven presentations in PowerPoint and Google Slides. Presenting insights to C-suite.',
          videoUrl: 'https://www.youtube.com/watch?v=WkBQ1aCjfIY',
          duration: '50 min',
        },
      ],
    },
    {
      order: 10,
      title: 'Capstone Project — End-to-End Data Analysis',
      description: 'Solve a real business problem with a complete analytics project.',
      lessons: [
        {
          order: 1,
          title: 'Data Analytics Capstone — SQL + Python + Power BI End-to-End Project',
          content:
            'End-to-end analytics project: business problem definition → data collection (SQL) → data cleaning (Python/Pandas) → EDA → statistical analysis → dashboard (Power BI/Tableau) → presentation. Capstone projects: E-commerce Sales Analysis, HR Employee Attrition Dashboard, Financial KPI Report, Marketing Campaign ROI Analysis, Supply Chain Optimization.',
          videoUrl: 'https://www.youtube.com/watch?v=OEZU0G0LVEQ',
          duration: '90 min',
        },
      ],
    },
  ],
};

// ─── Course Seeding Logic ─────────────────────────────────────────────────────

async function getOrCreateCoordinator() {
  // Find any existing PROJECT_COORDINATOR to assign courses to
  const coordinator = await prisma.user.findFirst({
    where: { role: Role.PROJECT_COORDINATOR },
  });
  if (coordinator) return coordinator;

  // If no coordinator, find admin as fallback
  const admin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (admin) return admin;

  throw new Error('No PROJECT_COORDINATOR or ADMIN user found. Run seed-db.ts first.');
}

async function seedCourse(courseDef: CourseDef, coordinatorId: string) {
  console.log(`\n📚 Processing course: ${courseDef.title} (${courseDef.domain})...`);

  // 1. Upsert the course
  let course = await prisma.course.findFirst({
    where: { domain: courseDef.domain },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: courseDef.title,
        description: courseDef.description,
        domain: courseDef.domain,
        duration: courseDef.duration,
        difficulty: courseDef.difficulty,
        category: courseDef.domain,
        learningOutcomes: courseDef.learningOutcomes as any,
        status: 'Published',
        projectCoordinatorId: coordinatorId,
      },
    });
    console.log(`  ✅ Created course: "${course.title}" (${course.id})`);
  } else {
    course = await prisma.course.update({
      where: { id: course.id },
      data: {
        title: courseDef.title,
        description: courseDef.description,
        duration: courseDef.duration,
        difficulty: courseDef.difficulty,
        learningOutcomes: courseDef.learningOutcomes as any,
        status: 'Published',
      },
    });
    console.log(`  ✅ Found existing course: "${course.title}" (${course.id})`);
  }

  // 2. Process each module
  for (const moduleDef of courseDef.modules) {
    // Check if module already exists (by title + courseId)
    let mod = await prisma.module.findFirst({
      where: { courseId: course.id, title: moduleDef.title },
    });

    if (!mod) {
      mod = await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleDef.title,
          description: moduleDef.description,
          order: moduleDef.order,
        },
      });
      console.log(`    ✅ Created module ${moduleDef.order}: "${moduleDef.title}"`);
    } else {
      mod = await prisma.module.update({
        where: { id: mod.id },
        data: {
          description: moduleDef.description,
          order: moduleDef.order,
        },
      });
      console.log(`    ℹ️  Module already exists: "${moduleDef.title}"`);
    }

    // 3. Process each lesson in this module
    for (const lessonDef of moduleDef.lessons) {
      const existingLesson = await prisma.lesson.findFirst({
        where: { courseId: course.id, moduleId: mod.id, title: lessonDef.title },
      });

      if (!existingLesson) {
        await prisma.lesson.create({
          data: {
            courseId: course.id,
            moduleId: mod.id,
            weekId: mod.id, // keep weekId in sync for backward compat
            title: lessonDef.title,
            content: lessonDef.content,
            videoUrl: lessonDef.videoUrl,
            duration: lessonDef.duration,
            order: lessonDef.order,
          },
        });
        console.log(`      ✅ Created lesson: "${lessonDef.title}"`);
      } else {
        // Update video URL and content if they've changed
        await prisma.lesson.update({
          where: { id: existingLesson.id },
          data: {
            videoUrl: lessonDef.videoUrl,
            content: lessonDef.content,
            duration: lessonDef.duration,
            order: lessonDef.order,
          },
        });
        console.log(`      ℹ️  Lesson already exists (updated): "${lessonDef.title}"`);
      }
    }
  }

  // 4. Sync course.weeks JSON for backward compatibility
  const allModules = await prisma.module.findMany({
    where: { courseId: course.id },
    orderBy: { order: 'asc' },
  });
  const weeksJson = allModules.map((m, idx) => ({
    id: m.id,
    number: idx + 1,
    title: m.title,
  }));
  await prisma.course.update({
    where: { id: course.id },
    data: { weeks: weeksJson as any },
  });
  console.log(`  ✅ Synced ${allModules.length} modules to course.weeks JSON`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting comprehensive course content seeding...\n');

  const coordinator = await getOrCreateCoordinator();
  console.log(`👤 Using coordinator: ${coordinator.name} (${coordinator.email})\n`);

  const courses: CourseDef[] = [
    fullStackCourse,
    mlCourse,
    genaiCourse,
    cyberSecurityCourse,
    digitalMarketingCourse,
    dataAnalyticsCourse,
  ];

  for (const courseDef of courses) {
    await seedCourse(courseDef, coordinator.id);
  }

  console.log('\n🎉 All courses seeded successfully!');
  console.log(`   Total courses: ${courses.length}`);
  console.log(`   All modules and lessons are stored permanently in Supabase.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
