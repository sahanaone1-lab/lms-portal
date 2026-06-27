import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Curated English-language YouTube videos per domain & module ──────────────
// All videos are from well-known English-language creators:
// freeCodeCamp, Traversy Media, Programming with Mosh, Fireship, 3Blue1Brown,
// Simplilearn, Google, NetworkChuck, HubSpot, Ahrefs, Neil Patel, etc.

const englishVideos: Record<string, Record<string, string>> = {

  // ─── Data Science ──────────────────────────────────────────────────────────
  'Data Science': {
    'python':           'https://www.youtube.com/watch?v=rfscVS0vtbw',  // freeCodeCamp - Python Full Course
    'numpy':            'https://www.youtube.com/watch?v=QUT1VHiLmmI',  // freeCodeCamp - NumPy Full Course
    'pandas':           'https://www.youtube.com/watch?v=vmEHCJofslg',  // Keith Galli - Pandas Tutorial
    'eda':              'https://www.youtube.com/watch?v=xi0vhXFPegw',  // Rob Mulla - EDA in Python
    'matplotlib':       'https://www.youtube.com/watch?v=UO98lJQ3QGI',  // freeCodeCamp - Matplotlib
    'visualization':    'https://www.youtube.com/watch?v=a9UrKTVEhZk',  // Corey Schafer - Matplotlib
  },

  // ─── Machine Learning ──────────────────────────────────────────────────────
  'Machine Learning': {
    'introduction':     'https://www.youtube.com/watch?v=i_LwzRVP7bg',  // freeCodeCamp - ML for Everybody
    'python':           'https://www.youtube.com/watch?v=rfscVS0vtbw',  // freeCodeCamp - Learn Python
    'numpy_pandas':     'https://www.youtube.com/watch?v=vmEHCJofslg',  // Keith Galli - Pandas
    'visualization':    'https://www.youtube.com/watch?v=UO98lJQ3QGI',  // freeCodeCamp - Matplotlib
    'statistics':       'https://www.youtube.com/watch?v=xxpc-HPKN28',  // freeCodeCamp - Stats for Data Science
    'supervised':       'https://www.youtube.com/watch?v=pqNCD_5r0IU',  // freeCodeCamp - Supervised Learning
    'unsupervised':     'https://www.youtube.com/watch?v=4b5d3muPQmA',  // Simplilearn - Unsupervised Learning
    'model_evaluation': 'https://www.youtube.com/watch?v=85dtiMz9tSo',  // StatQuest - Cross Validation
    'deep_learning':    'https://www.youtube.com/watch?v=aircAruvnKk',  // 3Blue1Brown - Neural Networks
    'deployment':       'https://www.youtube.com/watch?v=mrExsjcvF4o',  // freeCodeCamp - Flask ML Deployment
  },

  // ─── Full Stack ────────────────────────────────────────────────────────────
  'Full Stack': {
    'web_intro':        'https://www.youtube.com/watch?v=EqzUcMzfB1s',  // freeCodeCamp - Web Dev Full Course
    'html_css':         'https://www.youtube.com/watch?v=mU6anWqZJcc',  // freeCodeCamp - HTML CSS Full Course
    'javascript':       'https://www.youtube.com/watch?v=PkZNo7MFNFg',  // freeCodeCamp - JavaScript Full Course
    'react':            'https://www.youtube.com/watch?v=bMknfKXIFA8',  // freeCodeCamp - React Full Course
    'node_express':     'https://www.youtube.com/watch?v=Oe421EPjeBE',  // freeCodeCamp - Node.js & Express
    'database':         'https://www.youtube.com/watch?v=qw--VYLpxG4',  // freeCodeCamp - PostgreSQL Tutorial
    'capstone':         'https://www.youtube.com/watch?v=mrHNSanmqQ4',  // Traversy Media - MERN Stack
  },

  // ─── Cyber Security ────────────────────────────────────────────────────────
  'Cyber Security': {
    'introduction':     'https://www.youtube.com/watch?v=U_P23SqJaDc',  // Simplilearn - Cybersecurity Full Course
    'networking':       'https://www.youtube.com/watch?v=qiQR5rTSshw',  // freeCodeCamp - Networking Full Course
    'linux_windows':    'https://www.youtube.com/watch?v=sWbUDq4S6Y8',  // freeCodeCamp - Linux Full Course
    'ethical_hacking':  'https://www.youtube.com/watch?v=3Kq1MIfTWCE',  // freeCodeCamp - Ethical Hacking
    'web_security':     'https://www.youtube.com/watch?v=WtHnT73NaaQ',  // Hackersploit - Web App Security
    'soc':              'https://www.youtube.com/watch?v=Z13slYLAoAg',  // Simplilearn - SOC Analyst
    'forensics':        'https://www.youtube.com/watch?v=wnlI1LjJF3g',  // 13Cubed - Digital Forensics Intro
    'cloud_security':   'https://www.youtube.com/watch?v=Kx0-P2m-GKs',  // Simplilearn - Cloud Security
    'automation':       'https://www.youtube.com/watch?v=bMZpDPNPuoA',  // NetworkChuck - Python for Security
    'capstone':         'https://www.youtube.com/watch?v=ULGILG-ZhO0',  // Simplilearn - Cybersecurity Projects
  },

  // ─── Digital Marketing ─────────────────────────────────────────────────────
  'Digital Marketing': {
    'introduction':     'https://www.youtube.com/watch?v=bixR-KIJKYM',  // Simplilearn - Digital Marketing Full Course
    'website':          'https://www.youtube.com/watch?v=pqmcf2BHRFM',  // freeCodeCamp - WordPress Full Course
    'seo':              'https://www.youtube.com/watch?v=xsVTqzratPs',  // Ahrefs - SEO Full Course
    'social_media':     'https://www.youtube.com/watch?v=F9bMCQIJ-vM',  // HubSpot - Social Media Marketing
    'google_ads':       'https://www.youtube.com/watch?v=MHse3M0jzB0',  // Surfside PPC - Google Ads Full Course
    'meta_ads':         'https://www.youtube.com/watch?v=ZNRzN7K_JDA',  // Surfside PPC - Facebook Ads
    'content':          'https://www.youtube.com/watch?v=5KpDQWFbvRo',  // Ahrefs - Content Marketing
    'email':            'https://www.youtube.com/watch?v=sUHLMSCKROA',  // HubSpot - Email Marketing
    'analytics':        'https://www.youtube.com/watch?v=d4MkHFcMfos',  // Google - GA4 Tutorial
    'capstone':         'https://www.youtube.com/watch?v=SFLJolO_5zk',  // Simplilearn - DM Case Study
  },

  // ─── Generative AI ─────────────────────────────────────────────────────────
  'Generative AI': {
    'intro_ai':         'https://www.youtube.com/watch?v=2IK3DFHRFfw',  // IBM - What is Gen AI
    'llms':             'https://www.youtube.com/watch?v=zjkBMFhNj_g',  // IBM - LLMs Explained
    'prompt':           'https://www.youtube.com/watch?v=1bUy-1hGZpI',  // freeCodeCamp - Prompt Engineering
    'chatgpt':          'https://www.youtube.com/watch?v=sTeoEFzVNSc',  // Adrian Twarog - ChatGPT Tips
    'ai_tools':         'https://www.youtube.com/watch?v=JyOPfbSHb-k',  // Jeff Su - AI Tools
    'image_gen':        'https://www.youtube.com/watch?v=1CIpzeNxIhU',  // Matt Wolfe - AI Image Gen
    'video_gen':        'https://www.youtube.com/watch?v=vfX68E7IQMU',  // Matt Wolfe - AI Video Tools
    'automation':       'https://www.youtube.com/watch?v=RWo2bQiuOqI',  // TechLead - AI Automation
    'python_genai':     'https://www.youtube.com/watch?v=iyGHW4UQ_Ts',  // freeCodeCamp - Python OpenAI
    'openai_api':       'https://www.youtube.com/watch?v=OB99E7Y1cMA',  // freeCodeCamp - OpenAI API
    'rag':              'https://www.youtube.com/watch?v=sVcwVQRHIc8',  // James Briggs - RAG Tutorial
    'agents':           'https://www.youtube.com/watch?v=aqzxhBIXY_g',  // Sam Witteveen - AI Agents
    'langchain':        'https://www.youtube.com/watch?v=aywZrzNaKjs',  // freeCodeCamp - LangChain
    'projects':         'https://www.youtube.com/watch?v=1hX6Hoy9VVU',  // freeCodeCamp - Gen AI Projects
  },
};

// ─── Mapping: lesson title keywords → video key ──────────────────────────────
function getVideoKeyFromTitle(title: string, domain: string): string | null {
  const t = title.toLowerCase();

  if (domain === 'Data Science' || domain === 'Data Analytics') {
    if (t.includes('python'))             return 'python';
    if (t.includes('numpy') || t.includes('pandas') || t.includes('core libraries')) return 'pandas';
    if (t.includes('eda') || t.includes('exploratory')) return 'eda';
    if (t.includes('matplotlib') || t.includes('seaborn') || t.includes('visualization')) return 'visualization';
    return 'python';
  }

  if (domain === 'Machine Learning') {
    if (t.includes('module 1') || t.includes('introduction'))   return 'introduction';
    if (t.includes('module 2') || t.includes('python'))         return 'python';
    if (t.includes('module 3') || t.includes('numpy') || t.includes('pandas')) return 'numpy_pandas';
    if (t.includes('module 4') || t.includes('visualization'))  return 'visualization';
    if (t.includes('module 5') || t.includes('statistic'))      return 'statistics';
    if (t.includes('module 6') || t.includes('supervised'))     return 'supervised';
    if (t.includes('module 7') || t.includes('unsupervised'))   return 'unsupervised';
    if (t.includes('module 8') || t.includes('evaluation') || t.includes('feature')) return 'model_evaluation';
    if (t.includes('module 9') || t.includes('deep learning'))  return 'deep_learning';
    if (t.includes('module 10') || t.includes('deployment') || t.includes('capstone')) return 'deployment';
    return 'introduction';
  }

  if (domain === 'Full Stack') {
    if (t.includes('module 1') || t.includes('introduction') || t.includes('web dev')) return 'web_intro';
    if (t.includes('module 2') || t.includes('html') || t.includes('css'))  return 'html_css';
    if (t.includes('module 3') || t.includes('javascript'))     return 'javascript';
    if (t.includes('module 4') || t.includes('react'))          return 'react';
    if (t.includes('module 5') || t.includes('node') || t.includes('express')) return 'node_express';
    if (t.includes('module 6') || t.includes('database') || t.includes('postgresql') || t.includes('sql')) return 'database';
    if (t.includes('module 7') || t.includes('capstone') || t.includes('project')) return 'capstone';
    return 'web_intro';
  }

  if (domain === 'Cyber Security') {
    if (t.includes('module 1') || t.includes('foundation') || t.includes('introduction')) return 'introduction';
    if (t.includes('module 2') || t.includes('networking'))     return 'networking';
    if (t.includes('module 3') || t.includes('linux') || t.includes('windows')) return 'linux_windows';
    if (t.includes('module 4') || t.includes('ethical') || t.includes('penetration')) return 'ethical_hacking';
    if (t.includes('module 5') || t.includes('web') || t.includes('application security')) return 'web_security';
    if (t.includes('module 6') || t.includes('soc'))            return 'soc';
    if (t.includes('module 7') || t.includes('forensic'))       return 'forensics';
    if (t.includes('module 8') || t.includes('cloud'))          return 'cloud_security';
    if (t.includes('module 9') || t.includes('automation') || t.includes('ai')) return 'automation';
    if (t.includes('module 10') || t.includes('capstone'))      return 'capstone';
    return 'introduction';
  }

  if (domain === 'Digital Marketing') {
    if (t.includes('module 1') || t.includes('introduction'))   return 'introduction';
    if (t.includes('module 2') || t.includes('website'))        return 'website';
    if (t.includes('module 3') || t.includes('seo'))            return 'seo';
    if (t.includes('module 4') || t.includes('social media'))   return 'social_media';
    if (t.includes('module 5') || t.includes('google ads'))     return 'google_ads';
    if (t.includes('module 6') || t.includes('meta') || t.includes('facebook')) return 'meta_ads';
    if (t.includes('module 7') || t.includes('content marketing')) return 'content';
    if (t.includes('module 8') || t.includes('email'))          return 'email';
    if (t.includes('module 9') || t.includes('analytics'))      return 'analytics';
    if (t.includes('module 10') || t.includes('capstone'))      return 'capstone';
    return 'introduction';
  }

  // Generative AI
  if (t.includes('module 1') || t.includes('introduction to a')) return 'intro_ai';
  if (t.includes('module 2') || t.includes('large language') || t.includes('llm')) return 'llms';
  if (t.includes('module 3') || t.includes('prompt'))           return 'prompt';
  if (t.includes('module 4') || t.includes('chatgpt'))          return 'chatgpt';
  if (t.includes('module 5') || t.includes('ai tools'))         return 'ai_tools';
  if (t.includes('module 6') || t.includes('image'))            return 'image_gen';
  if (t.includes('module 7') || t.includes('video'))            return 'video_gen';
  if (t.includes('module 8') || t.includes('automation') || t.includes('business')) return 'automation';
  if (t.includes('module 9') || t.includes('python'))           return 'python_genai';
  if (t.includes('module 10') || t.includes('openai api'))      return 'openai_api';
  if (t.includes('module 11') || t.includes('rag') || t.includes('retrieval')) return 'rag';
  if (t.includes('module 12') || t.includes('agent'))           return 'agents';
  if (t.includes('module 13') || t.includes('langchain'))       return 'langchain';
  if (t.includes('module 14') || t.includes('project'))         return 'projects';
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

    // Skip lessons with no video (capstone/tools/outcomes)
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
