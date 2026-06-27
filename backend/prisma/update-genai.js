"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const genaiModules = [
    { id: 'genai_m1', number: 1, title: 'Introduction to Artificial Intelligence & Generative AI' },
    { id: 'genai_m2', number: 2, title: 'Large Language Models (LLMs)' },
    { id: 'genai_m3', number: 3, title: 'Prompt Engineering' },
    { id: 'genai_m4', number: 4, title: 'ChatGPT for Productivity' },
    { id: 'genai_m5', number: 5, title: 'AI Tools & Applications' },
    { id: 'genai_m6', number: 6, title: 'AI Image Generation' },
    { id: 'genai_m7', number: 7, title: 'AI Video Generation' },
    { id: 'genai_m8', number: 8, title: 'AI for Business Automation' },
    { id: 'genai_m9', number: 9, title: 'Python for Generative AI' },
    { id: 'genai_m10', number: 10, title: 'OpenAI API & LLM Integration' },
    { id: 'genai_m11', number: 11, title: 'Retrieval Augmented Generation (RAG)' },
    { id: 'genai_m12', number: 12, title: 'AI Agents' },
    { id: 'genai_m13', number: 13, title: 'LangChain Framework' },
    { id: 'genai_m14', number: 14, title: 'Generative AI Projects & Capstone' },
];
const genaiLessons = [
    {
        weekId: 'genai_m1',
        order: 1,
        title: 'Module 1: Introduction to Artificial Intelligence & Generative AI',
        content: 'Understand the foundations of Artificial Intelligence. History, evolution, and shift towards Generative AI. Explore neural networks, transformers, and self-attention mechanisms. Learn real-world generative AI use cases, ethics, and industry landscapes.',
        videoUrl: 'https://www.youtube.com/watch?v=2IK3DFHRFfw',
    },
    {
        weekId: 'genai_m2',
        order: 2,
        title: 'Module 2: Large Language Models (LLMs)',
        content: 'Deep dive into LLM architectures (GPT, LLaMA, Claude, Gemini). Tokenization, pre-training, fine-tuning, and Reinforcement Learning from Human Feedback (RLHF). Learn parameters, temperature, top-p, and context windows.',
        videoUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    },
    {
        weekId: 'genai_m3',
        order: 3,
        title: 'Module 3: Prompt Engineering',
        content: 'Master prompt design patterns. Learn Zero-shot, Few-shot, Chain-of-Thought, and React prompting. Study system instructions, prompt templates, few-shot demonstration selection, and safety guardrails.',
        videoUrl: 'https://www.youtube.com/watch?v=1bUy-1hGZpI',
    },
    {
        weekId: 'genai_m4',
        order: 4,
        title: 'Module 4: ChatGPT for Productivity',
        content: 'Unlock ChatGPT for professional writing, brainstorming, programming, data analysis, and task scheduling. Explore Advanced Data Analysis, custom GPT creation, and workspace integration workflows.',
        videoUrl: 'https://www.youtube.com/watch?v=sTeoEFzVNSc',
    },
    {
        weekId: 'genai_m5',
        order: 5,
        title: 'Module 5: AI Tools & Applications',
        content: 'Overview of the generative AI ecosystem. Explore AI writing assistants (Jasper, Copy.ai), design tools (Canva AI), coding companions (Copilot, Cursor), search assistants (Perplexity), and productivity integrations.',
        videoUrl: 'https://www.youtube.com/watch?v=JyOPfbSHb-k',
    },
    {
        weekId: 'genai_m6',
        order: 6,
        title: 'Module 6: AI Image Generation',
        content: 'Introduction to Midjourney, DALL-E 3, and Stable Diffusion. Learn prompt structures, aspect ratios, styling filters, seed parameters, inpainting, outpainting, and consistent characters.',
        videoUrl: 'https://www.youtube.com/watch?v=1CIpzeNxIhU',
    },
    {
        weekId: 'genai_m7',
        order: 7,
        title: 'Module 7: AI Video Generation',
        content: 'Explore text-to-video, image-to-video, and avatars. Learn tools like Runway Gen-2, Sora, Pika, and Synthesia. Scriptwriting, voiceover generation (ElevenLabs), and lipsync animations.',
        videoUrl: 'https://www.youtube.com/watch?v=vfX68E7IQMU',
    },
    {
        weekId: 'genai_m8',
        order: 8,
        title: 'Module 8: AI for Business Automation',
        content: 'Automate business funnels. Use Make.com and Zapier to connect OpenAI APIs with email, Google Sheets, Slack, and CRM systems. Build trigger-action loops and AI workflow automation pipelines.',
        videoUrl: 'https://www.youtube.com/watch?v=RWo2bQiuOqI',
    },
    {
        weekId: 'genai_m9',
        order: 9,
        title: 'Module 9: Python for Generative AI',
        content: 'Essential Python scripting for AI developers. Learn pip packaging, virtual environments, loading API keys securely, parsing HTTP responses, working with JSON, and asynchronous scripting.',
        videoUrl: 'https://www.youtube.com/watch?v=iyGHW4UQ_Ts',
    },
    {
        weekId: 'genai_m10',
        order: 10,
        title: 'Module 10: OpenAI API & LLM Integration',
        content: 'Integrate OpenAI GPT models into your applications. Master chat completion endpoints, system messages, function calling/tool usage, JSON mode, and counting tokens with tiktoken.',
        videoUrl: 'https://www.youtube.com/watch?v=OB99E7Y1cMA',
    },
    {
        weekId: 'genai_m11',
        order: 11,
        title: 'Module 11: Retrieval Augmented Generation (RAG)',
        content: 'Enhance LLMs with external data. Learn vector embeddings, text chunking strategies, vector databases (Chroma, Pinecone, FAISS), and semantic search query loops to generate grounded answers.',
        videoUrl: 'https://www.youtube.com/watch?v=sVcwVQRHIc8',
    },
    {
        weekId: 'genai_m12',
        order: 12,
        title: 'Module 12: AI Agents',
        content: 'Understand agentic design patterns. Learn loops, planning, reflection, and task breakdown. Explore autonomous tool selection, multi-agent frameworks (CrewAI, AutoGen), and goal-driven execution.',
        videoUrl: 'https://www.youtube.com/watch?v=aqzxhBIXY_g',
    },
    {
        weekId: 'genai_m13',
        order: 13,
        title: 'Module 13: LangChain Framework',
        content: 'Introduction to LangChain. Master LCEL (LangChain Expression Language), PromptTemplates, Models, OutputParsers, Chains, Memory buffers, and retrieval loaders.',
        videoUrl: 'https://www.youtube.com/watch?v=aywZrzNaKjs',
    },
    {
        weekId: 'genai_m14',
        order: 14,
        title: 'Module 14: Generative AI Projects & Capstone',
        content: 'Complete your professional portfolio. Review architecture design, prompt fine-tuning, security, rate-limiting, and web hosting. Engage in capstone project submission.',
        videoUrl: 'https://www.youtube.com/watch?v=1hX6Hoy9VVU',
    },
];
const genaiAssignments = [
    {
        weekId: 'genai_m3',
        title: 'Prompt Engineering Lab',
        instruction: 'Design a system prompt template for an automated customer support agent. Utilize few-shot prompting, input guardrails, and output structuring. Document prompt changes and output differences.',
        daysFromNow: 14,
    },
    {
        weekId: 'genai_m10',
        title: 'OpenAI API Integration Script',
        instruction: 'Write a Python program that calls the OpenAI chat completions API. Implement tool calling/function calling to query a database mock utility, returning structured JSON results.',
        daysFromNow: 21,
    },
    {
        weekId: 'genai_m11',
        title: 'Document Q&A RAG System',
        instruction: 'Build a local vector search pipeline using LangChain, an open-source embeddings model, and a vector DB (Chroma or FAISS). Load a custom document, retrieve sections, and generate responses.',
        daysFromNow: 28,
    },
    {
        weekId: 'genai_m14',
        title: 'Capstone Project Submission',
        instruction: 'Choose and build ONE of the following Capstone Projects:\n1. AI Resume Builder\n2. AI Content Generator\n3. AI Interview Assistant\n4. AI Customer Support Bot\n5. AI Knowledge Assistant\n\nSubmit a GitHub repository with clean code, setup instructions, and a 5-minute video walkthrough showcasing your working application.',
        daysFromNow: 42,
    },
];
const genaiQuizQuestions = [
    {
        id: 'q1',
        text: 'What is a Large Language Model (LLM)?',
        options: ['A model used to compress files', 'A neural network trained on vast text datasets to predict next tokens', 'A database indexing system', 'An image editing algorithm'],
        correctOption: 1,
    },
    {
        id: 'q2',
        text: 'Which prompt engineering technique provides a few input-output examples in the prompt?',
        options: ['Zero-shot prompting', 'Few-shot prompting', 'Chain-of-thought prompting', 'Instruction fine-tuning'],
        correctOption: 1,
    },
    {
        id: 'q3',
        text: 'What is Retrieval-Augmented Generation (RAG)?',
        options: ['A method to train larger models from scratch', 'A framework to enhance LLM responses using external data sources', 'An encryption protocol for model API endpoints', 'A tool to generate realistic AI videos'],
        correctOption: 1,
    },
    {
        id: 'q4',
        text: 'Which framework is widely used to build LLM-powered applications and agents?',
        options: ['Flask', 'LangChain', 'React.js', 'TensorFlow'],
        correctOption: 1,
    },
    {
        id: 'q5',
        text: 'What are AI Agents in the context of Generative AI?',
        options: ['Human trainers who annotate prompt datasets', 'Autonomous systems that use LLMs to plan and invoke tools to complete tasks', 'API keys used to authenticate requests', 'Virtual machines hosting deep learning models'],
        correctOption: 1,
    },
];
async function updateGenerativeAICourse() {
    console.log('\n🤖 Updating Generative AI course curriculum...\n');
    let course = await prisma.course.findFirst({
        where: {
            domain: {
                in: ['Generative AI', 'Gen AI'],
            },
        },
    });
    if (!course) {
        console.log('⚠️  No course found for domain: Generative AI or Gen AI. Creating it first...');
        const coordinator = await prisma.user.findFirst({
            where: {
                role: {
                    in: ['ADMIN', 'PROJECT_COORDINATOR'],
                },
            },
        });
        if (!coordinator) {
            console.log('❌ Cannot create course: No ADMIN or PROJECT_COORDINATOR user found in database to assign.');
            return;
        }
        course = await prisma.course.create({
            data: {
                title: 'Generative AI Training Program',
                description: 'Industry-Oriented Generative AI Course — 120 Hours. Master LLMs, Prompt Engineering, ChatGPT, AI Tools, Image & Video Generation, Business Automation, Python for GenAI, OpenAI API, RAG, AI Agents, and LangChain.',
                domain: 'Generative AI',
                duration: '120 Hours',
                status: 'Published',
                weeks: genaiModules,
                projectCoordinatorId: coordinator.id,
            },
        });
        console.log(`  ✅ Created new Generative AI course: "${course.title}" (${course.id})`);
    }
    else {
        console.log(`  ✅ Found course: "${course.title}" (${course.id})`);
        await prisma.lessonProgress.deleteMany({ where: { lesson: { courseId: course.id } } });
        await prisma.lesson.deleteMany({ where: { courseId: course.id } });
        await prisma.submission.deleteMany({ where: { assignment: { courseId: course.id } } });
        await prisma.assignment.deleteMany({ where: { courseId: course.id } });
        await prisma.quizResult.deleteMany({ where: { quiz: { courseId: course.id } } });
        await prisma.quiz.deleteMany({ where: { courseId: course.id } });
        console.log('  ✅ Cleared old content');
        await prisma.course.update({
            where: { id: course.id },
            data: {
                title: 'Generative AI Training Program',
                description: 'Industry-Oriented Generative AI Course — 120 Hours. Master LLMs, Prompt Engineering, ChatGPT, AI Tools, Image & Video Generation, Business Automation, Python for GenAI, OpenAI API, RAG, AI Agents, and LangChain.',
                domain: 'Generative AI',
                duration: '120 Hours',
                weeks: genaiModules,
                status: 'Published',
            },
        });
        console.log(`  ✅ Updated course to ${genaiModules.length} modules`);
    }
    for (const l of genaiLessons) {
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
    console.log(`  ✅ Created ${genaiLessons.length} lessons`);
    for (const a of genaiAssignments) {
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
    console.log(`  ✅ Created ${genaiAssignments.length} assignments`);
    await prisma.quiz.create({
        data: {
            title: 'Generative AI Training Program — Comprehensive Assessment Quiz',
            passingScore: 70,
            timeLimit: 30,
            courseId: course.id,
            weekId: 'genai_m14',
            questions: genaiQuizQuestions,
        },
    });
    console.log('  ✅ Created comprehensive assessment quiz');
    console.log('\n  🎉 Generative AI course fully updated with 14 modules, 14 lessons, 4 assignments & 1 quiz!\n');
}
updateGenerativeAICourse()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=update-genai.js.map