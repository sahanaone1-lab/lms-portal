"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const youtube_service_1 = require("../src/lessons/youtube.service");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const youtubeService = new youtube_service_1.YoutubeService();
async function ensureFullStackCourse(projectCoordinatorId) {
    const fsDomain = 'Full Stack';
    let course = await prisma.course.findFirst({
        where: {
            domain: {
                equals: fsDomain,
                mode: 'insensitive',
            },
        },
    });
    if (!course) {
        console.log(`\n🆕 "Full Stack" course not found. Seeding a new Full Stack Development course...`);
        const weeks = [
            { id: 'fs_mod_1', number: 1, title: 'Introduction to Web Development' },
            { id: 'fs_mod_2', number: 2, title: 'HTML & CSS Fundamentals' },
            { id: 'fs_mod_3', number: 3, title: 'JavaScript Programming Core' },
            { id: 'fs_mod_4', number: 4, title: 'React.js Frontend Development' },
            { id: 'fs_mod_5', number: 5, title: 'Node.js & Express API Backend' },
            { id: 'fs_mod_6', number: 6, title: 'Database Engineering with PostgreSQL' },
            { id: 'fs_mod_7', number: 7, title: 'Full Stack Capstone Project Work' }
        ];
        course = await prisma.course.create({
            data: {
                title: 'Full Stack Web Development Professional',
                description: 'Comprehensive curriculum covering HTML, CSS, JavaScript, React, Node.js, Express, and PostgreSQL database integration to build interactive modern web applications.',
                domain: fsDomain,
                duration: '120 Hours',
                status: 'Published',
                weeks: weeks,
                projectCoordinatorId,
            },
        });
        const lessons = [
            { title: 'Module 1: Introduction to Web Development', content: 'Web architecture overview. Client-server model, HTTP/HTTPS protocols, request-response cycle, domain names, DNS, and IP routing basics. Modern developer environment setup including VS Code and Git version control.', videoUrl: 'https://www.youtube.com/watch?v=gT0M3Ocl2mU', weekId: 'fs_mod_1', order: 1 },
            { title: 'Module 2: HTML & CSS Fundamentals', content: 'HTML5 semantic elements, layout design, forms, tables, media assets, lists, links. CSS3 styling: selectors, color palettes, typography, box model, Flexbox, Grid layout, media queries, and responsive web design.', videoUrl: 'https://www.youtube.com/watch?v=kUMe1FH4YZY', weekId: 'fs_mod_2', order: 2 },
            { title: 'Module 3: JavaScript Programming Core', content: 'JavaScript language basics: variables, data structures, type coercion, operators, arrays, conditional flow, loops, functions, scopes, DOM manipulation, asynchronous programming, fetch, and event handling.', videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', weekId: 'fs_mod_3', order: 3 },
            { title: 'Module 4: React.js Frontend Development', content: 'Introduction to React. Components, JSX syntax, props, states, component lifecycle, hooks (useState, useEffect, useContext), routing with React Router, API fetching, forms, events, and styling custom hooks.', videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', weekId: 'fs_mod_4', order: 4 },
            { title: 'Module 5: Node.js & Express API Backend', content: 'Node.js runtime environment, event loop, package manager npm. Express framework, route controllers, RESTful api principles, middleware architecture, request body parsing, authentication, and error handling.', videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', weekId: 'fs_mod_5', order: 5 },
            { title: 'Module 6: Database Engineering with PostgreSQL', content: 'Relational database concepts. SQL fundamentals: SELECT, JOINs, INSERT, UPDATE, DELETE queries. Database migration schemas, primary & foreign keys, indexing, and Prisma ORM integration with NestJS backend.', videoUrl: 'https://www.youtube.com/watch?v=fZqyIvV2OFI', weekId: 'fs_mod_6', order: 6 },
            { title: 'Module 7: Full Stack Capstone Project Work', content: 'Collaborate to build an end-to-end full stack web application incorporating frontend React UI, backend REST APIs, JWT authentication, and relational database persistence. Deploy frontend and backend live.', videoUrl: null, weekId: 'fs_mod_7', order: 7 }
        ];
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
        const interns = await prisma.user.findMany({
            where: {
                role: client_1.Role.INTERN,
                domain: {
                    equals: fsDomain,
                    mode: 'insensitive',
                },
            },
        });
        for (const intern of interns) {
            await prisma.enrollment.upsert({
                where: {
                    studentId_courseId: {
                        studentId: intern.id,
                        courseId: course.id,
                    },
                },
                update: {},
                create: {
                    studentId: intern.id,
                    courseId: course.id,
                },
            }).catch(() => { });
        }
        console.log(`  ✅ Full Stack course created and matching interns auto-enrolled!`);
    }
    else {
        console.log(`\n📚 "Full Stack" course already exists: "${course.title}" (${course.id})`);
    }
}
async function main() {
    console.log('🔍 Connecting to database and checking courses...\n');
    const projectCoordinator = await prisma.user.findFirst({
        where: { role: client_1.Role.PROJECT_COORDINATOR },
    });
    if (!projectCoordinator) {
        throw new Error('No project coordinator found in database to assign as owner of course.');
    }
    await ensureFullStackCourse(projectCoordinator.id);
    const lessons = await prisma.lesson.findMany({
        include: {
            course: true,
        },
    });
    console.log(`\n📊 Found ${lessons.length} total lessons in database. Starting video validation...`);
    let validCount = 0;
    let fixedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    for (const lesson of lessons) {
        if (!lesson.videoUrl) {
            console.log(`  ⚪ [SKIP] Lesson "${lesson.title}" has no video URL.`);
            skippedCount++;
            continue;
        }
        const videoId = youtubeService.extractVideoId(lesson.videoUrl);
        if (!videoId) {
            console.log(`  ⚪ [SKIP] Video URL for "${lesson.title}" is not a YouTube URL: ${lesson.videoUrl}`);
            skippedCount++;
            continue;
        }
        console.log(`  🔍 [CHECK] Validating video for "${lesson.title}" (ID: ${videoId})...`);
        const validation = await youtubeService.validateUrl(lesson.videoUrl);
        if (validation.isValid) {
            console.log(`  🟢 [VALID] Video "${lesson.videoUrl}" is playable and embeddable.`);
            validCount++;
        }
        else {
            console.log(`  🔴 [BROKEN] Video "${lesson.videoUrl}" is unavailable: ${validation.reason}`);
            console.log(`    🔍 Searching for replacement covering topic: "${lesson.title}"`);
            const query = `${lesson.title} ${lesson.course.domain} tutorial in English`;
            const replacement = await youtubeService.searchAlternative(query);
            if (replacement) {
                await prisma.lesson.update({
                    where: { id: lesson.id },
                    data: { videoUrl: replacement.videoUrl },
                });
                console.log(`    🔵 [FIXED] Replaced with: "${replacement.title}" (${replacement.videoUrl})`);
                fixedCount++;
            }
            else {
                console.log(`    ❌ [FAILED] Could not find a valid replacement video for: "${lesson.title}"`);
                failedCount++;
            }
        }
    }
    console.log(`\n🎉 Verification & Cleanup Complete!`);
    console.log(`-----------------------------------`);
    console.log(`🟢 Valid videos:  ${validCount}`);
    console.log(`🔵 Replaced/Fixed: ${fixedCount}`);
    console.log(`🔴 Unresolved:    ${failedCount}`);
    console.log(`⚪ Skipped:       ${skippedCount}`);
}
main()
    .catch((e) => {
    console.error('Fatal error in database validation script:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=validate-videos.js.map