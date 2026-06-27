"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const csModules = [
    { id: 'cs_m1', number: 1, title: 'Introduction to Cyber Security' },
    { id: 'cs_m2', number: 2, title: 'Networking Fundamentals for Security' },
    { id: 'cs_m3', number: 3, title: 'Linux and Windows Security' },
    { id: 'cs_m4', number: 4, title: 'Ethical Hacking & Penetration Testing' },
    { id: 'cs_m5', number: 5, title: 'Web Application Security' },
    { id: 'cs_m6', number: 6, title: 'SOC Fundamentals' },
    { id: 'cs_m7', number: 7, title: 'Digital Forensics & Incident Response' },
    { id: 'cs_m8', number: 8, title: 'Cloud Security Fundamentals' },
    { id: 'cs_m9', number: 9, title: 'Cyber Security Automation & AI' },
    { id: 'cs_m10', number: 10, title: 'Capstone Project & Career Preparation' },
];
const csLessons = [
    {
        weekId: 'cs_m1',
        order: 1,
        title: 'Module 1: Introduction to Cyber Security (10 Hours)',
        content: `Fundamentals of Cyber Security and the threat landscape.
CIA Triad: Confidentiality, Integrity, Availability.
Types of Cyber Threats and Attacks: malware, phishing, ransomware, social engineering, DDoS, insider threats.
Cyber Security Domains: Network Security, Application Security, Cloud Security, Endpoint Security, Identity & Access Management.
Ethical Hacking vs Cyber Crime: legal framework, responsible disclosure, bug bounty programs.
Cyber Security Career Paths: SOC Analyst (Tier 1/2/3), Penetration Tester, Security Engineer, Cloud Security Architect, CISO.
Cyber Security Frameworks and Standards: NIST Cybersecurity Framework, ISO/IEC 27001, OWASP, CIS Controls, COBIT.
Practical: Cyber Security Lab Setup (VirtualBox/VMware, Kali Linux VM), Introduction to Kali Linux — navigating the OS, essential tools overview, terminal basics.`,
        videoUrl: 'https://www.youtube.com/watch?v=U_P23SqJaDc',
    },
    {
        weekId: 'cs_m2',
        order: 2,
        title: 'Module 2: Networking Fundamentals for Security (15 Hours)',
        content: `OSI Model (7 layers — Physical, Data Link, Network, Transport, Session, Presentation, Application) and TCP/IP stack deep dive.
IP Addressing: IPv4, IPv6, subnetting, CIDR notation, VLSM, private vs public IP ranges.
DNS, DHCP, HTTP/HTTPS, FTP, SSH, SMTP, POP3, IMAP — protocol operation and security implications.
Routing and Switching: routers, switches, VLANs, spanning tree protocol, inter-VLAN routing.
Ports and Protocols: common ports (22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 3306 MySQL, 3389 RDP), protocol security risks.
Network Devices and Security: firewalls (stateful/stateless), IDS/IPS, WAF, proxy servers, load balancers, DMZ architecture.
Packet Analysis Fundamentals: how packets are structured, reading packet headers, filtering traffic.
Practical: Wireshark Packet Capture (capturing, filtering, analysing HTTP/HTTPS/DNS traffic), Network Scanning using Nmap (host discovery, port scanning, service detection, OS fingerprinting).`,
        videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
    },
    {
        weekId: 'cs_m3',
        order: 3,
        title: 'Module 3: Linux and Windows Security (10 Hours)',
        content: `Linux Fundamentals: filesystem hierarchy (/, /etc, /var, /home, /bin), essential commands (ls, chmod, chown, ps, netstat, grep, awk, sed), shell scripting basics.
File Permissions and Access Control: chmod (rwx / octal), chown, SUID/SGID/sticky bit, ACLs (setfacl/getfacl), umask.
User Management: useradd, usermod, userdel, passwd, sudo, /etc/passwd, /etc/shadow, /etc/group, PAM configuration.
Windows Security Architecture: security subsystem, SAM database, NTLM vs Kerberos authentication, Windows Defender, BitLocker.
Active Directory Basics: domains, forests, trusts, OUs (Organisational Units), users & computer objects, LDAP.
Group Policies: GPO creation and linking, account lockout policies, password complexity, software restriction policies.
Log Monitoring: Windows Event Viewer (security event IDs 4624, 4625, 4648, 4672), syslog on Linux (/var/log/auth.log, /var/log/syslog).
Practical: Linux Security Hardening Checklist (disabling root SSH, configuring UFW, fail2ban, CIS benchmark), Windows Security Configuration (Local Security Policy, Windows Firewall, audit policy).`,
        videoUrl: 'https://www.youtube.com/watch?v=ROjZy1WbCIA',
    },
    {
        weekId: 'cs_m4',
        order: 4,
        title: 'Module 4: Ethical Hacking & Penetration Testing (20 Hours)',
        content: `Penetration Testing Methodology: Planning & Scoping, Reconnaissance, Scanning & Enumeration, Exploitation, Post-Exploitation, Reporting — PTES and OWASP Testing Guide frameworks.
Information Gathering: passive vs active recon, WHOIS, DNS enumeration (dig, nslookup, dnsenum), Google Dorking (filetype:, site:, inurl: operators), Shodan.
Footprinting and Reconnaissance: OSINT techniques, Maltego, theHarvester, Recon-ng, LinkedIn/social media recon.
Vulnerability Assessment: Nessus, OpenVAS — scanning, reporting, CVSS scoring, prioritising findings.
Exploitation Concepts: understanding CVEs, public exploits (Exploit-DB), payload types (reverse shells, bind shells, Meterpreter).
Privilege Escalation: Linux (SUID binaries, sudo misconfigs, cron jobs, kernel exploits), Windows (token impersonation, unquoted service paths, DLL hijacking).
Post Exploitation Activities: persistence mechanisms, lateral movement, credential dumping (Mimikatz), data exfiltration techniques.
Report Writing: executive summary, technical findings, CVSS scores, proof-of-concept screenshots, remediation recommendations.
Practical: Nmap advanced scanning, Nikto web vulnerability scanner, Metasploit Framework (msfconsole, exploits, payloads, post modules), Vulnerability Scanning with Nessus/OpenVAS on Metasploitable 2.`,
        videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    },
    {
        weekId: 'cs_m5',
        order: 5,
        title: 'Module 5: Web Application Security (15 Hours)',
        content: `Web Technologies Overview: HTTP/HTTPS request-response cycle, cookies, sessions, REST APIs, JSON, web application architecture (frontend, backend, database).
OWASP Top 10 (2021): A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable Components, A07 Auth Failures, A08 Integrity Failures, A09 Logging Failures, A10 SSRF.
SQL Injection: Union-based, Error-based, Blind (Boolean & Time-based) SQLi — manual exploitation and sqlmap.
Cross-Site Scripting (XSS): Reflected XSS, Stored XSS, DOM-based XSS — payload crafting, CSP bypass, cookie theft.
Cross-Site Request Forgery (CSRF): attack mechanics, SameSite cookies, CSRF tokens as defence.
Broken Authentication: credential stuffing, brute force attacks, password spraying, MFA bypass techniques, session fixation.
Session Management: insecure session tokens, session hijacking, HttpOnly/Secure cookie flags.
Secure Coding Practices: input validation, output encoding, parameterised queries, OWASP ASVS (Application Security Verification Standard).
Practical: DVWA (Damn Vulnerable Web Application) Lab — exploiting SQLi, XSS, CSRF, File Upload, Command Injection at low/medium/high security. Burp Suite Hands-on — intercepting requests, Repeater, Intruder, Scanner, Active scan.`,
        videoUrl: 'https://www.youtube.com/watch?v=WtHnT73NaaQ',
    },
    {
        weekId: 'cs_m6',
        order: 6,
        title: 'Module 6: SOC Fundamentals (10 Hours)',
        content: `SOC Roles and Responsibilities: SOC Tier 1 (alert triage), Tier 2 (incident investigation), Tier 3 (threat hunting & advanced analysis), SOC Manager, Threat Intelligence Analyst.
Security Monitoring: real-time event monitoring, 24/7 SOC operations, alert queue management, security dashboards.
SIEM Concepts: Security Information and Event Management — log aggregation, normalisation, correlation rules, use-case development, alerting thresholds.
Log Management: collecting Windows Event Logs, syslog, application logs, network logs — log retention policies, log integrity.
Incident Detection: true positive vs false positive vs false negative analysis, reducing alert fatigue, tuning detection rules.
Threat Intelligence: Indicators of Compromise (IOCs) — IP addresses, domains, file hashes, TTPs, STIX/TAXII feeds, threat intel platforms (MISP, OpenCTI), MITRE ATT&CK framework.
Security Alerts and Response: alert escalation procedures, runbooks and playbooks, SLA requirements, communication procedures.
Practical: Splunk Basics — installing/configuring Splunk, SPL search queries, creating dashboards, building alerts. Log Analysis Exercises — identifying failed login attempts, detecting port scans, spotting malware C2 traffic patterns.`,
        videoUrl: 'https://www.youtube.com/watch?v=Z13slYLAoAg',
    },
    {
        weekId: 'cs_m7',
        order: 7,
        title: 'Module 7: Digital Forensics & Incident Response (10 Hours)',
        content: `Digital Forensics Process: Identification → Preservation → Collection → Examination → Analysis → Reporting — maintaining forensic integrity throughout.
Evidence Collection: legal considerations, write blockers (hardware/software), forensic imaging with dd/FTK Imager, hash verification (MD5/SHA-256).
Chain of Custody: documentation requirements, evidence handling procedures, court admissibility, tamper-evident packaging.
Memory Analysis: volatile vs non-volatile data, RAM acquisition (WinPmem, LiME), process analysis, network connections, registry hives in memory using Volatility Framework.
Disk Forensics: NTFS/FAT32/ext4 filesystem analysis, deleted file recovery, metadata analysis, timeline creation, file carving.
Incident Response Lifecycle: Preparation, Detection & Analysis, Containment, Eradication, Recovery, Post-Incident Activity (NIST SP 800-61).
Malware Investigation: static analysis (strings, file headers, PEiD, VirusTotal), dynamic analysis (sandbox execution, Process Monitor, Wireshark), IOC extraction.
Practical: Autopsy forensic tool — disk image analysis, deleted file recovery, timeline analysis, keyword search. Basic Incident Investigation lab — analysing a simulated security incident from detection to report.`,
        videoUrl: 'https://www.youtube.com/watch?v=wnlI1LjJF3g',
    },
    {
        weekId: 'cs_m8',
        order: 8,
        title: 'Module 8: Cloud Security Fundamentals (10 Hours)',
        content: `Introduction to Cloud Computing: IaaS, PaaS, SaaS service models; public, private, hybrid, multi-cloud deployment models; major providers (AWS, Azure, GCP).
AWS Security Basics: Shared Responsibility Model, VPC (subnets, route tables, internet gateways), Security Groups (stateful), NACLs (stateless), CloudTrail, GuardDuty, AWS Config.
Azure Security Basics: Azure Active Directory, NSGs (Network Security Groups), Azure Security Center / Defender for Cloud, Azure Sentinel SIEM, Azure Key Vault.
Cloud Threats and Risks: misconfigured S3 buckets (public exposure), excessive IAM permissions, credential theft via metadata APIs, API abuse, insecure cloud storage, shadow IT.
Identity and Access Management: principle of least privilege, IAM policies (AWS JSON policies), role-based access control (RBAC), service accounts, MFA for cloud consoles, federation/SSO.
Data Protection: encryption at rest (AES-256, AWS KMS, Azure Key Vault), encryption in transit (TLS 1.2/1.3), data classification, DLP (Data Loss Prevention) policies.
Cloud Compliance: GDPR, SOC 2 Type II, PCI-DSS, HIPAA requirements in cloud environments; cloud compliance frameworks and audit tools.
Practical: AWS IAM — creating users, groups, policies, roles, enabling MFA. Security Group Management — configuring inbound/outbound rules, VPC flow logs analysis.`,
        videoUrl: 'https://www.youtube.com/watch?v=Kx0-P2m-GKs',
    },
    {
        weekId: 'cs_m9',
        order: 9,
        title: 'Module 9: Cyber Security Automation & AI (10 Hours)',
        content: `Introduction to Security Automation: benefits of automation in SOC, SOAR (Security Orchestration, Automation and Response) platforms, automation use cases (alert enrichment, threat blocking, report generation).
Python for Security: Python scripting fundamentals, working with APIs (requests library), file I/O, regex for log parsing, subprocess for OS commands, socket programming.
Security Automation Scripts: building a port scanner, password strength checker, log file analyser, hash identifier, IP reputation checker using VirusTotal API.
AI in Cyber Security: Machine Learning fundamentals for security — supervised/unsupervised learning applications, anomaly detection, user and entity behaviour analytics (UEBA), Network Traffic Analysis with ML.
Threat Detection using AI: training ML models on network logs, phishing URL detection, malware classification using Random Forest / Neural Networks, false positive reduction.
ChatGPT and Security Applications: using LLMs for phishing email detection, automated log analysis, vulnerability report generation, security policy drafting, incident timeline summarisation.
Security Orchestration Basics: connecting security tools via APIs, SOAR playbook design, TheHive + MISP integration, automating IOC enrichment.
Practical: Building Python Security Scripts (port scanner, hash checker, log analyser), AI-Based Threat Analysis lab using Scikit-learn for anomaly detection on network traffic datasets.`,
        videoUrl: 'https://www.youtube.com/watch?v=bMZpDPNPuoA',
    },
    {
        weekId: 'cs_m10',
        order: 10,
        title: 'Module 10: Capstone Project & Career Preparation (10 Hours)',
        content: `Capstone Projects (choose one or complete all):
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
• Mock Technical Interviews: live interview simulation — network security, web app security, SOC analysis, incident response scenarios.`,
        videoUrl: 'https://www.youtube.com/watch?v=ULGILG-ZhO0',
    },
];
const csAssignments = [
    {
        weekId: 'cs_m2',
        title: 'Network Scanning Lab Report',
        instruction: `Using Nmap on your local network or a provided test environment (e.g., Metasploitable 2), perform the following scans:
1. Host discovery scan (-sn) to identify live hosts.
2. Full port scan (-p- or -p 1-65535) on the target.
3. Service version detection (-sV) to identify running services.
4. OS detection (-O) scan.
5. NSE script scan (--script=vuln or specific scripts).
Additionally, capture a Wireshark trace during the scan and identify at least 3 different protocol types in the capture.
Document all findings in a professional penetration testing report format with screenshots, including: executive summary, methodology, findings table, and recommendations.`,
        daysFromNow: 14,
    },
    {
        weekId: 'cs_m4',
        title: 'Penetration Testing Lab Report',
        instruction: `Using Metasploitable 2 (a deliberately vulnerable VM), perform a structured penetration test following PTES methodology:
Phase 1 — Reconnaissance: gather information about the target using Nmap, Nikto.
Phase 2 — Scanning: identify open ports, services, OS, and vulnerabilities.
Phase 3 — Exploitation: exploit at least 2 vulnerabilities using Metasploit Framework. Document the exploit module, payload, and steps.
Phase 4 — Post-Exploitation: demonstrate privilege escalation to root, extract /etc/passwd and /etc/shadow.
Phase 5 — Reporting: write a professional penetration testing report (minimum 10 pages) including: executive summary, scope, methodology, findings (with CVSS scores), proof-of-concept screenshots, and remediation recommendations.`,
        daysFromNow: 21,
    },
    {
        weekId: 'cs_m5',
        title: 'Web Application Security Testing — DVWA',
        instruction: `Using DVWA (Damn Vulnerable Web Application) configured at Low and Medium security levels, demonstrate exploitation of the following vulnerabilities. For each vulnerability: show the exploit with Burp Suite screenshots, explain the business impact, and provide the secure code fix.
1. SQL Injection — extract the full user table using UNION-based SQLi.
2. Stored XSS — inject a persistent script that steals cookies.
3. CSRF — create an HTML page that performs an unauthorised password change.
4. File Upload — upload a PHP web shell and execute system commands.
5. Command Injection — execute OS commands through the form.
Submit a report with Burp Suite screenshots for each vulnerability, impact analysis, and remediation code examples.`,
        daysFromNow: 28,
    },
    {
        weekId: 'cs_m10',
        title: 'Capstone: Full Security Assessment or Security Tool',
        instruction: `Choose ONE of the following capstone options:

OPTION A — Complete Web Application Penetration Test:
Select a legal practice target (HackTheBox retired machine, TryHackMe room, or DVWA). Perform a full penetration test following OWASP/PTES methodology. Submit a professional penetration testing report (15+ pages) including: executive summary, scope & rules of engagement, methodology, detailed findings with CVSS scores, exploitation evidence (screenshots), and prioritised remediation recommendations.

OPTION B — Python Security Automation Tool:
Build a comprehensive security tool in Python that includes: (1) Port Scanner with service detection, (2) Vulnerability checker against a known CVE list, (3) Report generator that outputs findings to PDF/HTML. Submit: GitHub repository with clean code and README, demo video (3-5 minutes) showing the tool in action, and a brief write-up explaining design decisions and potential improvements.`,
        daysFromNow: 42,
    },
];
const csQuizQuestions = [
    {
        id: 'q1',
        text: 'What does the CIA Triad stand for in Cyber Security?',
        options: [
            'Central Intelligence Agency',
            'Confidentiality, Integrity, Availability',
            'Cyber Intelligence Analysis',
            'Control, Identification, Authentication',
        ],
        correctOption: 1,
    },
    {
        id: 'q2',
        text: 'Which OWASP Top 10 vulnerability allows an attacker to execute malicious SQL commands via user input?',
        options: [
            'Cross-Site Scripting (XSS)',
            'SQL Injection',
            'Cross-Site Request Forgery (CSRF)',
            'Broken Authentication',
        ],
        correctOption: 1,
    },
    {
        id: 'q3',
        text: 'What is the primary purpose of a penetration test?',
        options: [
            'Monitor network traffic 24/7',
            'Simulate real-world attacks to find vulnerabilities before malicious attackers do',
            'Install antivirus software on all systems',
            'Configure firewall rules',
        ],
        correctOption: 1,
    },
    {
        id: 'q4',
        text: 'Which framework maps adversary tactics, techniques, and procedures (TTPs) used in real-world cyberattacks?',
        options: ['OWASP Top 10', 'NIST Cybersecurity Framework', 'MITRE ATT&CK', 'ISO/IEC 27001'],
        correctOption: 2,
    },
    {
        id: 'q5',
        text: 'In cloud security, what does the Shared Responsibility Model define?',
        options: [
            'How cloud infrastructure costs are shared between users',
            'Which security responsibilities belong to the cloud provider versus the customer',
            'The process for sharing encryption keys between cloud services',
            'Data backup and recovery procedures in the cloud',
        ],
        correctOption: 1,
    },
    {
        id: 'q6',
        text: 'Which Nmap flag is used to detect the version of services running on open ports?',
        options: ['-O', '-sV', '-p-', '-A'],
        correctOption: 1,
    },
    {
        id: 'q7',
        text: 'What is the difference between IDS and IPS in network security?',
        options: [
            'IDS blocks threats, IPS only detects them',
            'IDS detects threats and alerts, IPS detects and actively blocks threats',
            'They are the same technology with different names',
            'IDS is for cloud environments, IPS is for on-premises',
        ],
        correctOption: 1,
    },
    {
        id: 'q8',
        text: 'Which tool is used in digital forensics to analyse memory dumps for running processes, network connections, and injected code?',
        options: ['Metasploit', 'Wireshark', 'Volatility', 'Burp Suite'],
        correctOption: 2,
    },
];
async function updateCyberSecurityCourse() {
    console.log('\n🔒 Updating Cyber Security course curriculum...\n');
    const course = await prisma.course.findFirst({ where: { domain: 'Cyber Security' } });
    if (!course) {
        console.log('⚠️  No course found for domain: Cyber Security');
        console.log('   Please create the Cyber Security course first from the Admin panel.');
        return;
    }
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
            title: 'Cyber Security Training Program',
            description: 'Industry-Oriented Cyber Security Course — 120 Hours. Master Networking, Ethical Hacking, Penetration Testing, Web Application Security, SOC Operations, Digital Forensics, Cloud Security, and Security Automation with real lab environments and hands-on practicals.',
            duration: '120 Hours',
            weeks: csModules,
            status: 'Published',
        },
    });
    console.log(`  ✅ Updated ${csModules.length} modules`);
    for (const l of csLessons) {
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
    console.log(`  ✅ Created ${csLessons.length} lessons`);
    for (const a of csAssignments) {
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
    console.log(`  ✅ Created ${csAssignments.length} assignments`);
    await prisma.quiz.create({
        data: {
            title: 'Cyber Security Training Program — Comprehensive Assessment Quiz',
            passingScore: 70,
            timeLimit: 30,
            courseId: course.id,
            weekId: 'cs_m10',
            questions: csQuizQuestions,
        },
    });
    console.log('  ✅ Created comprehensive assessment quiz (8 questions)');
    console.log('\n  🎉 Cyber Security course fully updated with 10 modules, 10 lessons, 4 assignments & 1 quiz!\n');
}
updateCyberSecurityCourse()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=update-cyber-security.js.map