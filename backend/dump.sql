--
-- PostgreSQL database dump
--

\restrict M1x5CxM282dcDlLoLwfSHVa4JIQQnl4bMDroEKkS0nKUfoF4CrYpTelDBgzMXWn

-- Dumped from database version 18.4 (Homebrew)
-- Dumped by pg_dump version 18.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sahanas
--

INSERT INTO public.users VALUES ('d2950264-afe5-4936-9472-222325e98143', 'intern@company.com', '$2b$10$9aAuBFOyvDmL.BwROowwHuh0qYWCEHITNLPFNSKBamDGlJk76qtrm', 'John Smith', 'INTERN', 'Full Stack', 'INT-101', 'intern', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-28 15:19:29.699', '2026-06-29 01:33:09.86');
INSERT INTO public.users VALUES ('9b373781-e2fa-4316-affe-b87500369d2b', 'coordinator@company.com', '$2b$10$wBV5hBddG449kNaVAkZPsOuoWRSbmnsYQDk59vmKJOXwScl2cfAcO', 'Jane Doe', 'PROJECT_COORDINATOR', 'Full Stack', 'EMP-001', 'EMP-001', NULL, '2012-12-12 00:00:00', NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-28 15:19:29.697', '2026-06-29 02:06:37.058');
INSERT INTO public.users VALUES ('c6f0d78c-50e4-493b-b7e5-06626ecb768a', 'coordinator101@company.com', '$2b$10$krL/E4GpHcrvgKyF/WxvueKbl3py9gt5sI03zoocXzQjljJJIEbIm', 'Coordinator EMP-101', 'PROJECT_COORDINATOR', 'Full Stack', 'EMP-101', 'emp-101', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.066', '2026-06-29 02:37:29.066');
INSERT INTO public.users VALUES ('5f4d43ec-1a23-4ac9-9ab0-6a4808424fb6', 'coordinator102@company.com', '$2b$10$krL/E4GpHcrvgKyF/WxvueKbl3py9gt5sI03zoocXzQjljJJIEbIm', 'Coordinator EMP-102', 'PROJECT_COORDINATOR', 'Data Science', 'EMP-102', 'emp-102', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.072', '2026-06-29 02:37:29.072');
INSERT INTO public.users VALUES ('a81f50f1-6bf9-4c50-a0c7-78abc7bf6a3d', 'coordinator103@company.com', '$2b$10$krL/E4GpHcrvgKyF/WxvueKbl3py9gt5sI03zoocXzQjljJJIEbIm', 'Coordinator EMP-103', 'PROJECT_COORDINATOR', 'Machine Learning', 'EMP-103', 'emp-103', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.074', '2026-06-29 02:37:29.074');
INSERT INTO public.users VALUES ('b617691e-8ae9-47d4-92e0-0acdae90fd69', 'intern1@company.com', '$2b$10$jQgdT934neKnge.6GVdVaO.JJC0ZsAlMIaBQFqVDjUNxDGOEzuEWe', 'Intern INT-1', 'INTERN', 'Full Stack', 'INT-1', 'int-1', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.077', '2026-06-29 02:37:29.077');
INSERT INTO public.users VALUES ('6ccfaa20-56a4-419e-88b6-af3076b4d1de', 'intern2@company.com', '$2b$10$jQgdT934neKnge.6GVdVaO.JJC0ZsAlMIaBQFqVDjUNxDGOEzuEWe', 'Intern INT-2', 'INTERN', 'Data Science', 'INT-2', 'int-2', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.078', '2026-06-29 02:37:29.078');
INSERT INTO public.users VALUES ('c885fbbd-c363-415d-a75b-3a1ead6e6162', 'intern3@company.com', '$2b$10$jQgdT934neKnge.6GVdVaO.JJC0ZsAlMIaBQFqVDjUNxDGOEzuEWe', 'Intern INT-3', 'INTERN', 'Machine Learning', 'INT-3', 'int-3', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.08', '2026-06-29 02:37:29.08');
INSERT INTO public.users VALUES ('ee121aba-4711-4b96-b37b-6ca4f991730f', 'intern4@company.com', '$2b$10$jQgdT934neKnge.6GVdVaO.JJC0ZsAlMIaBQFqVDjUNxDGOEzuEWe', 'Intern INT-4', 'INTERN', 'Cyber Security', 'INT-4', 'int-4', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.081', '2026-06-29 02:37:29.081');
INSERT INTO public.users VALUES ('804c0f48-8bef-409d-be6f-0c5c937c04a6', 'intern5@company.com', '$2b$10$jQgdT934neKnge.6GVdVaO.JJC0ZsAlMIaBQFqVDjUNxDGOEzuEWe', 'Intern INT-5', 'INTERN', 'Generative AI', 'INT-5', 'int-5', NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, '2026-06-29 02:37:29.082', '2026-06-29 02:37:29.082');
INSERT INTO public.users VALUES ('d291333a-0226-44d2-b177-f6d472365a46', 'admin@company.com', '$2b$10$zxu9iQp7f5OKObxkYUEtpOBqT1gs75D1SW7KqD3vTKx8XPr2TNVr.', 'System Admin', 'ADMIN', NULL, 'ADM-001', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, false, true, '$2b$10$7WUyhkU./l56dsZl1u4kyOrNkWH.knuEeag/lfgWk4CVAbVMZNAyW', '2026-06-28 15:19:29.694', '2026-06-29 02:44:15.948');


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: sahanas
--

INSERT INTO public.courses VALUES ('f9ba6260-e430-49e4-aaaa-78767460287c', 'Cyber Security Training Program', 'Industry-Oriented Cyber Security Course — 120 Hours. Master Networking, Ethical Hacking, Penetration Testing, Web Application Security, SOC Operations, Digital Forensics, Cloud Security, and Security Automation with real lab environments and hands-on practicals.', 'Cyber Security', NULL, '9b373781-e2fa-4316-affe-b87500369d2b', '2026-06-28 15:19:29.708', '2026-06-29 01:06:12.516', '[{"id": "cs_m1", "title": "Introduction to Cyber Security", "number": 1}, {"id": "cs_m2", "title": "Networking Fundamentals for Security", "number": 2}, {"id": "cs_m3", "title": "Linux and Windows Security", "number": 3}, {"id": "cs_m4", "title": "Ethical Hacking & Penetration Testing", "number": 4}, {"id": "cs_m5", "title": "Web Application Security", "number": 5}, {"id": "cs_m6", "title": "SOC Fundamentals", "number": 6}, {"id": "cs_m7", "title": "Digital Forensics & Incident Response", "number": 7}, {"id": "cs_m8", "title": "Cloud Security Fundamentals", "number": 8}, {"id": "cs_m9", "title": "Cyber Security Automation & AI", "number": 9}, {"id": "cs_m10", "title": "Capstone Project & Career Preparation", "number": 10}]', 'Published', 'Beginner', '120 Hours', NULL, NULL, 'CYBER SECURITY - BROUCHER.pdf', 'application/pdf', 'Cyber Security Brochure', 'https://lms-portal-files-cs.s3.eu-north-1.amazonaws.com/CYBER+SECURITY+-+BROUCHER.pdf', NULL, NULL);
INSERT INTO public.courses VALUES ('414fb9df-9a66-4a7e-91d4-d203df894472', 'Full Stack Development Program', 'Master modern frontend and backend development.', 'Full Stack', NULL, '9b373781-e2fa-4316-affe-b87500369d2b', '2026-06-28 15:19:29.71', '2026-06-28 15:19:29.71', NULL, 'Draft', 'Beginner', NULL, NULL, NULL, 'FULL STACK - BROUCHER.pdf', 'application/pdf', 'Full Stack Development Brochure', 'https://lms-portal-files-cs.s3.eu-north-1.amazonaws.com/FULL+STACK+-+BROUCHER.pdf', NULL, NULL);
INSERT INTO public.courses VALUES ('7e807082-2307-4bc6-8cf8-ad881d97e7a3', 'Machine Learning Training Program', 'Industry-Oriented Machine Learning Course — 120 Hours. Master Python, Data Analysis, Supervised & Unsupervised Learning, Deep Learning, and Model Deployment through hands-on projects and real-world capstone challenges.', 'Machine Learning', NULL, '9b373781-e2fa-4316-affe-b87500369d2b', '2026-06-28 15:19:29.704', '2026-06-29 01:05:46.4', '[{"id": "ml_m1", "title": "Introduction to Machine Learning", "number": 1}, {"id": "ml_m2", "title": "Python for Machine Learning", "number": 2}, {"id": "ml_m3", "title": "Data Analysis using NumPy & Pandas", "number": 3}, {"id": "ml_m4", "title": "Data Visualization", "number": 4}, {"id": "ml_m5", "title": "Statistics & Mathematics for ML", "number": 5}, {"id": "ml_m6", "title": "Supervised Learning", "number": 6}, {"id": "ml_m7", "title": "Unsupervised Learning", "number": 7}, {"id": "ml_m8", "title": "Model Evaluation & Feature Engineering", "number": 8}, {"id": "ml_m9", "title": "Deep Learning Fundamentals", "number": 9}, {"id": "ml_m10", "title": "Deployment & Industry Capstone Project", "number": 10}]', 'Published', 'Beginner', '120 Hours', NULL, NULL, 'MACHINE LEARNING - BROUCHER.pdf', 'application/pdf', 'Machine Learning Brochure', 'https://lms-portal-files-cs.s3.eu-north-1.amazonaws.com/MACHINE+LEARNING+-+BROUCHER.pdf', NULL, NULL);
INSERT INTO public.courses VALUES ('8aac10d1-51d6-46b9-a3be-aa063960a963', 'Digital Marketing Professional Training Program', 'Industry-Oriented Digital Marketing Course — 120 Hours. Master SEO, Google Ads, Meta Ads, Social Media Marketing, Content Marketing, Email Automation, and Analytics through live campaigns and a capstone project.', 'Digital Marketing', NULL, '9b373781-e2fa-4316-affe-b87500369d2b', '2026-06-28 15:19:29.706', '2026-06-29 01:05:46.422', '[{"id": "dm_m1", "title": "Introduction to Digital Marketing", "number": 1}, {"id": "dm_m2", "title": "Website Creation & Optimization", "number": 2}, {"id": "dm_m3", "title": "Search Engine Optimization (SEO)", "number": 3}, {"id": "dm_m4", "title": "Social Media Marketing", "number": 4}, {"id": "dm_m5", "title": "Google Ads", "number": 5}, {"id": "dm_m6", "title": "Meta Ads – Facebook & Instagram", "number": 6}, {"id": "dm_m7", "title": "Content Marketing", "number": 7}, {"id": "dm_m8", "title": "Email Marketing & Automation", "number": 8}, {"id": "dm_m9", "title": "Analytics & Reporting", "number": 9}, {"id": "dm_m10", "title": "Live Capstone Project", "number": 10}]', 'Published', 'Beginner', '120 Hours', NULL, NULL, 'DIGITAL MARKETING - BROUCHER.pdf', 'application/pdf', 'Digital Marketing Brochure', 'https://lms-portal-files-cs.s3.eu-north-1.amazonaws.com/DIGITAL+MARKETING+-+BROUCHER.pdf', NULL, NULL);
INSERT INTO public.courses VALUES ('378e230c-684c-491d-9d30-b5b83cb2c1c0', 'Generative AI Training Program', 'Industry-Oriented Generative AI Course — 120 Hours. Master LLMs, Prompt Engineering, ChatGPT, AI Tools, Image & Video Generation, Business Automation, Python for GenAI, OpenAI API, RAG, AI Agents, and LangChain.', 'Generative AI', NULL, '9b373781-e2fa-4316-affe-b87500369d2b', '2026-06-28 15:19:29.709', '2026-06-29 01:06:23.436', '[{"id": "genai_m1", "title": "Introduction to Artificial Intelligence & Generative AI", "number": 1}, {"id": "genai_m2", "title": "Large Language Models (LLMs)", "number": 2}, {"id": "genai_m3", "title": "Prompt Engineering", "number": 3}, {"id": "genai_m4", "title": "ChatGPT for Productivity", "number": 4}, {"id": "genai_m5", "title": "AI Tools & Applications", "number": 5}, {"id": "genai_m6", "title": "AI Image Generation", "number": 6}, {"id": "genai_m7", "title": "AI Video Generation", "number": 7}, {"id": "genai_m8", "title": "AI for Business Automation", "number": 8}, {"id": "genai_m9", "title": "Python for Generative AI", "number": 9}, {"id": "genai_m10", "title": "OpenAI API & LLM Integration", "number": 10}, {"id": "genai_m11", "title": "Retrieval Augmented Generation (RAG)", "number": 11}, {"id": "genai_m12", "title": "AI Agents", "number": 12}, {"id": "genai_m13", "title": "LangChain Framework", "number": 13}, {"id": "genai_m14", "title": "Generative AI Projects & Capstone", "number": 14}]', 'Published', 'Beginner', '120 Hours', NULL, NULL, 'GEN AI - BROUCHER.pdf', 'application/pdf', 'Generative AI Brochure', 'https://lms-portal-files-cs.s3.eu-north-1.amazonaws.com/GEN+AI+-+BROUCHER.pdf', NULL, NULL);
INSERT INTO public.courses VALUES ('212e4d1d-1009-4ea7-9c72-e1bd08d0f09e', 'Data Analytics Training Program', 'Data analysis, statistics, and visualization', 'Data Analytics', NULL, '9b373781-e2fa-4316-affe-b87500369d2b', '2026-06-30 05:02:36.469', '2026-06-30 05:02:36.469', NULL, 'Published', 'Beginner', NULL, NULL, NULL, 'career solutions broucher.pdf', 'application/pdf', 'Data Analytics Brochure', 'https://lms-portal-files-cs.s3.eu-north-1.amazonaws.com/career+solutions+broucher.pdf', NULL, NULL);


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: sahanas
--

INSERT INTO public."Assignment" VALUES ('745fb672-a13b-40ae-b5a9-e07b50fdd30f', 'EDA & Data Cleaning Assignment', 'Download the Titanic dataset from Kaggle. Perform complete Exploratory Data Analysis (EDA): handle missing values, remove duplicates, perform feature encoding, and generate at least 5 meaningful visualizations. Document your findings.', '2026-07-13 01:05:46.414', '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.414', NULL, 100, NULL, 'File Upload', 'ml_m3');
INSERT INTO public."Assignment" VALUES ('1c880b4d-b210-450d-847a-b620c930e0f2', 'Supervised Learning Mini Project', 'Build a Loan Approval Prediction model using Logistic Regression and Random Forest. Perform feature engineering, model training, evaluation (accuracy, precision, recall, F1), and compare both models. Submit Jupyter Notebook with full code and analysis.', '2026-07-20 01:05:46.416', '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.416', NULL, 100, NULL, 'File Upload', 'ml_m6');
INSERT INTO public."Assignment" VALUES ('fdee98b2-c3fb-4522-aeaa-a9942029e32e', 'ANN Classification Project', 'Build an Artificial Neural Network using Keras/TensorFlow to classify the MNIST handwritten digits dataset. Achieve at least 97% test accuracy. Submit your model architecture, training history plot, and evaluation report.', '2026-07-27 01:05:46.417', '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.417', NULL, 100, NULL, 'File Upload', 'ml_m9');
INSERT INTO public."Assignment" VALUES ('56d98829-5815-425e-a676-14fe701cf0b4', 'Capstone: ML Model Deployment', 'Choose ONE capstone project: Fraud Detection, Employee Attrition, or Sales Forecasting. Build end-to-end: data preprocessing → model training → evaluation → Flask API deployment. Submit GitHub repo link and a 5-minute demo video.', '2026-08-10 01:05:46.417', '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.417', NULL, 100, NULL, 'File Upload', 'ml_m10');
INSERT INTO public."Assignment" VALUES ('f8df7cbe-ed9d-43a8-821e-d382e1aa0e53', 'SEO Audit Assignment', 'Perform a complete SEO audit on any website of your choice (not a major brand). Use Google Search Console and a free SEO tool (Ubersuggest/Screaming Frog). Document: on-page issues, broken links, page speed scores, keyword gaps, and provide 10 actionable recommendations. Submit a detailed PDF report.', '2026-07-13 01:05:46.427', '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.427', NULL, 100, NULL, 'File Upload', 'dm_m3');
INSERT INTO public."Assignment" VALUES ('b9dbc3d9-6c3a-46bb-9b21-db65724121a7', 'Google Ads Campaign Plan', 'Create a complete Google Search Campaign plan for a fictional e-commerce business. Include: campaign objective, target audience, keyword list (min 20 keywords with match types), 3 ad copies with headlines and descriptions, budget allocation, and expected KPIs. Submit as a structured document.', '2026-07-20 01:05:46.427', '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.427', NULL, 100, NULL, 'File Upload', 'dm_m5');
INSERT INTO public."Assignment" VALUES ('589a0f8f-270b-473f-b1d3-70a7f03d1eb8', 'Email Marketing Campaign Design', 'Design a 5-email drip campaign for a SaaS product onboarding sequence. Include: email subject lines, body copy, CTA, segmentation logic, send timing, and success metrics. Use Mailchimp (free plan) to actually build the campaign. Submit screenshots + campaign strategy document.', '2026-07-27 01:05:46.428', '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.428', NULL, 100, NULL, 'File Upload', 'dm_m8');
INSERT INTO public."Assignment" VALUES ('297e6317-6dd9-4c35-971f-4ef47d59736c', 'Capstone: Full Digital Marketing Campaign', 'Execute a complete digital marketing campaign for a real or fictional brand over 2 weeks. Must include: SEO content piece, social media posts (7 days), one Google/Meta ad mockup, email newsletter, and a GA4 analytics report. Submit: campaign strategy doc, all creatives, and a performance report with learnings.', '2026-08-10 01:05:46.428', '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.428', NULL, 100, NULL, 'File Upload', 'dm_m10');
INSERT INTO public."Assignment" VALUES ('ef1ba0f4-b0fc-47e6-88bf-23cbe1c78754', 'Network Scanning Lab Report', 'Using Nmap on your local network or a provided test environment (e.g., Metasploitable 2), perform the following scans:
1. Host discovery scan (-sn) to identify live hosts.
2. Full port scan (-p- or -p 1-65535) on the target.
3. Service version detection (-sV) to identify running services.
4. OS detection (-O) scan.
5. NSE script scan (--script=vuln or specific scripts).
Additionally, capture a Wireshark trace during the scan and identify at least 3 different protocol types in the capture.
Document all findings in a professional penetration testing report format with screenshots, including: executive summary, methodology, findings table, and recommendations.', '2026-07-13 01:06:12.528', 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.528', NULL, 100, NULL, 'File Upload', 'cs_m2');
INSERT INTO public."Assignment" VALUES ('a93baec6-548f-4ba1-8ea5-a26941e68885', 'Penetration Testing Lab Report', 'Using Metasploitable 2 (a deliberately vulnerable VM), perform a structured penetration test following PTES methodology:
Phase 1 — Reconnaissance: gather information about the target using Nmap, Nikto.
Phase 2 — Scanning: identify open ports, services, OS, and vulnerabilities.
Phase 3 — Exploitation: exploit at least 2 vulnerabilities using Metasploit Framework. Document the exploit module, payload, and steps.
Phase 4 — Post-Exploitation: demonstrate privilege escalation to root, extract /etc/passwd and /etc/shadow.
Phase 5 — Reporting: write a professional penetration testing report (minimum 10 pages) including: executive summary, scope, methodology, findings (with CVSS scores), proof-of-concept screenshots, and remediation recommendations.', '2026-07-20 01:06:12.529', 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.529', NULL, 100, NULL, 'File Upload', 'cs_m4');
INSERT INTO public."Assignment" VALUES ('0bda3bcd-04cd-4209-acd1-2351f0f78e13', 'Web Application Security Testing — DVWA', 'Using DVWA (Damn Vulnerable Web Application) configured at Low and Medium security levels, demonstrate exploitation of the following vulnerabilities. For each vulnerability: show the exploit with Burp Suite screenshots, explain the business impact, and provide the secure code fix.
1. SQL Injection — extract the full user table using UNION-based SQLi.
2. Stored XSS — inject a persistent script that steals cookies.
3. CSRF — create an HTML page that performs an unauthorised password change.
4. File Upload — upload a PHP web shell and execute system commands.
5. Command Injection — execute OS commands through the form.
Submit a report with Burp Suite screenshots for each vulnerability, impact analysis, and remediation code examples.', '2026-07-27 01:06:12.529', 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.529', NULL, 100, NULL, 'File Upload', 'cs_m5');
INSERT INTO public."Assignment" VALUES ('70e241d9-fdb0-42e2-b51c-f50c17587128', 'Capstone: Full Security Assessment or Security Tool', 'Choose ONE of the following capstone options:

OPTION A — Complete Web Application Penetration Test:
Select a legal practice target (HackTheBox retired machine, TryHackMe room, or DVWA). Perform a full penetration test following OWASP/PTES methodology. Submit a professional penetration testing report (15+ pages) including: executive summary, scope & rules of engagement, methodology, detailed findings with CVSS scores, exploitation evidence (screenshots), and prioritised remediation recommendations.

OPTION B — Python Security Automation Tool:
Build a comprehensive security tool in Python that includes: (1) Port Scanner with service detection, (2) Vulnerability checker against a known CVE list, (3) Report generator that outputs findings to PDF/HTML. Submit: GitHub repository with clean code and README, demo video (3-5 minutes) showing the tool in action, and a brief write-up explaining design decisions and potential improvements.', '2026-08-10 01:06:12.53', 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.53', NULL, 100, NULL, 'File Upload', 'cs_m10');
INSERT INTO public."Assignment" VALUES ('918fa33d-f2be-416a-964a-f4b2f9c0784c', 'Prompt Engineering Lab', 'Design a system prompt template for an automated customer support agent. Utilize few-shot prompting, input guardrails, and output structuring. Document prompt changes and output differences.', '2026-07-13 01:06:23.449', '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.45', NULL, 100, NULL, 'File Upload', 'genai_m3');
INSERT INTO public."Assignment" VALUES ('fbbd1144-3838-4d27-9cf3-e33dd3cbfa3d', 'OpenAI API Integration Script', 'Write a Python program that calls the OpenAI chat completions API. Implement tool calling/function calling to query a database mock utility, returning structured JSON results.', '2026-07-20 01:06:23.45', '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.45', NULL, 100, NULL, 'File Upload', 'genai_m10');
INSERT INTO public."Assignment" VALUES ('7b11a5c1-e199-4a41-a620-f19c01d009ad', 'Document Q&A RAG System', 'Build a local vector search pipeline using LangChain, an open-source embeddings model, and a vector DB (Chroma or FAISS). Load a custom document, retrieve sections, and generate responses.', '2026-07-27 01:06:23.451', '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.451', NULL, 100, NULL, 'File Upload', 'genai_m11');
INSERT INTO public."Assignment" VALUES ('6a8b1f04-e629-43f7-9498-acbf09d27721', 'Capstone Project Submission', 'Choose and build ONE of the following Capstone Projects:
1. AI Resume Builder
2. AI Content Generator
3. AI Interview Assistant
4. AI Customer Support Bot
5. AI Knowledge Assistant

Submit a GitHub repository with clean code, setup instructions, and a 5-minute video walkthrough showcasing your working application.', '2026-08-10 01:06:23.451', '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.452', NULL, 100, NULL, 'File Upload', 'genai_m14');


--
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: CertificateRequest; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: Domain; Type: TABLE DATA; Schema: public; Owner: sahanas
--

INSERT INTO public."Domain" VALUES ('0c14c95c-b8ca-401c-a33e-ff3106bde749', 'Full Stack', 'Web development with frontend and backend technologies', true, '2026-06-28 15:19:29.529', '2026-06-28 15:19:29.529');
INSERT INTO public."Domain" VALUES ('17367e4e-fcd9-4600-ad1f-c8257bfe5177', 'Machine Learning', 'Predictive modeling, deep learning, and deployment', true, '2026-06-28 15:19:29.536', '2026-06-28 15:19:29.536');
INSERT INTO public."Domain" VALUES ('1b5fa762-934e-459f-b084-a3e63d0f9d4d', 'Cyber Security', 'Network security, ethical hacking, and forensics', true, '2026-06-28 15:19:29.537', '2026-06-28 15:19:29.537');
INSERT INTO public."Domain" VALUES ('a9f0fa8a-0d0a-4ff6-b712-f8d0d7b4bf27', 'Digital Marketing', 'SEO, SEM, social media, and analytics', true, '2026-06-28 15:19:29.539', '2026-06-28 15:19:29.539');
INSERT INTO public."Domain" VALUES ('9d70a244-738b-40c9-b8fa-19f3f181719f', 'Generative AI', 'Large Language Models, prompting, and RAG frameworks', true, '2026-06-28 15:19:29.54', '2026-06-28 15:19:29.54');
INSERT INTO public."Domain" VALUES ('2c2be213-1991-4055-b605-dcdc5e47a64b', 'Data Analytics', 'Data analysis, statistics, and visualization', true, '2026-06-28 15:19:29.533', '2026-06-30 05:02:12.31');


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: sahanas
--

INSERT INTO public."Lesson" VALUES ('19f9da5b-3368-4c5b-813a-230124d1614c', 'Module 3: Data Analysis using NumPy & Pandas', 'NumPy Arrays, broadcasting, and vectorized operations. Pandas DataFrames: loading, cleaning, filtering, handling missing values, transformation, aggregation, merging & joining. Practical: Data Cleaning Project and Exploratory Data Analysis (EDA).', 'https://www.youtube.com/watch?v=vmEHCJofslg', 3, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.409', NULL, NULL, NULL, 'ml_m3');
INSERT INTO public."Lesson" VALUES ('e4da4c01-40c7-4452-b21f-18c4747b1fbb', 'Module 5: Statistics & Mathematics for Machine Learning', 'Descriptive Statistics: Mean, Median, Mode, Variance, Standard Deviation. Probability, Correlation, Covariance. Normal Distribution and Central Limit Theorem. Linear Algebra essentials for ML: matrices, vectors, eigenvalues. Gradient Descent intuition.', 'https://www.youtube.com/watch?v=xxpc-HPKN28', 5, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.41', NULL, NULL, NULL, 'ml_m5');
INSERT INTO public."Lesson" VALUES ('1049570d-b007-4612-a3ff-7019f2e2d899', 'Module 6: Supervised Learning Algorithms', 'Linear Regression, Multiple Regression, Polynomial Regression. Logistic Regression for classification. K-Nearest Neighbors (KNN). Decision Trees and Random Forest. Support Vector Machines (SVM) and Naive Bayes. Practical: House Price Prediction, Customer Churn Prediction, Loan Approval Prediction.', 'https://www.youtube.com/watch?v=pqNCD_5r0IU', 6, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.411', NULL, NULL, NULL, 'ml_m6');
INSERT INTO public."Lesson" VALUES ('9b3f92d3-d7e6-4b7b-8e73-69e160326be6', 'Module 9: Deep Learning Fundamentals', 'Neural Networks and Perceptron model. Activation Functions: ReLU, Sigmoid, Softmax. Artificial Neural Networks (ANN) architecture. Introduction to TensorFlow and Keras. Forward propagation and Backpropagation. Deep Learning Applications in CV and NLP. Practical: ANN Classification Project.', 'https://www.youtube.com/watch?v=aircAruvnKk', 9, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.413', NULL, NULL, NULL, 'ml_m9');
INSERT INTO public."Lesson" VALUES ('3185bd6d-6b94-4a75-86c9-acd4ea434a52', 'Module 1: Introduction to Digital Marketing', 'Overview of Digital Marketing and the digital ecosystem. Traditional vs Digital Marketing comparison. Key Digital Marketing Channels: SEO, SEM, Social Media, Email, Content, Affiliate. Setting SMART Goals and KPIs. Career Paths in Digital Marketing: SEO Specialist, PPC Manager, Social Media Manager, Content Strategist, Digital Marketing Manager.', 'https://www.youtube.com/watch?v=bixR-KIJKYM', 1, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.423', NULL, NULL, NULL, 'dm_m1');
INSERT INTO public."Lesson" VALUES ('c5b7b2b2-148f-48ce-bdbc-70dd5213350c', 'Module 3: Search Engine Optimization (SEO)', 'On-Page SEO: meta tags, heading structure, keyword density, internal linking. Off-Page SEO: backlink building, domain authority, guest posting. Technical SEO: site speed, mobile-first indexing, structured data, XML sitemaps, robots.txt. Keyword Research with Google Keyword Planner, SEMrush, Ahrefs. Local SEO and Google My Business optimization. SEO Audit process and reporting. Algorithm updates: Core Updates, Panda, Penguin.', 'https://www.youtube.com/watch?v=xsVTqzratPs', 3, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.424', NULL, NULL, NULL, 'dm_m3');
INSERT INTO public."Lesson" VALUES ('19ace9af-584f-4974-9caa-7bb049c35e73', 'Module 2: Python Fundamentals for ML', 'Python Variables, Data Types, Operators, Control Flow (Loops, Conditionals), Functions, File Handling, Exception Handling, and OOP Basics. Practical: Python Exercises and Mini Projects.', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 2, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.408', NULL, NULL, NULL, 'ml_m2');
INSERT INTO public."Lesson" VALUES ('021f2c6a-f687-4742-8c7b-b005f39e50c5', 'Module 4: Data Visualization with Matplotlib & Seaborn', 'Matplotlib fundamentals: Line Charts, Bar Charts, Pie Charts, Histograms, Scatter Plots. Seaborn for statistical visualization: Heatmaps, Box Plots, Violin Plots. Practical: Dashboard Creation and Visualization Projects.', 'https://www.youtube.com/watch?v=UO98lJQ3QGI', 4, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.409', NULL, NULL, NULL, 'ml_m4');
INSERT INTO public."Lesson" VALUES ('02ec0999-c957-458a-94b1-360de41cfc17', 'Module 7: Unsupervised Learning', 'K-Means Clustering and choosing optimal K (Elbow Method). Hierarchical Clustering and Dendrograms. DBSCAN for density-based clustering. Principal Component Analysis (PCA) for dimensionality reduction. Practical: Customer Segmentation Project and PCA Project.', 'https://www.youtube.com/watch?v=pqNCD_5r0IU', 7, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.411', NULL, NULL, NULL, 'ml_m7');
INSERT INTO public."Lesson" VALUES ('009d99ba-03c1-44cb-a283-f67a16c3d97d', 'Module 8: Model Evaluation & Feature Engineering', 'Feature Selection and Feature Extraction techniques. Feature Scaling: StandardScaler, MinMaxScaler. Cross Validation: K-Fold, Stratified K-Fold. Hyperparameter Tuning: Grid Search CV, RandomizedSearchCV. Understanding Overfitting & Underfitting. Bias-Variance Tradeoff.', 'https://www.youtube.com/watch?v=85dtiMz9tSo', 8, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.412', NULL, NULL, NULL, 'ml_m8');
INSERT INTO public."Lesson" VALUES ('261902e9-7946-4f12-9ce1-18b84345fe06', 'Module 10: ML Model Deployment & Capstone Projects', 'Model serialization with pickle and joblib. Flask API for ML model serving. Building REST APIs for ML models. Documentation best practices. Resume Building for ML roles. Interview Preparation. Capstone Projects: Fraud Detection System, Employee Attrition Predictor, Movie Recommendation System, Sales Forecasting, Student Performance Prediction.', 'https://www.youtube.com/watch?v=i_LwzRVP7bg', 10, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.413', NULL, NULL, NULL, 'ml_m10');
INSERT INTO public."Lesson" VALUES ('c33887fa-993b-4c9d-9ee2-1ebc0e0ab188', 'Module 2: Website Creation & Optimization', 'Domain registration and web hosting basics. WordPress website creation and theme customization. Landing page builders: Elementor, Unbounce, Leadpages. UX/UI Principles for marketers: above-the-fold, CTAs, visual hierarchy. Core Web Vitals and Page Speed optimization. Conversion Rate Optimization (CRO): A/B testing, heatmaps, user journey mapping.', 'https://www.youtube.com/watch?v=MYE6T_gd7H0', 2, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.423', NULL, NULL, NULL, 'dm_m2');
INSERT INTO public."Lesson" VALUES ('5e1a853f-47df-454d-b98c-dc9118d6b3b2', 'Module 5: Google Ads (PPC)', 'Google Ads account structure: Campaigns, Ad Groups, Keywords, Ads. Search Network vs Display Network campaigns. Keyword match types: Broad, Phrase, Exact, Negative. Quality Score, Ad Rank, and CPC bidding strategies. Ad Copywriting: headlines, descriptions, extensions. Smart Bidding: Target CPA, Target ROAS, Maximize Conversions. Performance Measurement: CTR, CPC, CPM, ROAS, Conversion Rate. Google Ads optimization and A/B testing.', 'https://www.youtube.com/watch?v=f7j3JSBD6so', 5, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.424', NULL, NULL, NULL, 'dm_m5');
INSERT INTO public."Lesson" VALUES ('6a5dd6b9-6efd-4e4f-86c7-1608ca567ff5', 'Module 7: Content Marketing', 'Content Marketing Strategy: Define audience, set goals, choose channels. Content types: blogs, articles, infographics, videos, podcasts, whitepapers, case studies. SEO-driven blog writing and content clusters. Video content creation for YouTube and social media. Content distribution: owned, earned, paid channels. Content calendar creation and editorial workflow. Measuring Content ROI: organic traffic, leads, engagement, conversions.', 'https://www.youtube.com/watch?v=5KpDQWFbvRo', 7, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.425', NULL, NULL, NULL, 'dm_m7');
INSERT INTO public."Lesson" VALUES ('6332ed2c-2247-4f53-b96f-5e4a177e565f', 'Module 10: Live Capstone Project & Career Preparation', 'End-to-End Digital Marketing Campaign: Strategy → Execution → Measurement → Optimization. Multi-Channel Campaign: SEO + Google Ads + Social Media + Email. Campaign Performance Report and Data-driven Presentation. Portfolio Building: document all projects, campaigns, results. Resume Writing for Digital Marketing roles. LinkedIn profile optimization and networking strategies. Interview Preparation: common DM interview questions and case studies.', 'https://www.youtube.com/watch?v=bixR-KIJKYM', 10, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.427', NULL, NULL, NULL, 'dm_m10');
INSERT INTO public."Lesson" VALUES ('fcaf259a-a891-4614-8f71-23ec9d695ada', 'Module 6: Meta Ads – Facebook & Instagram', 'Meta Business Suite and Ads Manager overview. Campaign Objectives: Awareness, Traffic, Engagement, Leads, Sales. Audience Targeting: demographics, interests, behaviors, Custom Audiences, Lookalike Audiences. Ad formats: Image, Video, Carousel, Collection, Stories, Reels. Ad Creative best practices for Facebook and Instagram. Retargeting with Facebook Pixel. Campaign budget optimization (CBO) vs Ad Set Budget Optimization. Measuring ROAS and attribution models.', 'https://www.youtube.com/watch?v=t-6c16BH-0U', 6, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.425', NULL, NULL, NULL, 'dm_m6');
INSERT INTO public."Lesson" VALUES ('4273ad80-88d0-4dfd-a982-b58cdf0a7529', 'Module 8: Email Marketing & Automation', 'Email marketing fundamentals: building a list, GDPR compliance, opt-in strategies. Email Campaign types: newsletters, promotional, welcome series, re-engagement. Mailchimp / ActiveCampaign: list segmentation, template design, scheduling. A/B Testing for subject lines, CTAs, send times. Marketing Automation Workflows: lead nurturing, drip campaigns, behavioral triggers. Email Analytics: open rate, click rate, bounce rate, unsubscribe rate, conversions. Improving deliverability: SPF, DKIM, DMARC.', 'https://www.youtube.com/watch?v=d5GnSCqN2Bs', 8, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.426', NULL, NULL, NULL, 'dm_m8');
INSERT INTO public."Lesson" VALUES ('4cf9664b-a5ea-42db-9a75-17221e9459e9', 'Module 9: Analytics & Reporting', 'Google Analytics 4 (GA4) setup and configuration: events, parameters, conversions. Understanding audience reports, acquisition channels, behavior flow. UTM parameters for campaign tracking. Google Search Console: performance reports, index coverage, Core Web Vitals. Building marketing dashboards in Looker Studio (Google Data Studio). Data-driven decision making: attribution models, funnel analysis, cohort analysis.', 'https://www.youtube.com/watch?v=eg4I-RU_vKU', 9, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.426', NULL, NULL, NULL, 'dm_m9');
INSERT INTO public."Lesson" VALUES ('825c6623-92ce-44ba-bdae-4eebed0d9199', 'Module 1: Introduction to Cyber Security (10 Hours)', 'Fundamentals of Cyber Security and the threat landscape.
CIA Triad: Confidentiality, Integrity, Availability.
Types of Cyber Threats and Attacks: malware, phishing, ransomware, social engineering, DDoS, insider threats.
Cyber Security Domains: Network Security, Application Security, Cloud Security, Endpoint Security, Identity & Access Management.
Ethical Hacking vs Cyber Crime: legal framework, responsible disclosure, bug bounty programs.
Cyber Security Career Paths: SOC Analyst (Tier 1/2/3), Penetration Tester, Security Engineer, Cloud Security Architect, CISO.
Cyber Security Frameworks and Standards: NIST Cybersecurity Framework, ISO/IEC 27001, OWASP, CIS Controls, COBIT.
Practical: Cyber Security Lab Setup (VirtualBox/VMware, Kali Linux VM), Introduction to Kali Linux — navigating the OS, essential tools overview, terminal basics.', 'https://www.youtube.com/watch?v=U_P23SqJaDc', 1, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.52', NULL, NULL, NULL, 'cs_m1');
INSERT INTO public."Lesson" VALUES ('5288538d-1c92-4c51-b61c-9f760adef8a3', 'Module 2: Networking Fundamentals for Security (15 Hours)', 'OSI Model (7 layers — Physical, Data Link, Network, Transport, Session, Presentation, Application) and TCP/IP stack deep dive.
IP Addressing: IPv4, IPv6, subnetting, CIDR notation, VLSM, private vs public IP ranges.
DNS, DHCP, HTTP/HTTPS, FTP, SSH, SMTP, POP3, IMAP — protocol operation and security implications.
Routing and Switching: routers, switches, VLANs, spanning tree protocol, inter-VLAN routing.
Ports and Protocols: common ports (22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 3306 MySQL, 3389 RDP), protocol security risks.
Network Devices and Security: firewalls (stateful/stateless), IDS/IPS, WAF, proxy servers, load balancers, DMZ architecture.
Packet Analysis Fundamentals: how packets are structured, reading packet headers, filtering traffic.
Practical: Wireshark Packet Capture (capturing, filtering, analysing HTTP/HTTPS/DNS traffic), Network Scanning using Nmap (host discovery, port scanning, service detection, OS fingerprinting).', 'https://www.youtube.com/watch?v=qiQR5rTSshw', 2, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.522', NULL, NULL, NULL, 'cs_m2');
INSERT INTO public."Lesson" VALUES ('c8b87cee-321b-405d-a742-815ce64d5696', 'Module 3: Linux and Windows Security (10 Hours)', 'Linux Fundamentals: filesystem hierarchy (/, /etc, /var, /home, /bin), essential commands (ls, chmod, chown, ps, netstat, grep, awk, sed), shell scripting basics.
File Permissions and Access Control: chmod (rwx / octal), chown, SUID/SGID/sticky bit, ACLs (setfacl/getfacl), umask.
User Management: useradd, usermod, userdel, passwd, sudo, /etc/passwd, /etc/shadow, /etc/group, PAM configuration.
Windows Security Architecture: security subsystem, SAM database, NTLM vs Kerberos authentication, Windows Defender, BitLocker.
Active Directory Basics: domains, forests, trusts, OUs (Organisational Units), users & computer objects, LDAP.
Group Policies: GPO creation and linking, account lockout policies, password complexity, software restriction policies.
Log Monitoring: Windows Event Viewer (security event IDs 4624, 4625, 4648, 4672), syslog on Linux (/var/log/auth.log, /var/log/syslog).
Practical: Linux Security Hardening Checklist (disabling root SSH, configuring UFW, fail2ban, CIS benchmark), Windows Security Configuration (Local Security Policy, Windows Firewall, audit policy).', 'https://www.youtube.com/watch?v=sWbUDq4S6Y8', 3, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.523', NULL, NULL, NULL, 'cs_m3');
INSERT INTO public."Lesson" VALUES ('7106cd9d-70f0-41cd-b55c-f19a709f8e63', 'Module 11: Retrieval Augmented Generation (RAG)', 'Enhance LLMs with external data. Learn vector embeddings, text chunking strategies, vector databases (Chroma, Pinecone, FAISS), and semantic search query loops to generate grounded answers.', 'https://www.youtube.com/watch?v=2IK3DFHRFfw', 11, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.447', NULL, NULL, NULL, 'genai_m11');
INSERT INTO public."Lesson" VALUES ('037a247b-692a-472f-9a2e-b11bc3efefea', 'Module 12: AI Agents', 'Understand agentic design patterns. Learn loops, planning, reflection, and task breakdown. Explore autonomous tool selection, multi-agent frameworks (CrewAI, AutoGen), and goal-driven execution.', 'https://www.youtube.com/watch?v=2IK3DFHRFfw', 12, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.447', NULL, NULL, NULL, 'genai_m12');
INSERT INTO public."Lesson" VALUES ('3dcfcfaf-0d0d-4d18-9b99-f9efd065b8c0', 'Module 4: Ethical Hacking & Penetration Testing (20 Hours)', 'Penetration Testing Methodology: Planning & Scoping, Reconnaissance, Scanning & Enumeration, Exploitation, Post-Exploitation, Reporting — PTES and OWASP Testing Guide frameworks.
Information Gathering: passive vs active recon, WHOIS, DNS enumeration (dig, nslookup, dnsenum), Google Dorking (filetype:, site:, inurl: operators), Shodan.
Footprinting and Reconnaissance: OSINT techniques, Maltego, theHarvester, Recon-ng, LinkedIn/social media recon.
Vulnerability Assessment: Nessus, OpenVAS — scanning, reporting, CVSS scoring, prioritising findings.
Exploitation Concepts: understanding CVEs, public exploits (Exploit-DB), payload types (reverse shells, bind shells, Meterpreter).
Privilege Escalation: Linux (SUID binaries, sudo misconfigs, cron jobs, kernel exploits), Windows (token impersonation, unquoted service paths, DLL hijacking).
Post Exploitation Activities: persistence mechanisms, lateral movement, credential dumping (Mimikatz), data exfiltration techniques.
Report Writing: executive summary, technical findings, CVSS scores, proof-of-concept screenshots, remediation recommendations.
Practical: Nmap advanced scanning, Nikto web vulnerability scanner, Metasploit Framework (msfconsole, exploits, payloads, post modules), Vulnerability Scanning with Nessus/OpenVAS on Metasploitable 2.', 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', 4, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.524', NULL, NULL, NULL, 'cs_m4');
INSERT INTO public."Lesson" VALUES ('d2f195f1-e326-4be0-89b5-4c38d36c55bb', 'Module 5: Web Application Security (15 Hours)', 'Web Technologies Overview: HTTP/HTTPS request-response cycle, cookies, sessions, REST APIs, JSON, web application architecture (frontend, backend, database).
OWASP Top 10 (2021): A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable Components, A07 Auth Failures, A08 Integrity Failures, A09 Logging Failures, A10 SSRF.
SQL Injection: Union-based, Error-based, Blind (Boolean & Time-based) SQLi — manual exploitation and sqlmap.
Cross-Site Scripting (XSS): Reflected XSS, Stored XSS, DOM-based XSS — payload crafting, CSP bypass, cookie theft.
Cross-Site Request Forgery (CSRF): attack mechanics, SameSite cookies, CSRF tokens as defence.
Broken Authentication: credential stuffing, brute force attacks, password spraying, MFA bypass techniques, session fixation.
Session Management: insecure session tokens, session hijacking, HttpOnly/Secure cookie flags.
Secure Coding Practices: input validation, output encoding, parameterised queries, OWASP ASVS (Application Security Verification Standard).
Practical: DVWA (Damn Vulnerable Web Application) Lab — exploiting SQLi, XSS, CSRF, File Upload, Command Injection at low/medium/high security. Burp Suite Hands-on — intercepting requests, Repeater, Intruder, Scanner, Active scan.', 'https://www.youtube.com/watch?v=WtHnT73NaaQ', 5, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.524', NULL, NULL, NULL, 'cs_m5');
INSERT INTO public."Lesson" VALUES ('e5c7976e-f865-4c38-80d7-8c8bfcc555d8', 'Module 7: Digital Forensics & Incident Response (10 Hours)', 'Digital Forensics Process: Identification → Preservation → Collection → Examination → Analysis → Reporting — maintaining forensic integrity throughout.
Evidence Collection: legal considerations, write blockers (hardware/software), forensic imaging with dd/FTK Imager, hash verification (MD5/SHA-256).
Chain of Custody: documentation requirements, evidence handling procedures, court admissibility, tamper-evident packaging.
Memory Analysis: volatile vs non-volatile data, RAM acquisition (WinPmem, LiME), process analysis, network connections, registry hives in memory using Volatility Framework.
Disk Forensics: NTFS/FAT32/ext4 filesystem analysis, deleted file recovery, metadata analysis, timeline creation, file carving.
Incident Response Lifecycle: Preparation, Detection & Analysis, Containment, Eradication, Recovery, Post-Incident Activity (NIST SP 800-61).
Malware Investigation: static analysis (strings, file headers, PEiD, VirusTotal), dynamic analysis (sandbox execution, Process Monitor, Wireshark), IOC extraction.
Practical: Autopsy forensic tool — disk image analysis, deleted file recovery, timeline analysis, keyword search. Basic Incident Investigation lab — analysing a simulated security incident from detection to report.', 'https://www.youtube.com/watch?v=mKUZx1z9dxo', 7, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.525', NULL, NULL, NULL, 'cs_m7');
INSERT INTO public."Lesson" VALUES ('ca45632d-544d-460a-b5c6-0b1227fa0eb6', 'Module 8: Cloud Security Fundamentals (10 Hours)', 'Introduction to Cloud Computing: IaaS, PaaS, SaaS service models; public, private, hybrid, multi-cloud deployment models; major providers (AWS, Azure, GCP).
AWS Security Basics: Shared Responsibility Model, VPC (subnets, route tables, internet gateways), Security Groups (stateful), NACLs (stateless), CloudTrail, GuardDuty, AWS Config.
Azure Security Basics: Azure Active Directory, NSGs (Network Security Groups), Azure Security Center / Defender for Cloud, Azure Sentinel SIEM, Azure Key Vault.
Cloud Threats and Risks: misconfigured S3 buckets (public exposure), excessive IAM permissions, credential theft via metadata APIs, API abuse, insecure cloud storage, shadow IT.
Identity and Access Management: principle of least privilege, IAM policies (AWS JSON policies), role-based access control (RBAC), service accounts, MFA for cloud consoles, federation/SSO.
Data Protection: encryption at rest (AES-256, AWS KMS, Azure Key Vault), encryption in transit (TLS 1.2/1.3), data classification, DLP (Data Loss Prevention) policies.
Cloud Compliance: GDPR, SOC 2 Type II, PCI-DSS, HIPAA requirements in cloud environments; cloud compliance frameworks and audit tools.
Practical: AWS IAM — creating users, groups, policies, roles, enabling MFA. Security Group Management — configuring inbound/outbound rules, VPC flow logs analysis.', 'https://www.youtube.com/watch?v=Qt9lhzFhW_c', 8, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.526', NULL, NULL, NULL, 'cs_m8');
INSERT INTO public."Lesson" VALUES ('2079dc16-128e-40e6-923b-92dbd175ec0a', 'Module 1: Introduction to Artificial Intelligence & Generative AI', 'Understand the foundations of Artificial Intelligence. History, evolution, and shift towards Generative AI. Explore neural networks, transformers, and self-attention mechanisms. Learn real-world generative AI use cases, ethics, and industry landscapes.', 'https://www.youtube.com/watch?v=2IK3DFHRFfw', 1, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.441', NULL, NULL, NULL, 'genai_m1');
INSERT INTO public."Lesson" VALUES ('a97e5077-e9d7-4cd0-807a-d8e74bede8ae', 'Module 2: Large Language Models (LLMs)', 'Deep dive into LLM architectures (GPT, LLaMA, Claude, Gemini). Tokenization, pre-training, fine-tuning, and Reinforcement Learning from Human Feedback (RLHF). Learn parameters, temperature, top-p, and context windows.', 'https://www.youtube.com/watch?v=zjkBMFhNj_g', 2, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.442', NULL, NULL, NULL, 'genai_m2');
INSERT INTO public."Lesson" VALUES ('bae60040-2aac-4ac6-aafc-8d79b023dc5d', 'Module 3: Prompt Engineering', 'Master prompt design patterns. Learn Zero-shot, Few-shot, Chain-of-Thought, and React prompting. Study system instructions, prompt templates, few-shot demonstration selection, and safety guardrails.', 'https://www.youtube.com/watch?v=1bUy-1hGZpI', 3, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.443', NULL, NULL, NULL, 'genai_m3');
INSERT INTO public."Lesson" VALUES ('671155f6-0acf-4996-ad57-7c8af3eac0ca', 'Module 4: ChatGPT for Productivity', 'Unlock ChatGPT for professional writing, brainstorming, programming, data analysis, and task scheduling. Explore Advanced Data Analysis, custom GPT creation, and workspace integration workflows.', 'https://www.youtube.com/watch?v=sTeoEFzVNSc', 4, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.444', NULL, NULL, NULL, 'genai_m4');
INSERT INTO public."Lesson" VALUES ('f3a493b1-5531-4c38-aa18-4ee48c5462fe', 'Module 6: AI Image Generation', 'Introduction to Midjourney, DALL-E 3, and Stable Diffusion. Learn prompt structures, aspect ratios, styling filters, seed parameters, inpainting, outpainting, and consistent characters.', 'https://www.youtube.com/watch?v=1CIpzeNxIhU', 6, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.445', NULL, NULL, NULL, 'genai_m6');
INSERT INTO public."Lesson" VALUES ('dfdd5f78-f935-4f39-88db-19e3e97246d1', 'Module 9: Python for Generative AI', 'Essential Python scripting for AI developers. Learn pip packaging, virtual environments, loading API keys securely, parsing HTTP responses, working with JSON, and asynchronous scripting.', 'https://www.youtube.com/watch?v=iyGHW4UQ_Ts', 9, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.446', NULL, NULL, NULL, 'genai_m9');
INSERT INTO public."Lesson" VALUES ('972c84b1-653a-4f7f-bfb4-056e84a7e3b0', 'Module 10: OpenAI API & LLM Integration', 'Integrate OpenAI GPT models into your applications. Master chat completion endpoints, system messages, function calling/tool usage, JSON mode, and counting tokens with tiktoken.', 'https://www.youtube.com/watch?v=2IK3DFHRFfw', 10, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.446', NULL, NULL, NULL, 'genai_m10');
INSERT INTO public."Lesson" VALUES ('c7a52327-87e0-403d-9191-f92cdaabcfd6', 'Module 9: Cyber Security Automation & AI (10 Hours)', 'Introduction to Security Automation: benefits of automation in SOC, SOAR (Security Orchestration, Automation and Response) platforms, automation use cases (alert enrichment, threat blocking, report generation).
Python for Security: Python scripting fundamentals, working with APIs (requests library), file I/O, regex for log parsing, subprocess for OS commands, socket programming.
Security Automation Scripts: building a port scanner, password strength checker, log file analyser, hash identifier, IP reputation checker using VirusTotal API.
AI in Cyber Security: Machine Learning fundamentals for security — supervised/unsupervised learning applications, anomaly detection, user and entity behaviour analytics (UEBA), Network Traffic Analysis with ML.
Threat Detection using AI: training ML models on network logs, phishing URL detection, malware classification using Random Forest / Neural Networks, false positive reduction.
ChatGPT and Security Applications: using LLMs for phishing email detection, automated log analysis, vulnerability report generation, security policy drafting, incident timeline summarisation.
Security Orchestration Basics: connecting security tools via APIs, SOAR playbook design, TheHive + MISP integration, automating IOC enrichment.
Practical: Building Python Security Scripts (port scanner, hash checker, log analyser), AI-Based Threat Analysis lab using Scikit-learn for anomaly detection on network traffic datasets.', 'https://www.youtube.com/watch?v=inWWhr5tnEA', 9, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.527', NULL, NULL, NULL, 'cs_m9');
INSERT INTO public."Lesson" VALUES ('5e528323-e29d-495d-b6f9-236a93b72682', 'Module 5: AI Tools & Applications', 'Overview of the generative AI ecosystem. Explore AI writing assistants (Jasper, Copy.ai), design tools (Canva AI), coding companions (Copilot, Cursor), search assistants (Perplexity), and productivity integrations.', 'https://www.youtube.com/watch?v=NRmAXDWJVnU', 5, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.444', NULL, NULL, NULL, 'genai_m5');
INSERT INTO public."Lesson" VALUES ('b6234d29-93fe-4ddd-b985-125b49570180', 'Module 7: AI Video Generation', 'Explore text-to-video, image-to-video, and avatars. Learn tools like Runway Gen-2, Sora, Pika, and Synthesia. Scriptwriting, voiceover generation (ElevenLabs), and lipsync animations.', 'https://www.youtube.com/watch?v=NRmAXDWJVnU', 7, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.445', NULL, NULL, NULL, 'genai_m7');
INSERT INTO public."Lesson" VALUES ('c2b52b25-13df-4911-90a8-a4236f2eb407', 'Module 8: AI for Business Automation', 'Automate business funnels. Use Make.com and Zapier to connect OpenAI APIs with email, Google Sheets, Slack, and CRM systems. Build trigger-action loops and AI workflow automation pipelines.', 'https://www.youtube.com/watch?v=wWUwZPmp-6o', 8, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.445', NULL, NULL, NULL, 'genai_m8');
INSERT INTO public."Lesson" VALUES ('1dce3416-3516-4bf5-8b22-1c812ac10d1c', 'Module 1: Introduction to AI, ML & Deep Learning', 'Introduction to Artificial Intelligence, Machine Learning, and Deep Learning. Types of ML (Supervised, Unsupervised, Reinforcement). ML Workflow and Applications. Industry Use Cases and Project Lifecycle overview. Python Environment Setup for ML.', 'https://www.youtube.com/watch?v=i_LwzRVP7bg', 1, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '2026-06-29 01:05:46.405', NULL, NULL, NULL, 'ml_m1');
INSERT INTO public."Lesson" VALUES ('a27f90af-de90-4d2f-bf26-2061b7416445', 'Module 13: LangChain Framework', 'Introduction to LangChain. Master LCEL (LangChain Expression Language), PromptTemplates, Models, OutputParsers, Chains, Memory buffers, and retrieval loaders.', 'https://www.youtube.com/watch?v=2IK3DFHRFfw', 13, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.448', NULL, NULL, NULL, 'genai_m13');
INSERT INTO public."Lesson" VALUES ('5abe615b-ba0d-4085-a4a5-f26c7a334171', 'Module 10: Capstone Project & Career Preparation (10 Hours)', 'Capstone Projects (choose one or complete all):
1. Vulnerability Assessment of a Web Application — full OWASP-methodology pentest on a practice target with professional report.
2. Network Security Monitoring System — deploy Splunk/ELK stack, ingest network logs, build detection rules and dashboards.
3. Phishing Detection System — Python/ML-based URL and email classifier using NLP techniques.
4. SOC Dashboard using Splunk — real-time SOC dashboard with threat metrics, alert tracking, KPI reporting.
5. Password Strength Analyser — Python tool with entropy calculation, dictionary attack simulation, recommendations engine.
6. Malware Traffic Analysis — analyse PCAP files from malware infections, identify C2 communication patterns, extract IOCs.
7. Web Application Penetration Testing — full pentest of DVWA or HackTheBox machine with documented findings and remediation.
8. AI-Based Threat Detection System — ML pipeline for network anomaly detection with classification report and ROC curve.

Career Preparation:
• Resume Building: crafting a cyber security CV — certifications, tools, lab experience, project showcase format.
• LinkedIn Optimization: professional headline, about section, skills endorsements, showcasing projects.
• Certifications Roadmap: CompTIA Security+, CEH (Certified Ethical Hacker), OSCP (Offensive Security), eJPT, CISSP, CISM — study paths and exam tips.
• Interview Preparation: common technical interview questions, behavioral questions (STAR method), scenario-based questions.
• Mock Technical Interviews: live interview simulation — network security, web app security, SOC analysis, incident response scenarios.', 'https://www.youtube.com/watch?v=U_P23SqJaDc', 10, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.527', NULL, NULL, NULL, 'cs_m10');
INSERT INTO public."Lesson" VALUES ('a0b58e27-1885-4073-8997-2284ac85e9d0', 'Module 14: Generative AI Projects & Capstone', 'Complete your professional portfolio. Review architecture design, prompt fine-tuning, security, rate-limiting, and web hosting. Engage in capstone project submission.', 'https://www.youtube.com/watch?v=2IK3DFHRFfw', 14, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '2026-06-29 01:06:23.448', NULL, NULL, NULL, 'genai_m14');
INSERT INTO public."Lesson" VALUES ('81db3b5b-cbd2-43c4-927a-28ec1c6589d7', 'Module 4: Social Media Marketing', 'Platform-specific strategies: LinkedIn (B2B), Instagram (visual), Facebook (community), Twitter/X (real-time), YouTube (video SEO). Social media content calendars and scheduling tools (Buffer, Hootsuite). Community management and engagement strategies. Influencer marketing: finding, vetting, and collaborating with influencers. Social Media Analytics: reach, engagement rate, impressions, CTR. Organic vs Paid social strategies.', 'https://www.youtube.com/watch?v=ClLuvMYZlr8', 4, '8aac10d1-51d6-46b9-a3be-aa063960a963', '2026-06-29 01:05:46.424', NULL, NULL, NULL, 'dm_m4');
INSERT INTO public."Lesson" VALUES ('f4965554-6828-4851-8af2-c27dab335846', 'Module 6: SOC Fundamentals (10 Hours)', 'SOC Roles and Responsibilities: SOC Tier 1 (alert triage), Tier 2 (incident investigation), Tier 3 (threat hunting & advanced analysis), SOC Manager, Threat Intelligence Analyst.
Security Monitoring: real-time event monitoring, 24/7 SOC operations, alert queue management, security dashboards.
SIEM Concepts: Security Information and Event Management — log aggregation, normalisation, correlation rules, use-case development, alerting thresholds.
Log Management: collecting Windows Event Logs, syslog, application logs, network logs — log retention policies, log integrity.
Incident Detection: true positive vs false positive vs false negative analysis, reducing alert fatigue, tuning detection rules.
Threat Intelligence: Indicators of Compromise (IOCs) — IP addresses, domains, file hashes, TTPs, STIX/TAXII feeds, threat intel platforms (MISP, OpenCTI), MITRE ATT&CK framework.
Security Alerts and Response: alert escalation procedures, runbooks and playbooks, SLA requirements, communication procedures.
Practical: Splunk Basics — installing/configuring Splunk, SPL search queries, creating dashboards, building alerts. Log Analysis Exercises — identifying failed login attempts, detecting port scans, spotting malware C2 traffic patterns.', 'https://www.youtube.com/watch?v=56NDgBOSpUg', 6, 'f9ba6260-e430-49e4-aaaa-78767460287c', '2026-06-29 01:06:12.525', NULL, NULL, NULL, 'cs_m6');


--
-- Data for Name: LessonProgress; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: sahanas
--

INSERT INTO public."Quiz" VALUES ('f06ea23f-548b-47df-b025-996fada5c7f4', 'Machine Learning Training Program — Comprehensive Assessment Quiz', 70, '7e807082-2307-4bc6-8cf8-ad881d97e7a3', '[{"id": "q1", "text": "Which algorithm is best suited for predicting a continuous value like house price?", "options": ["K-Means Clustering", "Linear Regression", "Naive Bayes", "DBSCAN"], "correctOption": 1}, {"id": "q2", "text": "What does PCA stand for in machine learning?", "options": ["Predictive Component Algorithm", "Principal Component Analysis", "Partial Correlation Analysis", "Probabilistic Classification Approach"], "correctOption": 1}, {"id": "q3", "text": "Which technique helps prevent overfitting in ML models?", "options": ["Increasing training data only", "Using complex models", "Cross-validation and regularization", "Removing all features"], "correctOption": 2}, {"id": "q4", "text": "What is the purpose of the activation function in a neural network?", "options": ["Normalize the input data", "Introduce non-linearity into the model", "Calculate the loss function", "Determine the learning rate"], "correctOption": 1}, {"id": "q5", "text": "Which Python library is commonly used for building and training deep learning models?", "options": ["NumPy", "Pandas", "TensorFlow/Keras", "Matplotlib"], "correctOption": 2}]', '2026-06-29 01:05:46.418', 30, 'ml_m10');
INSERT INTO public."Quiz" VALUES ('067d5373-d941-4046-8163-155ebfe60cd9', 'Digital Marketing Professional Training Program — Comprehensive Assessment Quiz', 70, '8aac10d1-51d6-46b9-a3be-aa063960a963', '[{"id": "q1", "text": "What does SEO stand for?", "options": ["Social Engagement Optimization", "Search Engine Optimization", "Site Efficiency Output", "Search Experience Operations"], "correctOption": 1}, {"id": "q2", "text": "Which metric measures the percentage of users who click on a link after seeing it?", "options": ["Bounce Rate", "Conversion Rate", "Click-Through Rate (CTR)", "Impressions"], "correctOption": 2}, {"id": "q3", "text": "What is a Lookalike Audience in Meta Ads?", "options": ["An audience that looks at your ads multiple times", "An audience similar to your existing customers", "Users who have previously visited your website", "A custom audience created from your email list"], "correctOption": 1}, {"id": "q4", "text": "What is the primary purpose of UTM parameters in digital marketing?", "options": ["Improve page loading speed", "Track campaign traffic sources in analytics", "Create custom landing pages", "Automate email campaigns"], "correctOption": 1}, {"id": "q5", "text": "Which tool would you use to measure organic search performance and keyword rankings?", "options": ["Facebook Ads Manager", "Google Search Console", "Mailchimp", "Canva"], "correctOption": 1}]', '2026-06-29 01:05:46.428', 30, 'dm_m10');
INSERT INTO public."Quiz" VALUES ('792cb348-4551-4fcd-927a-5783bac5c914', 'Cyber Security Training Program — Comprehensive Assessment Quiz', 70, 'f9ba6260-e430-49e4-aaaa-78767460287c', '[{"id": "q1", "text": "What does the CIA Triad stand for in Cyber Security?", "options": ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Cyber Intelligence Analysis", "Control, Identification, Authentication"], "correctOption": 1}, {"id": "q2", "text": "Which OWASP Top 10 vulnerability allows an attacker to execute malicious SQL commands via user input?", "options": ["Cross-Site Scripting (XSS)", "SQL Injection", "Cross-Site Request Forgery (CSRF)", "Broken Authentication"], "correctOption": 1}, {"id": "q3", "text": "What is the primary purpose of a penetration test?", "options": ["Monitor network traffic 24/7", "Simulate real-world attacks to find vulnerabilities before malicious attackers do", "Install antivirus software on all systems", "Configure firewall rules"], "correctOption": 1}, {"id": "q4", "text": "Which framework maps adversary tactics, techniques, and procedures (TTPs) used in real-world cyberattacks?", "options": ["OWASP Top 10", "NIST Cybersecurity Framework", "MITRE ATT&CK", "ISO/IEC 27001"], "correctOption": 2}, {"id": "q5", "text": "In cloud security, what does the Shared Responsibility Model define?", "options": ["How cloud infrastructure costs are shared between users", "Which security responsibilities belong to the cloud provider versus the customer", "The process for sharing encryption keys between cloud services", "Data backup and recovery procedures in the cloud"], "correctOption": 1}, {"id": "q6", "text": "Which Nmap flag is used to detect the version of services running on open ports?", "options": ["-O", "-sV", "-p-", "-A"], "correctOption": 1}, {"id": "q7", "text": "What is the difference between IDS and IPS in network security?", "options": ["IDS blocks threats, IPS only detects them", "IDS detects threats and alerts, IPS detects and actively blocks threats", "They are the same technology with different names", "IDS is for cloud environments, IPS is for on-premises"], "correctOption": 1}, {"id": "q8", "text": "Which tool is used in digital forensics to analyse memory dumps for running processes, network connections, and injected code?", "options": ["Metasploit", "Wireshark", "Volatility", "Burp Suite"], "correctOption": 2}]', '2026-06-29 01:06:12.531', 30, 'cs_m10');
INSERT INTO public."Quiz" VALUES ('19d7b5e5-8c7e-4f12-bc30-c2f8ee55742c', 'Generative AI Training Program — Comprehensive Assessment Quiz', 70, '378e230c-684c-491d-9d30-b5b83cb2c1c0', '[{"id": "q1", "text": "What is a Large Language Model (LLM)?", "options": ["A model used to compress files", "A neural network trained on vast text datasets to predict next tokens", "A database indexing system", "An image editing algorithm"], "correctOption": 1}, {"id": "q2", "text": "Which prompt engineering technique provides a few input-output examples in the prompt?", "options": ["Zero-shot prompting", "Few-shot prompting", "Chain-of-thought prompting", "Instruction fine-tuning"], "correctOption": 1}, {"id": "q3", "text": "What is Retrieval-Augmented Generation (RAG)?", "options": ["A method to train larger models from scratch", "A framework to enhance LLM responses using external data sources", "An encryption protocol for model API endpoints", "A tool to generate realistic AI videos"], "correctOption": 1}, {"id": "q4", "text": "Which framework is widely used to build LLM-powered applications and agents?", "options": ["Flask", "LangChain", "React.js", "TensorFlow"], "correctOption": 1}, {"id": "q5", "text": "What are AI Agents in the context of Generative AI?", "options": ["Human trainers who annotate prompt datasets", "Autonomous systems that use LLMs to plan and invoke tools to complete tasks", "API keys used to authenticate requests", "Virtual machines hosting deep learning models"], "correctOption": 1}]', '2026-06-29 01:06:23.453', 30, 'genai_m14');


--
-- Data for Name: QuizResult; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: sahanas
--

INSERT INTO public._prisma_migrations VALUES ('fed1ee90-0d12-44bd-8e49-09765e1c0949', 'e77b1f375a6116e5f20f555ef0310077119c26a6e87652a5845da354fe34119e', '2026-06-28 11:18:17.790931-04', '20260615134007_init', NULL, NULL, '2026-06-28 11:18:17.7665-04', 1);
INSERT INTO public._prisma_migrations VALUES ('87586256-5b02-4686-8e65-6494bc444888', 'c172b8503492c60f304ff8462f4b25992c8e730d9914a87d90c5972d693d4da2', '2026-06-28 11:18:17.792641-04', '20260615143153_domain_and_attachments', NULL, NULL, '2026-06-28 11:18:17.79121-04', 1);
INSERT INTO public._prisma_migrations VALUES ('a4d07f27-8194-4f48-a1ea-ca7c0ffe8b87', 'fdfb59b046184f54c86fe92b54f6a52a6c9518a5327da8f96c020bb33838e124', '2026-06-28 11:18:17.793555-04', '20260615152858_add_user_domain', NULL, NULL, '2026-06-28 11:18:17.79286-04', 1);
INSERT INTO public._prisma_migrations VALUES ('28317b50-f230-4551-b4e6-e4e0d1aa489e', 'afa8b4cfd29c0c312c6f394fc49f03568d4347d262ae380f7ae5b0eff0d812c2', '2026-06-28 11:18:17.818239-04', '20260623231846_add_projects', NULL, NULL, '2026-06-28 11:18:17.793871-04', 1);
INSERT INTO public._prisma_migrations VALUES ('42172b8d-af40-469e-8d5f-6b857671a33f', '17b0f9e77cfc850e9cc14748176f7f8b9a6056450aab702a31e86270913fda0f', '2026-06-28 11:18:17.820126-04', '20260624133800_rename_instructor_to_project_coordinator', NULL, NULL, '2026-06-28 11:18:17.818485-04', 1);
INSERT INTO public._prisma_migrations VALUES ('daacf6c8-1145-4e1b-9776-048db6a78f85', 'e1a9b6d32c3fcc244fa8db933568dabfe6df0cde4bf330b6dd3e4d8971c79600', '2026-06-28 11:18:23.568996-04', '20260628151823_add_contact_info', NULL, NULL, '2026-06-28 11:18:23.566438-04', 1);
INSERT INTO public._prisma_migrations VALUES ('254af0a8-f350-4ef5-8cfb-1056006cef22', '67f0809cefd09991adb4e3b9d62041f6be046ebefebc40e00382339c6a1ee81e', '2026-06-28 13:27:11.333411-04', '20260628172711_add_project_presentation', NULL, NULL, '2026-06-28 13:27:11.327012-04', 1);
INSERT INTO public._prisma_migrations VALUES ('364c536d-4b86-4f9b-86c3-c4f276546c1e', 'ed645c979b513b888db7b3e3a43ab2424eb06dc0e24a994f5256a3ca1e90c195', '2026-06-28 13:54:54.604246-04', '20260628175454_rename_to_internship_registration', NULL, NULL, '2026-06-28 13:54:54.598297-04', 1);
INSERT INTO public._prisma_migrations VALUES ('3428ae24-b44c-4bb7-9ddc-54358938d30c', 'deac1a8a84a239fb2d8dd46ca9b956a5b5b38cc2979fe958ab2b642d2978433e', '2026-06-28 14:49:55.399316-04', '20260628184955_remove_registration_unused_fields', NULL, NULL, '2026-06-28 14:49:55.398115-04', 1);
INSERT INTO public._prisma_migrations VALUES ('83a16d98-0634-41f3-a2a2-665b39c28b31', '7635ac26180f4fd5a5902c42c3a9a28941457dcaa2e3b02ddd0ede34d96e8a1b', '2026-06-28 15:12:28.906461-04', '20260628191228_add_presentations', NULL, NULL, '2026-06-28 15:12:28.902976-04', 1);
INSERT INTO public._prisma_migrations VALUES ('0c29851e-37a3-4e78-981e-990088e77d43', '8f06d118d980ddef625abb60f40c20c74c27e3b0c19ab7064da8ed7a9d03da61', '2026-06-28 15:57:25.544031-04', '20260628195725_add_presentation_slots', NULL, NULL, '2026-06-28 15:57:25.53821-04', 1);


--
-- Data for Name: presentations; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: presentation_registrations; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- Data for Name: project_registrations; Type: TABLE DATA; Schema: public; Owner: sahanas
--



--
-- PostgreSQL database dump complete
--

\unrestrict M1x5CxM282dcDlLoLwfSHVa4JIQQnl4bMDroEKkS0nKUfoF4CrYpTelDBgzMXWn

