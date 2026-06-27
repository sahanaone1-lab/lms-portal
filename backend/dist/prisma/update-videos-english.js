"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const englishVideos = {
    'Data Science': {
        'python': 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        'numpy': 'https://www.youtube.com/watch?v=QUT1VHiLmmI',
        'pandas': 'https://www.youtube.com/watch?v=vmEHCJofslg',
        'eda': 'https://www.youtube.com/watch?v=xi0vhXFPegw',
        'matplotlib': 'https://www.youtube.com/watch?v=UO98lJQ3QGI',
        'visualization': 'https://www.youtube.com/watch?v=a9UrKTVEhZk',
    },
    'Machine Learning': {
        'introduction': 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
        'python': 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        'numpy_pandas': 'https://www.youtube.com/watch?v=vmEHCJofslg',
        'visualization': 'https://www.youtube.com/watch?v=UO98lJQ3QGI',
        'statistics': 'https://www.youtube.com/watch?v=xxpc-HPKN28',
        'supervised': 'https://www.youtube.com/watch?v=pqNCD_5r0IU',
        'unsupervised': 'https://www.youtube.com/watch?v=4b5d3muPQmA',
        'model_evaluation': 'https://www.youtube.com/watch?v=85dtiMz9tSo',
        'deep_learning': 'https://www.youtube.com/watch?v=aircAruvnKk',
        'deployment': 'https://www.youtube.com/watch?v=mrExsjcvF4o',
    },
    'Full Stack': {
        'web_intro': 'https://www.youtube.com/watch?v=EqzUcMzfB1s',
        'html_css': 'https://www.youtube.com/watch?v=mU6anWqZJcc',
        'javascript': 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        'react': 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        'node_express': 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        'database': 'https://www.youtube.com/watch?v=qw--VYLpxG4',
        'capstone': 'https://www.youtube.com/watch?v=mrHNSanmqQ4',
    },
    'Cyber Security': {
        'introduction': 'https://www.youtube.com/watch?v=U_P23SqJaDc',
        'networking': 'https://www.youtube.com/watch?v=qiQR5rTSshw',
        'linux_windows': 'https://www.youtube.com/watch?v=sWbUDq4S6Y8',
        'ethical_hacking': 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
        'web_security': 'https://www.youtube.com/watch?v=WtHnT73NaaQ',
        'soc': 'https://www.youtube.com/watch?v=Z13slYLAoAg',
        'forensics': 'https://www.youtube.com/watch?v=wnlI1LjJF3g',
        'cloud_security': 'https://www.youtube.com/watch?v=Kx0-P2m-GKs',
        'automation': 'https://www.youtube.com/watch?v=bMZpDPNPuoA',
        'capstone': 'https://www.youtube.com/watch?v=ULGILG-ZhO0',
    },
    'Digital Marketing': {
        'introduction': 'https://www.youtube.com/watch?v=bixR-KIJKYM',
        'website': 'https://www.youtube.com/watch?v=pqmcf2BHRFM',
        'seo': 'https://www.youtube.com/watch?v=xsVTqzratPs',
        'social_media': 'https://www.youtube.com/watch?v=F9bMCQIJ-vM',
        'google_ads': 'https://www.youtube.com/watch?v=MHse3M0jzB0',
        'meta_ads': 'https://www.youtube.com/watch?v=ZNRzN7K_JDA',
        'content': 'https://www.youtube.com/watch?v=5KpDQWFbvRo',
        'email': 'https://www.youtube.com/watch?v=sUHLMSCKROA',
        'analytics': 'https://www.youtube.com/watch?v=d4MkHFcMfos',
        'capstone': 'https://www.youtube.com/watch?v=SFLJolO_5zk',
    },
    'Generative AI': {
        'intro_ai': 'https://www.youtube.com/watch?v=2IK3DFHRFfw',
        'llms': 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
        'prompt': 'https://www.youtube.com/watch?v=1bUy-1hGZpI',
        'chatgpt': 'https://www.youtube.com/watch?v=sTeoEFzVNSc',
        'ai_tools': 'https://www.youtube.com/watch?v=JyOPfbSHb-k',
        'image_gen': 'https://www.youtube.com/watch?v=1CIpzeNxIhU',
        'video_gen': 'https://www.youtube.com/watch?v=vfX68E7IQMU',
        'automation': 'https://www.youtube.com/watch?v=RWo2bQiuOqI',
        'python_genai': 'https://www.youtube.com/watch?v=iyGHW4UQ_Ts',
        'openai_api': 'https://www.youtube.com/watch?v=OB99E7Y1cMA',
        'rag': 'https://www.youtube.com/watch?v=sVcwVQRHIc8',
        'agents': 'https://www.youtube.com/watch?v=aqzxhBIXY_g',
        'langchain': 'https://www.youtube.com/watch?v=aywZrzNaKjs',
        'projects': 'https://www.youtube.com/watch?v=1hX6Hoy9VVU',
    },
};
function getVideoKeyFromTitle(title, domain) {
    const t = title.toLowerCase();
    if (domain === 'Data Science' || domain === 'Data Analytics') {
        if (t.includes('python'))
            return 'python';
        if (t.includes('numpy') || t.includes('pandas') || t.includes('core libraries'))
            return 'pandas';
        if (t.includes('eda') || t.includes('exploratory'))
            return 'eda';
        if (t.includes('matplotlib') || t.includes('seaborn') || t.includes('visualization'))
            return 'visualization';
        return 'python';
    }
    if (domain === 'Machine Learning') {
        if (t.includes('module 1') || t.includes('introduction'))
            return 'introduction';
        if (t.includes('module 2') || t.includes('python'))
            return 'python';
        if (t.includes('module 3') || t.includes('numpy') || t.includes('pandas'))
            return 'numpy_pandas';
        if (t.includes('module 4') || t.includes('visualization'))
            return 'visualization';
        if (t.includes('module 5') || t.includes('statistic'))
            return 'statistics';
        if (t.includes('module 6') || t.includes('supervised'))
            return 'supervised';
        if (t.includes('module 7') || t.includes('unsupervised'))
            return 'unsupervised';
        if (t.includes('module 8') || t.includes('evaluation') || t.includes('feature'))
            return 'model_evaluation';
        if (t.includes('module 9') || t.includes('deep learning'))
            return 'deep_learning';
        if (t.includes('module 10') || t.includes('deployment') || t.includes('capstone'))
            return 'deployment';
        return 'introduction';
    }
    if (domain === 'Full Stack') {
        if (t.includes('module 1') || t.includes('introduction') || t.includes('web dev'))
            return 'web_intro';
        if (t.includes('module 2') || t.includes('html') || t.includes('css'))
            return 'html_css';
        if (t.includes('module 3') || t.includes('javascript'))
            return 'javascript';
        if (t.includes('module 4') || t.includes('react'))
            return 'react';
        if (t.includes('module 5') || t.includes('node') || t.includes('express'))
            return 'node_express';
        if (t.includes('module 6') || t.includes('database') || t.includes('postgresql') || t.includes('sql'))
            return 'database';
        if (t.includes('module 7') || t.includes('capstone') || t.includes('project'))
            return 'capstone';
        return 'web_intro';
    }
    if (domain === 'Cyber Security') {
        if (t.includes('module 1') || t.includes('foundation') || t.includes('introduction'))
            return 'introduction';
        if (t.includes('module 2') || t.includes('networking'))
            return 'networking';
        if (t.includes('module 3') || t.includes('linux') || t.includes('windows'))
            return 'linux_windows';
        if (t.includes('module 4') || t.includes('ethical') || t.includes('penetration'))
            return 'ethical_hacking';
        if (t.includes('module 5') || t.includes('web') || t.includes('application security'))
            return 'web_security';
        if (t.includes('module 6') || t.includes('soc'))
            return 'soc';
        if (t.includes('module 7') || t.includes('forensic'))
            return 'forensics';
        if (t.includes('module 8') || t.includes('cloud'))
            return 'cloud_security';
        if (t.includes('module 9') || t.includes('automation') || t.includes('ai'))
            return 'automation';
        if (t.includes('module 10') || t.includes('capstone'))
            return 'capstone';
        return 'introduction';
    }
    if (domain === 'Digital Marketing') {
        if (t.includes('module 1') || t.includes('introduction'))
            return 'introduction';
        if (t.includes('module 2') || t.includes('website'))
            return 'website';
        if (t.includes('module 3') || t.includes('seo'))
            return 'seo';
        if (t.includes('module 4') || t.includes('social media'))
            return 'social_media';
        if (t.includes('module 5') || t.includes('google ads'))
            return 'google_ads';
        if (t.includes('module 6') || t.includes('meta') || t.includes('facebook'))
            return 'meta_ads';
        if (t.includes('module 7') || t.includes('content marketing'))
            return 'content';
        if (t.includes('module 8') || t.includes('email'))
            return 'email';
        if (t.includes('module 9') || t.includes('analytics'))
            return 'analytics';
        if (t.includes('module 10') || t.includes('capstone'))
            return 'capstone';
        return 'introduction';
    }
    if (t.includes('module 1') || t.includes('introduction to a'))
        return 'intro_ai';
    if (t.includes('module 2') || t.includes('large language') || t.includes('llm'))
        return 'llms';
    if (t.includes('module 3') || t.includes('prompt'))
        return 'prompt';
    if (t.includes('module 4') || t.includes('chatgpt'))
        return 'chatgpt';
    if (t.includes('module 5') || t.includes('ai tools'))
        return 'ai_tools';
    if (t.includes('module 6') || t.includes('image'))
        return 'image_gen';
    if (t.includes('module 7') || t.includes('video'))
        return 'video_gen';
    if (t.includes('module 8') || t.includes('automation') || t.includes('business'))
        return 'automation';
    if (t.includes('module 9') || t.includes('python'))
        return 'python_genai';
    if (t.includes('module 10') || t.includes('openai api'))
        return 'openai_api';
    if (t.includes('module 11') || t.includes('rag') || t.includes('retrieval'))
        return 'rag';
    if (t.includes('module 12') || t.includes('agent'))
        return 'agents';
    if (t.includes('module 13') || t.includes('langchain'))
        return 'langchain';
    if (t.includes('module 14') || t.includes('project'))
        return 'projects';
    return null;
}
async function main() {
    console.log('🎬 Updating all lesson videos to English-language YouTube links...\n');
    const lessons = await prisma.lesson.findMany({
        include: { course: { select: { domain: true, title: true } } },
    });
    console.log(`📊 Found ${lessons.length} total lessons in database.\n`);
    let updated = 0;
    let skipped = 0;
    for (const lesson of lessons) {
        const domain = lesson.course.domain;
        if (!lesson.videoUrl && lesson.title.includes('🏆') || lesson.title.includes('🛠') || lesson.title.includes('🎯')) {
            console.log(`  ⚪ [SKIP] "${lesson.title}" — no video needed`);
            skipped++;
            continue;
        }
        const domainVideos = englishVideos[domain] || englishVideos['Generative AI'];
        if (!domainVideos) {
            console.log(`  ⚠️  [SKIP] Unknown domain "${domain}" for lesson "${lesson.title}"`);
            skipped++;
            continue;
        }
        const videoKey = getVideoKeyFromTitle(lesson.title, domain);
        if (!videoKey || !domainVideos[videoKey]) {
            console.log(`  ⚪ [SKIP] No English video mapped for "${lesson.title}" (key: ${videoKey})`);
            skipped++;
            continue;
        }
        const newVideoUrl = domainVideos[videoKey];
        if (lesson.videoUrl === newVideoUrl) {
            console.log(`  ✅ [OK] "${lesson.title}" — already has correct English video`);
            skipped++;
            continue;
        }
        await prisma.lesson.update({
            where: { id: lesson.id },
            data: { videoUrl: newVideoUrl },
        });
        console.log(`  🔄 [UPDATED] "${lesson.title}"`);
        console.log(`     Old: ${lesson.videoUrl || '(none)'}`);
        console.log(`     New: ${newVideoUrl}`);
        updated++;
    }
    console.log(`\n🎉 Video update complete!`);
    console.log(`───────────────────────────`);
    console.log(`🔄 Updated: ${updated}`);
    console.log(`⚪ Skipped: ${skipped}`);
    console.log(`📊 Total:   ${lessons.length}`);
}
main()
    .catch((e) => { console.error('Error:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=update-videos-english.js.map