import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronDown, ChevronUp, ArrowRight, Mail, Phone, MapPin,
  BarChart3, Code2, ShieldCheck, Megaphone, BrainCircuit,
  Users, BookOpen, Award, Briefcase, Star, CheckCircle2,
  Menu, X, Sun, Moon, Zap, TrendingUp, Globe, MessageSquare,
  GraduationCap, Lock, Cpu, Database, Target, Clock, Layers,
  Search, Share2, PieChart, Server, Terminal, Eye, Wifi, FileText,
  Shield, Cloud, Bot, Hammer, ChevronRight
} from 'lucide-react';

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right')
      .forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// ─── Animated Counter ─────────────────────────────────────────────────────
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const step = end / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, end);
      setCount(Math.floor(cur));
      if (cur >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── FAQ Item ─────────────────────────────────────────────────────────────
const FAQItem: React.FC<{ q: string; a: string; open: boolean; toggle: () => void }> = ({ q, a, open, toggle }) => (
  <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden transition-all duration-300 bg-white dark:bg-white/2 hover:border-[#0F4C81]/40">
    <button onClick={toggle} className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 cursor-pointer group">
      <span className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-[#0F4C81] transition-colors">{q}</span>
      <span className="flex-shrink-0 text-[#0F4C81]">{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
    </button>
    <div className={`faq-answer ${open ? 'open' : ''}`}>
      <p className="px-6 pb-4 text-sm text-slate-600 dark:text-white/65 leading-relaxed">{a}</p>
    </div>
  </div>
);

// ─── Curriculum Modal ─────────────────────────────────────────────────────
interface Module { title: string; hours: number; topics: string[]; practical?: string; }
interface Curriculum { domain: string; totalHours: number; tagline: string; modules: Module[]; }

const curriculumData: Record<string, Curriculum> = {
  'Data Science': {
    domain: 'Data Science',
    totalHours: 120,
    tagline: 'Build an analytical mindset by learning Excel, Python, Power BI, and databases',
    modules: [
      { title: 'Foundation of Data and AI Awareness', hours: 10, topics: ['Understand data science and real world use cases', 'Learn what AI and GenAI mean for industry', 'Explore ChatGPT, Gemini and Copilot for analytics', 'Build a data mindset: types, formats, and context'] },
      { title: 'Excel for Data Analysis', hours: 15, topics: ['Master Excel functions: VLOOKUP, IF, INDEX MATCH', 'Clean, validate, and transform raw data', 'Create pivot tables, dashboards, and KPI reports', 'Use Copilot and ChatGPT to generate formulas'], practical: 'Mega Mart Sales Dashboard with GPT' },
      { title: 'SQL for Data Handling', hours: 15, topics: ['Learn SQL basics: SELECT, JOINS, aggregations', 'Create databases, tables, and E-R diagrams', 'Optimize queries with AI tools like EverSQL', 'Use Gen AI for query generation and debugging'], practical: 'Social Media Engagement Analysis' },
      { title: 'Python for Data Science', hours: 15, topics: ['Python essentials: data types, functions, lists', 'Manipulate data with NumPy and Pandas', 'Visualize insights using Matplotlib and Seaborn', 'Use Copilot to debug'] },
      { title: 'Statistics and Probability', hours: 15, topics: ['Explore mean, median, and standard deviation', 'Understand distributions: normal, binomial', 'Conduct tests: Hypothesis, ANOVA, Chi-Square', 'Use AI tools for automating analysis & reporting', 'Explain stats insights using GenAI'] },
      { title: 'Machine Learning', hours: 20, topics: ['Supervised Learning: Linear & Logistic Regression, Classification', 'ML Algorithms: Decision Trees, Random Forests, KNN, SVM, Time Series', 'Unsupervised Learning: K-Means, Hierarchical Clustering, PCA, MBA, RFM', 'Evaluate Models: Confusion Matrix, ROC-AUC, MAE, RMSE', 'Model Tuning: Cross-Validation & Hyperparameter Optimization', 'Build end-to-end ML pipelines with scikit-learn', 'Explain model behavior using SHAP & LIME', 'Auto-generate ML Code & pipelines using GenAI', 'Prompt-driven model suggestions with Jupyter AI'] },
      { title: 'Power BI and Tableau', hours: 15, topics: ['Import & transform data using Power Query & Joins', 'Build data models & define relationships', 'Create Visuals: Bar, Line, Maps, KPI Cards', 'Write formulas using DAX & Tableau Calculations', 'Design interactive dashboards with Filters & Drilldowns', 'Publish & share reports across teams', 'Generate insight Narratives using GenAI using Copilot', 'Natural Language Queries (Q&A) & AI Chart suggestions'] },
      { title: 'Model Deployment', hours: 5, topics: ['Deploy models using Flask & Gradio', 'Build ML apps with Streamlit', 'Launch models on AWS (EC2, SageMaker)', 'Integrate HuggingFace & deploy DL solutions'] },
      { title: 'Deep Learning & AI', hours: 5, topics: ['Learn neural nets, activation functions, optimizers', 'Build CNNs for image classification (Keras, TensorFlow)', 'Apply RNNs & LSTMs for sequence data', 'Use BERT, GPT, YOLO for NLP & Vision tasks', 'Design DL models with GenAI & prompt engineering'] },
      { title: 'Generative AI for Data Professionals', hours: 5, topics: ['Learn about LLMs & their applications', 'Use tools like ChatGPT, Bard, Claude, and Copilot', 'Automate summaries, reports & translations', 'Build AI chatbots using RAG & storytelling bots', 'Create auto-insight generators'] },
      { title: 'Project Bootcamp', hours: 5, topics: ['Collaborate on real-world projects in a group setting', 'Present your solutions and receive real-time feedback from industry experts', 'Engage with real-world case studies and group discussions', 'Get industry-ready through mock interviews and practical exposure'] }
    ]
  },
  'Machine Learning': {
    domain: 'Machine Learning',
    totalHours: 120,
    tagline: 'Industry-Oriented Machine Learning Course',
    modules: [
      { title: 'Introduction to Machine Learning', hours: 10, topics: ['Introduction to AI, ML, Deep Learning', 'Types of ML', 'Workflow & Applications', 'Industry Use Cases & Project Lifecycle', 'Python Environment Setup'], practical: 'Python Installation, Jupyter Notebook, VS Code, Google Colab' },
      { title: 'Python for Machine Learning', hours: 15, topics: ['Python Fundamentals & Variables', 'Data Types, Operators, Loops, Functions', 'File Handling & Exception Handling', 'OOP Basics'], practical: 'Python Exercises and Mini Projects' },
      { title: 'Data Analysis using NumPy & Pandas', hours: 15, topics: ['NumPy Arrays & DataFrames', 'Data Cleaning & Missing Values', 'Transformation & Aggregation', 'Merging & Joining'], practical: 'Data Cleaning Project and EDA' },
      { title: 'Data Visualization', hours: 10, topics: ['Matplotlib & Seaborn', 'Line, Bar, Pie Charts', 'Histograms, Scatter Plots, Heatmaps'], practical: 'Dashboard Creation and Visualization Projects' },
      { title: 'Statistics & Mathematics for ML', hours: 10, topics: ['Mean, Median, Mode, Variance, Standard Deviation', 'Probability, Correlation, Covariance', 'Normal Distribution', 'Linear Algebra & Gradient Descent'] },
      { title: 'Supervised Learning', hours: 20, topics: ['Linear & Multiple Regression', 'Polynomial & Logistic Regression', 'KNN, Decision Trees, Random Forest', 'SVM & Naive Bayes'], practical: 'House Price Prediction, Customer Churn Prediction, Loan Approval Prediction' },
      { title: 'Unsupervised Learning', hours: 10, topics: ['K-Means & Hierarchical Clustering', 'DBSCAN', 'PCA (Principal Component Analysis)'], practical: 'Customer Segmentation and PCA Project' },
      { title: 'Model Evaluation & Feature Engineering', hours: 10, topics: ['Feature Selection & Extraction', 'Scaling & Cross Validation', 'Hyperparameter Tuning & Grid Search CV', 'Overfitting & Underfitting'] },
      { title: 'Deep Learning Fundamentals', hours: 10, topics: ['Neural Networks & Perceptron', 'Activation Functions & ANN', 'TensorFlow & Keras', 'Deep Learning Applications'], practical: 'ANN Classification Project' },
      { title: 'Deployment & Industry Capstone Project', hours: 10, topics: ['Model Deployment & Flask', 'APIs & Documentation', 'Resume Building & Interview Preparation'], practical: 'Fraud Detection, Employee Attrition, Recommendation System, Sales Forecasting, Student Performance Prediction' },
    ],
  },
  'Digital Marketing': {
    domain: 'Digital Marketing',
    totalHours: 120,
    tagline: 'Digital Marketing Professional Training Program',
    modules: [
      { title: 'Introduction to Digital Marketing', hours: 10, topics: ['Overview of Digital Marketing', 'Traditional vs Digital Marketing', 'Digital Marketing Channels', 'Career Paths in Digital Marketing', 'Setting Goals & KPIs'] },
      { title: 'Website Creation & Optimization', hours: 15, topics: ['Domain & Hosting Basics', 'WordPress / Landing Page Builders', 'UX/UI Principles for Marketers', 'Page Speed & Core Web Vitals', 'Conversion Rate Optimization (CRO)'] },
      { title: 'Search Engine Optimization (SEO)', hours: 20, topics: ['On-Page & Off-Page SEO', 'Keyword Research & Strategy', 'Technical SEO Fundamentals', 'Link Building Techniques', 'Local SEO & Google My Business', 'SEO Audit & Reporting'] },
      { title: 'Social Media Marketing', hours: 15, topics: ['Platform Strategy (LinkedIn, Instagram, Facebook, Twitter)', 'Content Planning & Calendars', 'Community Management', 'Influencer Marketing', 'Social Media Analytics'] },
      { title: 'Google Ads', hours: 15, topics: ['Google Ads Account Setup', 'Search & Display Campaigns', 'Keyword Bidding Strategies', 'Ad Copywriting & Extensions', 'Performance Measurement & Optimization'] },
      { title: 'Meta Ads – Facebook & Instagram', hours: 15, topics: ['Meta Business Suite Overview', 'Campaign Objectives & Structures', 'Audience Targeting & Lookalikes', 'Ad Creative Best Practices', 'Retargeting Strategies'] },
      { title: 'Content Marketing', hours: 10, topics: ['Content Strategy Development', 'Blog & Article Writing', 'Video & Visual Content Creation', 'Content Distribution Channels', 'Content ROI Measurement'] },
      { title: 'Email Marketing & Automation', hours: 10, topics: ['Email Campaign Design', 'List Building & Segmentation', 'A/B Testing for Emails', 'Marketing Automation Workflows', 'Email Analytics & Deliverability'] },
      { title: 'Analytics & Reporting', hours: 5, topics: ['Google Analytics 4 Setup', 'Traffic & Conversion Tracking', 'Dashboard Creation', 'Data-Driven Decision Making'] },
      { title: 'Live Capstone Project', hours: 5, topics: ['End-to-End Digital Marketing Campaign', 'Multi-Channel Strategy Execution', 'Performance Report & Presentation', 'Portfolio Building & Career Preparation'] },
    ],
  },
  'Cybersecurity': {
    domain: 'Cybersecurity',
    totalHours: 120,
    tagline: 'Industry-Oriented Cyber Security Course',
    modules: [
      { title: 'Introduction to Cyber Security', hours: 10, topics: ['CIA Triad (Confidentiality, Integrity, Availability)', 'Types of Cyber Threats & Attacks', 'Ethical Hacking vs Cyber Crime', 'Cyber Security Frameworks & Standards'], practical: 'Cyber Security Lab Setup, Introduction to Kali Linux' },
      { title: 'Networking Fundamentals for Security', hours: 15, topics: ['OSI Model & TCP/IP', 'IP Addressing & Subnetting', 'DNS, DHCP, HTTP, HTTPS', 'Ports, Protocols & Packet Analysis'], practical: 'Wireshark Packet Capture, Network Scanning using Nmap' },
      { title: 'Linux and Windows Security', hours: 10, topics: ['Linux Fundamentals & File Permissions', 'User Management & Access Control', 'Windows Security Architecture', 'Active Directory & Group Policies'], practical: 'Linux Security Hardening, Windows Security Configuration' },
      { title: 'Ethical Hacking & Penetration Testing', hours: 20, topics: ['Penetration Testing Methodology', 'Footprinting & Reconnaissance', 'Vulnerability Assessment & Exploitation', 'Privilege Escalation & Post Exploitation', 'Report Writing'], practical: 'Nmap, Nikto, Metasploit Framework, Vulnerability Scanning' },
      { title: 'Web Application Security', hours: 15, topics: ['OWASP Top 10', 'SQL Injection & XSS', 'CSRF & Broken Authentication', 'Session Management & Secure Coding'], practical: 'DVWA Lab, Burp Suite Hands-on' },
      { title: 'SOC Fundamentals', hours: 10, topics: ['SOC Roles & Responsibilities', 'SIEM Concepts & Log Management', 'Incident Detection & Threat Intelligence', 'Security Alerts & Response'], practical: 'Splunk Basics, Log Analysis Exercises' },
      { title: 'Digital Forensics & Incident Response', hours: 10, topics: ['Digital Forensics Process & Evidence Collection', 'Chain of Custody', 'Memory & Disk Forensics', 'Incident Response Lifecycle & Malware Investigation'], practical: 'Autopsy Tool, Basic Incident Investigation' },
      { title: 'Cloud Security Fundamentals', hours: 10, topics: ['AWS & Azure Security Basics', 'Cloud Threats & Risks', 'Identity & Access Management', 'Data Protection & Cloud Compliance'], practical: 'AWS IAM Configuration, Security Group Management' },
      { title: 'Cyber Security Automation & AI', hours: 10, topics: ['Python for Security', 'Security Automation Scripts', 'AI in Cyber Security & Threat Detection', 'ChatGPT and Security Applications'], practical: 'Python Security Scripts, AI-Based Threat Analysis' },
      { title: 'Capstone Project & Career Preparation', hours: 10, topics: ['Vulnerability Assessment of a Web Application', 'Network Security Monitoring System', 'Phishing Detection System', 'SOC Dashboard using Splunk', 'Password Strength Analyzer', 'AI-Based Threat Detection System'], practical: 'Resume Building, LinkedIn Optimization, Mock Technical Interviews' },
    ],
  },
};

const CurriculumModal: React.FC<{ curriculum: Curriculum; onClose: () => void }> = ({ curriculum, onClose }) => {
  const [openModule, setOpenModule] = useState<number | null>(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-gradient-to-br dark:from-[#0a1929] dark:via-[#06111e] dark:to-[#071520]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/8 flex-shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/15 border border-[#0F4C81]/30 text-[#0F4C81] text-[10px] font-bold tracking-widest uppercase mb-2">
              <Clock className="h-3 w-3" /> {curriculum.totalHours} Hours
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-800 dark:text-white">{curriculum.domain} Training Program</h2>
            <p className="text-slate-500 dark:text-white/45 text-xs mt-1">{curriculum.tagline}</p>
          </div>
          <button onClick={onClose} className="ml-4 flex-shrink-0 h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Module Summary Bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-white/5 flex-shrink-0">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-white/45">
            <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-[#0F4C81]" /> {curriculum.modules.length} Modules</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#0F4C81]" /> {curriculum.totalHours} Total Hours</span>
            <span className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-[#0F4C81]" /> Industry Capstone Projects</span>
          </div>
        </div>

        {/* Scrollable Modules */}
        <div className="overflow-y-auto flex-1 p-6 space-y-3">
          {curriculum.modules.map((mod, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden transition-all duration-300 hover:border-[#0F4C81]/30">
              <button
                onClick={() => setOpenModule(openModule === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#0F4C81]/15 border border-[#0F4C81]/20 flex items-center justify-center">
                    <span className="text-[#0F4C81] text-xs font-black">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-[#0F4C81] transition-colors truncate">Module {idx + 1}: {mod.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#0F4C81] bg-[#0F4C81]/10 px-2 py-1 rounded-lg border border-[#0F4C81]/20">{mod.hours}h</span>
                  {openModule === idx ? <ChevronUp className="h-4 w-4 text-[#0F4C81]" /> : <ChevronDown className="h-4 w-4 text-slate-400 dark:text-white/40" />}
                </div>
              </button>
              {openModule === idx && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-white/5">
                  <div className="pt-4">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2">Topics Covered</p>
                    <ul className="space-y-1.5">
                      {mod.topics.map((t, ti) => (
                        <li key={ti} className="flex items-start gap-2 text-xs text-slate-650 dark:text-white/65">
                          <ChevronRight className="h-3.5 w-3.5 text-[#0F4C81] mt-0.5 flex-shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {mod.practical && (
                    <div className="rounded-xl bg-[#0F4C81]/8 border border-[#0F4C81]/20 p-3">
                      <p className="text-[10px] font-bold text-[#0F4C81] uppercase tracking-widest mb-1">Practical / Project</p>
                      <p className="text-xs text-slate-650 dark:text-white/60 leading-relaxed">{mod.practical}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-white/8 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white font-semibold text-sm hover:shadow-xl hover:shadow-[#0F4C81]/25 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Close Curriculum
          </button>
        </div>
      </div>
    </div>
  );
};

const BrochureModal: React.FC<{
  domainTitle: string;
  brochure: { brochureUrl: string; brochureName: string } | null;
  onClose: () => void;
}> = ({ domainTitle, brochure, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  const isPdf = brochure?.brochureUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-md" onClick={onClose}>
      <div className="absolute inset-0" />
      <div
        className="relative z-10 w-full max-w-4xl h-[85vh] flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0c232c] text-slate-800 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
          <div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">
              {domainTitle} Curriculum
            </h2>
            {brochure && (
              <p className="text-xs text-muted-foreground mt-0.5">
                File: {brochure.brochureName}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {brochure && (
              <a
                href={brochure.brochureUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/25 hover:bg-[#0F4C81]/20 px-3 py-1.5 rounded-xl transition-all"
              >
                <FileText className="h-3.5 w-3.5" /> Download Brochure
              </a>
            )}
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center min-h-0 bg-secondary/5 dark:bg-slate-900/10">
          {brochure ? (
            isPdf ? (
              <iframe
                src={`${brochure.brochureUrl}#toolbar=0`}
                className="w-full h-full rounded-2xl border border-border/80 shadow-inner bg-white"
                title={`${domainTitle} Curriculum Brochure`}
              />
            ) : (
              <img
                src={brochure.brochureUrl}
                alt={`${domainTitle} Curriculum`}
                className="max-w-full max-h-full object-contain rounded-2xl border border-border/80 shadow-md bg-white dark:bg-slate-900"
              />
            )
          ) : (
            <div className="text-center space-y-3 max-w-sm p-8 border border-dashed border-border/80 rounded-2xl bg-white dark:bg-slate-900/40 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] mx-auto">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Curriculum not uploaded</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Curriculum will be available soon. Our coordinators are preparing the latest module outline for this domain.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 flex-shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [activeCurriculum, setActiveCurriculum] = useState<string | null>(null);
  const [domainBrochures, setDomainBrochures] = useState<Record<string, { brochureUrl: string; brochureName: string }>>({});
  const [selectedDomainForBrochure, setSelectedDomainForBrochure] = useState<{ title: string; brochure: { brochureUrl: string; brochureName: string } | null } | null>(null);

  useEffect(() => {
    // Fetch brochures map from public API
    axios.get('http://localhost:3000/public-courses/domain-brochures')
      .then(res => {
        setDomainBrochures(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch domain brochures:', err);
      });
  }, []);

  const getBrochureForDomain = (title: string) => {
    const searchKeys = [title.toLowerCase()];
    if (title.toLowerCase() === 'full stack development') {
      searchKeys.push('full stack');
    }
    if (title.toLowerCase() === 'cybersecurity') {
      searchKeys.push('cyber security');
    }
    for (const key of Object.keys(domainBrochures)) {
      if (searchKeys.includes(key.toLowerCase())) {
        return domainBrochures[key];
      }
    }
    return null;
  };

  const toggleDark = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) { root.classList.remove('dark'); setIsDark(false); localStorage.setItem('theme', 'light'); }
    else { root.classList.add('dark'); setIsDark(true); localStorage.setItem('theme', 'dark'); }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark'); setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i, left: `${(i * 6.2) % 93}%`, top: `${(i * 11.3) % 93}%`,
    size: `${((i * 2.7) % 4) + 3}px`, delay: `${(i * 0.9) % 8}s`, duration: `${((i * 3.1) % 8) + 12}s`,
  })), []);

  const domains = [
    { icon: <BarChart3 className="h-8 w-8" />, title: 'Data Science', desc: 'Master Python, NumPy, Pandas, and Data Visualization to extract powerful insights from real-world datasets.', color: 'domain-card-ds', weeks: 'Week 1: Python & Pandas · Week 2: Visualization' },
    { icon: <BrainCircuit className="h-8 w-8" />, title: 'Machine Learning', desc: 'Build predictive models using Scikit-Learn, master regression, classification, and deploy ML pipelines.', color: 'domain-card-ml', weeks: 'Week 1: ML Fundamentals · Week 2: Regression & Classification' },
    { icon: <Code2 className="h-8 w-8" />, title: 'Full Stack Development', desc: 'Learn HTML, CSS, JavaScript, React, APIs and backend integration to build production-grade web applications.', color: 'domain-card-fs', weeks: 'Week 1: HTML, CSS, JS · Week 2: React & Backend APIs' },
    { icon: <ShieldCheck className="h-8 w-8" />, title: 'Cybersecurity', desc: 'Understand network security fundamentals, ethical hacking techniques, and vulnerability assessment methods.', color: 'domain-card-cs', weeks: 'Week 1: Network Security · Week 2: Ethical Hacking' },
    { icon: <Megaphone className="h-8 w-8" />, title: 'Digital Marketing', desc: 'Drive online growth through SEO, SEM, content strategy, social media campaigns, and analytics mastery.', color: 'domain-card-dm', weeks: 'Week 1: SEO Fundamentals · Week 2: Social Media Marketing' },
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'Students Trained',     icon: <Users className="h-6 w-6" /> },
    { value: 500,   suffix: '+', label: 'Internships Completed', icon: <Briefcase className="h-6 w-6" /> },
    { value: 100,   suffix: '+', label: 'Industry Mentors',      icon: <Star className="h-6 w-6" /> },
    { value: 95,    suffix: '%', label: 'Success Rate',          icon: <TrendingUp className="h-6 w-6" /> },
  ];

  const features = [
    { icon: <Users className="h-6 w-6" />,       title: 'Industry Mentors',        desc: 'Learn directly from experienced professionals working in top companies.' },
    { icon: <Briefcase className="h-6 w-6" />,   title: 'Real Projects',           desc: 'Work on live, industry-grade projects that build your portfolio.' },
    { icon: <Award className="h-6 w-6" />,       title: 'Certifications',          desc: 'Earn verified certificates recognised by leading employers worldwide.' },
    { icon: <Zap className="h-6 w-6" />,         title: 'Career Support',          desc: 'Get dedicated career guidance, resume reviews, and interview prep.' },
    { icon: <BookOpen className="h-6 w-6" />,    title: 'Internship Experience',   desc: 'Gain hands-on experience with structured 4–8 week internship programs.' },
    { icon: <Globe className="h-6 w-6" />,       title: 'Placement Assistance',    desc: 'Exclusive access to our hiring partner network for job placements.' },
  ];

  const steps = [
    { num: '01', title: 'Authorized Onboarding', desc: 'Receive your company credentials and log in to get assigned to your domain.' },
    { num: '02', title: 'Learn',       desc: 'Follow structured weekly lessons with video content and resources.' },
    { num: '03', title: 'Assignments', desc: 'Complete and submit weekly tasks reviewed by expert project coordinators.' },
    { num: '04', title: 'Projects',    desc: 'Build a capstone project to showcase your real-world skills.' },
    { num: '05', title: 'Get Certified', desc: 'Claim your verified certificate upon 100% course completion.' },
  ];

  const testimonials = [
    { name: 'Priya Sharma',    role: 'Data Science Intern',    text: 'Career Solutions gave me the structured learning path I needed. The mentors were incredibly helpful and the projects were real-world!', rating: 5, avatar: 'P' },
    { name: 'Arjun Mehta',     role: 'Full Stack Intern',      text: 'From zero web development knowledge to building full-stack apps in 8 weeks. The curriculum is world-class and the platform is seamless.', rating: 5, avatar: 'A' },
    { name: 'Divya Krishnan',  role: 'ML Intern',              text: 'The Machine Learning track was incredibly well-designed. I got placed at a top MNC within 3 months of completing the program!', rating: 5, avatar: 'D' },
  ];

  const faqs = [
    { q: 'Who can access the LMS portal?', a: 'The platform is managed by admins. Project Coordinators and Interns are registered internally by the Admin. Public account creation is disabled.' },
    { q: 'How do I log in as an Intern or Project Coordinator?', a: 'Authorized users use their assigned credentials (e.g. Employee ID or Intern ID) and the default password set by the administrator.' },
    { q: 'Can I switch between internship domains?', a: 'Domain selection happens during onboarding. Contact your admin to request any domain modifications.' },
    { q: 'How does the certificate process work?', a: 'Complete 100% of your course content. Once all lessons and assignments are done, a "Claim Certificate" button becomes available. Your project coordinator then reviews and approves it.' },
    { q: 'What is the duration of each internship program?', a: 'Programs are structured across 2 weeks of content, with each week containing multiple lessons, assignments, and a quiz. Full completion typically takes 4–8 weeks.' },
    { q: 'Is the certificate recognized by employers?', a: 'Yes — Career Solutions certificates are industry-recognized and include a unique certificate code that can be verified by employers on our platform.' },
  ];

  const navLinks = [
    { label: 'Programs', href: '#domains' },
    { label: 'Features', href: '#features' },
    { label: 'Process',  href: '#process' },
    { label: 'FAQ',      href: '#faq' },
    { label: 'Contact',  href: '#contact' },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 4000);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06111e] text-slate-800 dark:text-white transition-colors duration-300 overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 dark:bg-[#06111e]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="dark-logo-wrapper h-16 flex-shrink-0">
              <img src="/logo.png" alt="Career Solutions" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight hidden sm:block">Career Solutions</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="text-sm text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">{l.label}</a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer">
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => navigate('/login')} className="hidden sm:block text-sm text-slate-600 dark:text-white/70 hover:text-slate-950 dark:hover:text-white font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer">
              Log In
            </button>

            <button className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white/95 dark:bg-[#06111e]/95 backdrop-blur-md mt-2 mx-4 rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 shadow-lg">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block py-3 px-2 text-sm text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white border-b border-slate-100 dark:border-white/5 last:border-0 font-medium">{l.label}</a>
            ))}
            <div className="flex gap-2 mt-3">
              <button onClick={() => navigate('/login')} className="w-full py-2 text-sm font-semibold bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer">Log In</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f9fa]/50 via-slate-50 to-white dark:from-[#081d33] dark:via-[#06111e] dark:to-[#06111e] overflow-hidden">
        {/* Animated BG Orbs */}
        <div className="absolute w-[600px] h-[600px] bg-[#0F4C81]/8 rounded-full blur-3xl top-[-10%] left-[-15%] animate-glow-pulse pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-[#17A2B8]/8 rounded-full blur-3xl bottom-[-10%] right-[-10%] animate-glow-pulse pointer-events-none" style={{ animationDelay: '4s' }} />
        <div className="absolute w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse pointer-events-none" style={{ animationDelay: '8s' }} />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <div key={p.id} className="absolute bg-white/15 rounded-full animate-particle"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }} />
          ))}
        </div>

        {/* Floating domain icons — professional Lucide icons */}
        <div className="absolute top-[20%] left-[6%] animate-float-up opacity-30 hidden lg:flex items-center justify-center w-12 h-12 rounded-2xl bg-white/80 dark:bg-[#0F4C81]/10 border border-slate-200 dark:border-[#0F4C81]/20 shadow-sm dark:shadow-none backdrop-blur-sm">
          <Database className="h-5 w-5 text-[#0F4C81]" />
        </div>
        <div className="absolute top-[35%] right-[8%] animate-float-down opacity-30 hidden lg:flex items-center justify-center w-12 h-12 rounded-2xl bg-white/80 dark:bg-[#0F4C81]/10 border border-slate-200 dark:border-[#0F4C81]/20 shadow-sm dark:shadow-none backdrop-blur-sm">
          <Cpu className="h-5 w-5 text-[#0F4C81]" />
        </div>
        <div className="absolute bottom-[30%] left-[10%] animate-float-left opacity-25 hidden lg:flex items-center justify-center w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#0F4C81]/10 border border-slate-200 dark:border-[#0F4C81]/20 shadow-sm dark:shadow-none backdrop-blur-sm">
          <Terminal className="h-4 w-4 text-[#0F4C81]" />
        </div>
        <div className="absolute top-[60%] right-[12%] animate-float-right opacity-25 hidden lg:flex items-center justify-center w-11 h-11 rounded-2xl bg-white/80 dark:bg-[#0F4C81]/10 border border-slate-200 dark:border-[#0F4C81]/20 shadow-sm dark:shadow-none backdrop-blur-sm">
          <Lock className="h-4 w-4 text-[#0F4C81]" />
        </div>
        <div className="absolute top-[15%] right-[22%] animate-float-up opacity-20 hidden xl:flex items-center justify-center w-10 h-10 rounded-2xl bg-white/80 dark:bg-[#0F4C81]/10 border border-slate-200 dark:border-[#0F4C81]/20 shadow-sm dark:shadow-none backdrop-blur-sm">
          <TrendingUp className="h-4 w-4 text-[#0F4C81]" />
        </div>
        <div className="absolute bottom-[40%] right-[4%] animate-float-down opacity-20 hidden xl:flex items-center justify-center w-10 h-10 rounded-2xl bg-white/80 dark:bg-[#0F4C81]/10 border border-slate-200 dark:border-[#0F4C81]/20 shadow-sm dark:shadow-none backdrop-blur-sm">
          <GraduationCap className="h-4 w-4 text-[#0F4C81]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 pt-24 pb-16">

          {/* ── BIG LOGO BLOCK ── */}
          <div className="flex flex-col items-center mb-10 animate-fade-in">
            {/* Glow ring behind logo */}
            <div className="relative inline-flex items-center justify-center">
              {/* Outer glow rings */}
              <div className="absolute w-52 h-52 rounded-full bg-[#0F4C81]/8 blur-2xl animate-glow-pulse" />
              <div className="absolute w-44 h-44 rounded-full border border-[#0F4C81]/15 animate-pulse-ring" />
              <div className="absolute w-44 h-44 rounded-full border border-[#0F4C81]/10 animate-pulse-ring" style={{ animationDelay: '0.7s' }} />

              {/* Logo image */}
              <div
                className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center rounded-[2rem] dark:bg-white dark:p-6 dark:shadow-2xl dark:border dark:border-white/5 transition-all duration-300"
              >
                <img
                  src="/logo.png"
                  alt="Career Solutions Logo"
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Company name under logo */}
            <div className="mt-5 flex flex-col items-center gap-1">
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-[0.12em] uppercase text-slate-800 dark:text-white">
                <span className="text-slate-900 dark:text-white">CAREER</span>{' '}
                <span className="gradient-text">SOLUTIONS</span>
              </h2>
              <p className="text-slate-500 dark:text-white/40 text-xs tracking-[0.25em] uppercase font-medium">Corporate Training &amp; Internship Platform</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#0F4C81]/60 to-transparent mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }} />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0F4C81]/30 bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] animate-pulse" />
            Corporate Training & Internship Platform
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-6 animate-slide-up">
            Launch Your Career with
            <br />
            <span className="gradient-text">Industry-Ready</span> Internships
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-white/65 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            Master in-demand skills through real projects, expert mentorship, and professional certifications — all in one structured platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <a href="#domains">
              <button className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white font-semibold text-sm hover:shadow-2xl hover:shadow-[#0F4C81]/30 transition-all hover:-translate-y-1 active:translate-y-0 cursor-pointer">
                Explore Programs
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white font-semibold text-sm hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-350 dark:hover:border-white/40 transition-all cursor-pointer shadow-xs">
              Access Portal
            </button>
          </div>

          {/* Quick stats ribbon */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((s) => (
              <div key={s.label} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center hover:border-[#0F4C81]/40 transition-all rounded-2xl p-4 shadow-md hover:shadow-lg dark:shadow-none">
                <div className="text-[#0F4C81] flex justify-center mb-1">{s.icon}</div>
                <div className="font-display font-black text-2xl text-slate-900 dark:text-white"><AnimatedCounter end={s.value} suffix={s.suffix} /></div>
                <div className="text-xs text-slate-500 dark:text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-xs text-white/40 tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4 text-white/40" />
        </div>
      </section>

      {/* ── INTERNSHIP DOMAINS ──────────────────────────────────────────── */}
      <section id="domains" className="py-24 bg-white dark:bg-[#06111e] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-[#0F4C81] text-xs font-bold tracking-widest uppercase mb-3 block">Internship Programs</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">Choose Your <span className="gradient-text">Domain</span></h2>
            <p className="text-slate-500 dark:text-white/55 max-w-xl mx-auto text-sm sm:text-base">5 industry-aligned tracks designed to build real skills through hands-on projects and expert mentorship.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {domains.map((d, i) => (
              <div key={d.title} className={`scroll-reveal delay-${Math.min(i * 100 + 100, 500)} group relative rounded-2xl p-6 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 hover:border-[#0F4C81]/30 dark:hover:border-[#0F4C81]/30 hover:shadow-xl dark:hover:shadow-[#0F4C81]/5`}>
                {/* Shimmer overlay */}
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F4C81]/10 dark:bg-white/15 flex items-center justify-center text-[#0F4C81] dark:text-white mb-5 group-hover:scale-110 transition-transform duration-300">
                    {d.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{d.title}</h3>
                  <p className="text-slate-650 dark:text-white/65 text-xs leading-relaxed mb-4">{d.desc}</p>
                  <p className="text-slate-400 dark:text-white/45 text-[10px] mb-5 leading-relaxed">{d.weeks}</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const brochure = getBrochureForDomain(d.title);
                        setSelectedDomainForBrochure({ title: d.title, brochure });
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#0F4C81] bg-[#0F4C81]/15 hover:bg-[#0F4C81]/25 border border-[#0F4C81]/30 px-4 py-2 rounded-xl transition-all w-full justify-center cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" /> View Curriculum
                    </button>
                    <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-white bg-slate-200/55 dark:bg-white/15 hover:bg-slate-200/85 dark:hover:bg-white/25 px-4 py-2 rounded-xl transition-all w-full justify-center cursor-pointer">
                      Access Domain <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-[#040d17] border-t border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-[#0F4C81] text-xs font-bold tracking-widest uppercase mb-3 block">Why Career Solutions</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p className="text-slate-500 dark:text-white/55 max-w-xl mx-auto text-sm sm:text-base">We combine structured learning, real-world experience, and career support into one powerful platform.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className={`scroll-reveal delay-${Math.min(i * 100 + 100, 500)} group bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200/60 dark:border-white/8 hover:border-[#0F4C81]/40 dark:hover:border-[#0F4C81]/40 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-400 hover:-translate-y-1`}>
                <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/15 border border-[#0F4C81]/20 flex items-center justify-center text-[#0F4C81] mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-white/55 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNING PROCESS ────────────────────────────────────────────── */}
      <section id="process" className="py-24 bg-white dark:bg-[#06111e] border-t border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-[#0F4C81] text-xs font-bold tracking-widest uppercase mb-3 block">How It Works</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">Your Learning <span className="gradient-text">Journey</span></h2>
            <p className="text-slate-500 dark:text-white/55 max-w-xl mx-auto text-sm sm:text-base">A clear, structured path from zero to certified professional in 5 simple steps.</p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line desktop */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#0F4C81]/40 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((s, i) => (
                <div key={s.num} className={`scroll-reveal delay-${i * 100 + 100} text-center group`}>
                  <div className="relative inline-flex items-center justify-center mb-6">
                    {/* Step circle */}
                    <div className="w-24 h-24 rounded-full border-2 border-[#0F4C81]/30 flex items-center justify-center bg-[#0F4C81]/10 group-hover:border-[#0F4C81] group-hover:bg-[#0F4C81]/20 transition-all duration-400">
                      <span className="font-display font-black text-2xl gradient-text">{s.num}</span>
                    </div>
                    {/* Pulse ring on hover */}
                    <div className="absolute inset-0 rounded-full border border-[#0F4C81]/0 group-hover:border-[#0F4C81]/30 scale-[1.3] transition-all duration-400" />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-slate-500 dark:text-white/50 text-xs leading-relaxed max-w-[180px] mx-auto">{s.desc}</p>
                  {/* Checkmark on last step */}
                  {i === 4 && <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mt-3" />}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 scroll-reveal">
            <button onClick={() => navigate('/login')} className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white font-semibold text-sm hover:shadow-2xl hover:shadow-[#0F4C81]/30 transition-all hover:-translate-y-1 cursor-pointer">
              Access LMS Portal
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-[#040d17] border-t border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-[#0F4C81] text-xs font-bold tracking-widest uppercase mb-3 block">Success Stories</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">What Our <span className="gradient-text">Interns Say</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`scroll-reveal delay-${i * 150 + 100} bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200/60 dark:border-white/8 hover:border-[#0F4C81]/30 dark:hover:border-[#0F4C81]/30 shadow-sm hover:shadow-md dark:shadow-none transition-all hover:-translate-y-1 duration-400`}>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#17A2B8] flex items-center justify-center font-bold text-white text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{t.name}</p>
                    <p className="text-xs text-[#0F4C81]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white dark:bg-[#06111e] border-t border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 scroll-reveal">
            <span className="text-[#0F4C81] text-xs font-bold tracking-widest uppercase mb-3 block">FAQ</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="space-y-3 scroll-reveal">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} open={openFAQ === i} toggle={() => setOpenFAQ(openFAQ === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-slate-50 dark:bg-[#040d17] border-t border-slate-200/50 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-[#0F4C81] text-xs font-bold tracking-widest uppercase mb-3 block">Get in Touch</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">Contact <span className="gradient-text">Us</span></h2>
            <p className="text-slate-500 dark:text-white/55 max-w-md mx-auto text-sm">Have questions about our programs? We're here to help.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="scroll-reveal-left space-y-6">
              {[
                { icon: <Mail className="h-5 w-5 text-[#0F4C81]" />, label: 'Email', value: 'info@careersolutions.com' },
                { icon: <Phone className="h-5 w-5 text-[#0F4C81]" />, label: 'Phone', value: '+91 98765 43210' },
                { icon: <MapPin className="h-5 w-5 text-[#0F4C81]" />, label: 'Location', value: 'Chennai, Tamil Nadu, India' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4 bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-200/60 dark:border-white/8 shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/15 border border-[#0F4C81]/20 flex items-center justify-center flex-shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-white/40 uppercase tracking-wider font-semibold">{c.label}</p>
                    <p className="text-slate-800 dark:text-white/80 text-sm font-medium mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-200/60 dark:border-white/8 shadow-sm dark:shadow-none">
                <p className="text-xs text-slate-500 dark:text-white/40 uppercase tracking-wider font-semibold mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    {
                      name: 'LinkedIn',
                      icon: (
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      ),
                      url: 'https://linkedin.com'
                    },
                    {
                      name: 'Twitter',
                      icon: (
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                      url: 'https://twitter.com'
                    },
                    {
                      name: 'Instagram',
                      icon: (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      ),
                      url: 'https://instagram.com'
                    }
                  ].map(s => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-[#0F4C81]/25 border border-slate-200 dark:border-white/10 hover:border-[#0F4C81]/30 flex items-center gap-2 justify-center text-xs text-slate-650 dark:text-white/60 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-all"
                    >
                      {s.icon}
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="scroll-reveal-right">
              <form onSubmit={handleContactSubmit} className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200/60 dark:border-white/8 space-y-4 shadow-md dark:shadow-none">
                {contactSent && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-1.5">Your Name</label>
                  <input value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full h-11 px-4 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-[#0F4C81]/50 focus:ring-1 focus:ring-[#0F4C81]/30 transition-all"
                    placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full h-11 px-4 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-[#0F4C81]/50 focus:ring-1 focus:ring-[#0F4C81]/30 transition-all"
                    placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} rows={4}
                    className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-[#0F4C81]/50 focus:ring-1 focus:ring-[#0F4C81]/30 transition-all resize-none"
                    placeholder="Tell us how we can help..." required />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#17A2B8] text-white font-semibold text-sm hover:shadow-xl hover:shadow-[#0F4C81]/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-[#040d17] border-t border-slate-800 dark:border-white/5 py-16 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 flex items-center justify-center">
                  <img src="/logo.png" alt="Career Solutions" className="w-full h-auto object-contain mix-blend-multiply" />
                </div>
                <span className="font-display font-bold text-lg text-white">Career Solutions</span>
              </div>
              <p className="text-white/45 text-xs leading-relaxed">
                A premier corporate training and internship platform bridging the gap between learning and industry.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {['About Us', 'Programs', 'Login', 'Contact'].map(l => (
                  <li key={l}><a href={l === 'Login' ? '/login' : l === 'Programs' ? '#domains' : l === 'Contact' ? '#contact' : '#'} className="text-white/45 hover:text-white text-xs transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Domains */}
            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">Domains</h4>
              <ul className="space-y-2.5">
                {['Data Science', 'Machine Learning', 'Full Stack', 'Cybersecurity', 'Digital Marketing'].map(d => (
                  <li key={d}><span className="text-white/45 text-xs">{d}</span></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/45 text-xs"><Mail className="h-3.5 w-3.5 text-[#0F4C81]" /> info@careersolutions.com</li>
                <li className="flex items-center gap-2 text-white/45 text-xs"><Phone className="h-3.5 w-3.5 text-[#0F4C81]" /> +91 98765 43210</li>
                <li className="flex items-center gap-2 text-white/45 text-xs"><MapPin className="h-3.5 w-3.5 text-[#0F4C81]" /> Chennai, Tamil Nadu</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© {new Date().getFullYear()} Career Solutions LMS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING CHAT BUTTON ────────────────────────────────────────── */}
      <button
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 w-13 h-13 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#17A2B8] text-white flex items-center justify-center shadow-2xl shadow-[#0F4C81]/30 hover:scale-110 transition-all duration-300 group"
        aria-label="Contact Support"
        style={{ width: '52px', height: '52px' }}
      >
        <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#06111e] animate-pulse" />
      </button>

      {/* ── CURRICULUM MODAL ─────────────────────────────────────────────── */}
      {activeCurriculum && curriculumData[activeCurriculum] && (
        <CurriculumModal
          curriculum={curriculumData[activeCurriculum]}
          onClose={() => setActiveCurriculum(null)}
        />
      )}

      {selectedDomainForBrochure && (
        <BrochureModal
          domainTitle={selectedDomainForBrochure.title}
          brochure={selectedDomainForBrochure.brochure}
          onClose={() => setSelectedDomainForBrochure(null)}
        />
      )}
    </div>
  );
};
