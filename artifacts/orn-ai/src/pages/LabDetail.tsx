import React from "react";
import { useParams } from "react-router-dom";

import HeroBanner from "./components/Banner";
import { Shell } from "@/components/layout/Shell";

export const cyberLabs = [
  {
    id: 1,
    slug: "certified-network-defender",
    title: "Certified Network Defender",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
     bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66966ede0988eafe7b33bf31_New%20Project%20(3).png",

    overview: `The Certified Network Defender program is meticulously crafted to provide you with a comprehensive understanding of network security. Through this program, you will gain in-depth knowledge of network defense fundamentals, security threats and vulnerabilities, and advanced protective measures. Prepare to become a proficient network defender equipped with the skills to secure modern networks effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This program is ideal for Network Administrators, IT Security Professionals, Security Analysts, Network Engineers, and individuals seeking to specialize in network security.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp the essentials of network defense, including security architecture and practical configurations.",
      "Understand network security, vulnerabilities, and penetration testing methodologies.",
      "Implement advanced network security protocols and design comprehensive security policies.",
      "Explore unified security frameworks, host security, and secure firewall management.",
      "Develop skills in VPN, IDS configuration, wireless network defense, and traffic monitoring.",
      "Prepare for effective incident response and management."
    ],
    skilsText:"Through this Skill Quest, you will develop expertise in:",
    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsSubText:"",

    skills: [
      "Network Defense",
      "Threat Analysis",
      "Penetration Testing",
      "Security Policy Design",
      "Intrusion Detection",
      "VPN Security",
      "Wireless Security"
    ],
    careerRoles: [      
      "Network Security Specialist",
      "Security Administrator",
      "Network Defense Technician",
      "IT Security Consultant",
      "Incident Response Analyst"
    ],

    requirements: [
      "Solid understanding of networking concepts.",
      "Experience with operating systems such as Windows and Linux.",
      "A proactive interest in network security and continuous learning."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Gain a Certificate of Achievement that validates your expertise as a Network Defender. This certification is a testament to your skills, enhancing your credibility and marketability in the cybersecurity field."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experts with extensive experience in network security and defensive technologies."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Structured to provide a deep dive into network security, this Skill Quest ensures you gain specialized knowledge that directly translates to skills needed in the cybersecurity workforce."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
    syllabusText:"",
    syllabus: [
      "Computer Network & Defense Fundamentals — 6 hrs",
      "Network Security: Threats & Vulnerabilities — 6 hrs",
      "Advanced Network Security — 3 hrs",
      "Network Security Policy Design — 3 hrs",
      "Unified Security Framework — 3 hrs",
      "Host Security — 3 hrs",
      "Secure Firewall Configuration — 3 hrs",
      "Secure IDS Configuration — 3 hrs",
      "Secure VPN Configuration — 3 hrs",
      "Wireless Network Defense — 3 hrs",
      "Network Traffic Monitoring — 3 hrs",
      "Risk & Vulnerability Management — 3 hrs",
      "Data Backup & Recovery — 3 hrs",
      "Network Incident Response — 3 hrs"
    ],
    vedio:"",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },

  // ---------------- ID = 2 (SOC Analyst) ----------------
  {
    id: 2,
    slug: "soc-analyst",
    title: "SOC Analyst",
    subtitle: "Secure & manage cybersecurity operations with real-world SOC techniques.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665848ffb866f7a06e845357_SOC%20ANA-p-500.png",

    overview: `The SOC Analyst program is expertly designed to equip you with essential skills needed for Security Operations Centers. You will explore SOC operations, utilize advanced security tools, and understand the role of a SOC Analyst in combating cybersecurity threats.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment."
    ],
    targetAudienceTex:"This course is ideal for budding SOC Analysts, Security Analysts, Network Security Professionals, and IT Professionals who are aiming to enhance their expertise in cybersecurity operations.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Pemium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate Included", value: "Yes" }
    ],

    learningOutcomes: [
      "Gain a thorough understanding of SOC operations and their significance in cybersecurity.",
      "Set up and operate a virtual penetration testing lab.",
      "Utilize tools like Wireshark, Tshark, and Metasploitable for network security and malware analysis.",
      "Develop expertise in advanced network security, threat detection, and mitigation techniques.",
      "Acquire skills in Linux toolsets for ethical hacking and security monitoring."
    ],
    careerText:"Prepare for roles such as:",
    skilsText:"This course will enhance your proficiency in:",

    careerSubText:"",
    skilsSubText:"",

    skills: [
      "SOC Operations",
      "Cybersecurity Monitoring",
      "Ethical Hacking",
      "Network Security",
      "Malware Traffic Analysis",
      "Threat Detection",
      "Advanced Security Protocols"
    ],

    careerRoles: [
      "SOC Analyst",
      "Network Security Analyst",
      "Cybersecurity Monitor",
      "Threat Detection Specialist",
      "Ethical Hacker"
    ],

    requirements: ["Basic understanding of computer networks and hardware.", "Familiarity with common cybersecurity practices and Linux systems.","Interest in deepening knowledge of security operations."],

    infoCards: [
      {
        icon: "📊",
        title: "Skill Quest Certification Benefits",
        text: "Obtain a Certificate of Achievement that bolsters your professional profile and proves your capabilities in SOC operations and cybersecurity defense."
      },
      {
        icon: "🔍",
        title: "Instructors",
        text: "Our structured Skill Quests are designed to fast-track your professional growth in cybersecurity, particularly in SOC operations."
      },
      {
        icon: "🔥",
        title: "Accelerate Your Career",
        text: "Courses conducted by industry veterans specializing in cybersecurity and SOC operations."
      }
    ],
    vedio:"https://www.youtube.com/embed/PwFkaC1X69o",

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

    syllabusText:"",
      syllabus: [
      "Understanding SOC Operations in Cybersecurity — 2 hrs",
      "Building and Mastering Security Environments: From Virtual Setup to Linux Tools — 4 hrs",
      "Strategic Approaches to Malware Traffic Analysis  — 3 hrs",
      "Advanced Network Analysis and Security Techniques — 3 hrs",
      "Advanced Cyber Threat Detection Techniques — 3 hrs",
      "Detecting Beaconing in Cybersecurity — 3 hrs",
      "Advanced Network Security and Threat Mitigation with Suricata   — 2 hrs",
      "Mastering DetectionLab   — 2 hrs",
      "Advanced Security Tools and Techniques   — 3 hrs"
    ],

    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 3,
    slug: "CYBER DEFENDER",
    title: "Information Security and Ethical Hacking Course",
    subtitle: "Secure & manage cybersecurity operations with real-world SOC techniques.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66584925cdee6b58f49bed23_information%20security-p-500.png",

    overview: `The Cyber Defender program is meticulously crafted to arm you with robust skills for protecting and securing digital environments. You will learn advanced ethical hacking techniques, network security, malware analysis, and more. Equip yourself to stay ahead of cyber threats and safeguard systems effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment."
    ],
    targetAudienceTex:"Ideal for aspiring Cybersecurity Experts, Ethical Hackers, Penetration Testers, Security Analysts, IT Professionals, Network Engineers, and those aiming to escalate their career in cybersecurity.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Pemium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate Included", value: "Yes" }
    ],

    learningOutcomes: [
      "Master cybersecurity concepts, threats, and defenses.",
      "Navigate and harness Kali Linux for ethical hacking.",
      "Execute vulnerability assessments and penetration testing with tools like Metasploit and Nmap.",
      "Learn advanced network security, anonymity techniques, and the legal aspects of cybersecurity.",
      "Handle web server hacking, wireless attacks, and build a robust skilled portfolio with real-world projects."
    ],
  careerText:"Prepare for roles such as:",
 skilsText:"This Skill Quest enhances your capability in:",
 careerSubText:"",
    skilsSubText:"",
    skills: [
      "Cybersecurity",
      "Ethical Hacking",
      "Network Security",
      "Malware Analysis",
      "Digital Forensics",
      "Information Gathering",
      "Legal and Regulatory Compliance"
    ],

    careerRoles: [
      "Ethical Hacker",
      "Penetration Tester",
      "Security Analyst",
      "Cybersecurity Consultant",
      "Network Security Engineer",
      "Forensic Analyst"
    ],

    requirements: ["Basic understanding of computer hardware and software.", "Familiarity with the Linux operating system.","A keen interest in cybersecurity and problem-solving."],

    infoCards: [
      {
        icon: "📊",
        title: "Skill Quest Certification Benefits",
        text: "Successfully completing the course awards you a Certificate of Achievement. Flaunt your certificate to potential employers and your network, enhancing your professional visibility and competitive edge."
      },
      {
        icon: "🔍",
        title: "Instructors",
        text: "Our skill-based Skill Quests are structured to accelerate your career growth in cybersecurity, focusing on skills that employers value the most."
      },
      {
        icon: "🔥",
        title: "Accelerate Your Career",
        text: "Courses led by seasoned industry professionals, deep-rooted in the cybersecurity landscape."
      }
    ],
    
    vedio:"https://www.youtube.com/embed/otXVo-Jjamk?si=7yaGLhvxVMn_GjI1",

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

    syllabusText:"",
      syllabus: [
      "Cybersecurity Basics   — 2 hrs",
      "Introduction to Ethical Hacking   — 2 hrs",
      "Hands-on Ethical Hacking   — 3 hrs",
      "Advanced Security Techniques   — 3 hrs",
      "Specialized Areas in Cybersecurity   — 3 hrs",
      "Building a Professional Portfolio   — 2 hrs"
    ],

    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 4,
    slug: "CYBER FORENSICS",
    title: "Information Security and Ethical Hacking Course",
    subtitle: "Secure & manage cybersecurity operations with real-world SOC techniques.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66584925cdee6b58f49bed23_information%20security-p-500.png",

    overview: `The Cyber Forensics program is intricately designed to provide you with extensive skills in digital investigation and security. Learn to conduct thorough digital forensic investigations, manage digital evidence, and apply advanced security techniques to protect and analyze digital information effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment."
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Pemium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate Included", value: "Yes" }
    ],

    learningOutcomes: [
      "Understand the foundations, practices, and challenges of digital forensics.",
      "Master evidence handling, from preservation to analysis.",
      "Navigate complex forensic tools and techniques for operating system and multimedia analysis.",
      "Gain practical skills through setting up virtual labs for ethical hacking and penetration testing."
    ],

  careerText:"Equips you for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  careerSubText:"",
    skilsSubText:"",

    skills: [
      "Digital Forensics",
      "Evidence Management",
      "Operating System Analysis",
      "Multimedia Forensics",
      "Ethical Hacking Environments",
      "RAM and Image Analysis",
      "Browser and Network Forensics"
    ],

    careerRoles: [
      "Forensic Analyst",
      "Cybersecurity Forensic Consultant",
      "Digital Evidence Specialist",
      "Incident Response Team Member",
    ],

    requirements: ["Solid understanding of IT systems and networks.", "Familiarity with basic cybersecurity concepts.","Eagerness to research into forensic analysis and investigations."],

    infoCards: [
      {
        icon: "📊",
        title: "Skill Quest Certification Benefits",
        text: "Earning this certificate showcases your advanced capabilities in handling and analyzing digital forensic data, significantly boosting your employability and professional stature."
      },
      {
        icon: "🔍",
        title: "Instructors",
        text: "This structured Skill Quest fast-tracks your ability to handle complex forensic challenges, making you a sought-after professional in the booming field of cybersecurity forensics."
      },
      {
        icon: "🔥",
        title: "Accelerate Your Career",
        text: "Led by experts in digital forensics, each with extensive experience in both the field and instructional delivery."
      }
    ],
    
    vedio:"https://www.youtube.com/embed/FN5FpHcb9gU?si=xrE0JkIj86Jzv-kv",

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

   syllabusText:"",
      syllabus: [
      "Digital Forensics in Cybersecurity   — 4 Chapters",
      "Digital Forensics: Investigation Techniques   — 5 Chapters",
      "Foundations of Evidence Handling in Digital Forensics   — 2 Chapters",
      "Advanced Techniques in Operating System Forensics   — 2 Chapters",
      " Setting Up and Mastering Your Ethical Hacking Environment   — 7 Chapters",
      "Digital Forensic Analysis of Acquired Images   — 3 Chapters",
      "Comprehensive Guide to Browser Forensics   — 2 Chapters",
      "Advanced Multimedia Forensics and Digital Security Techniques   — 8 Chapters",
      "Digital Image Analysis and Forensics   — 2 Chapters",
      "RAM Dump Analysis Techniques   — 1 Chapter",
      " Comprehensive Data Security   — 11 Chapters",
      "Autopsy Overview and Key Features   — 2 Chapters"
    ],

    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
   {
    id: 5,
    slug: "BUG BOUNTY",
    title: "BUG BOUNTY",
    subtitle: "Secure & manage cybersecurity operations with real-world SOC techniques.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658494cab129396f38d3925_BIG%20BUNTY-p-500.png",

    overview: `The Bug Bounty program is designed to provide you with comprehensive skills in identifying, analyzing, and exploiting software vulnerabilities. Learn to use advanced tools and techniques to uncover and address security flaws, contributing to software integrity and resilience against attacks.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment."
    ],
    targetAudienceTex:"This program is ideal for Security Researchers, Bug Bounty Hunters, Ethical Hackers, Security Consultants, Software Developers, and IT Security Professionals who are focused on application and system security.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Pemium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate Included", value: "Yes" }
    ],

    learningOutcomes: [
      "Master the techniques for effective vulnerability discovery and exploitation.",
      "Understand the methodologies for securing applications against common and advanced security threats.",
      "Develop proficiency in tools like Burp Suite, SQLmap, and Kali Linux for security testing.",
      "Learn to conduct advanced web application penetration tests and network security assessments.",
      "Acquire skills in report writing for bug bounty submissions and ethical disclosure."
    ],

  careerText:"Prepares you for roles such as:",
  skilsText:"This Skill Quest will enhance your capability in:",

  careerSubText:"",
  skilsSubText:"",

    skills: [
      "Vulnerability Assessment",
      "Security Audits",
      "Exploit Development",
      "Report Writing",
      "Ethical Hacking"
    ],

    careerRoles: [
      "Bug Bounty Hunter",
      "Security Researcher",
      "Penetration Tester",
      "Ethical Hacker",
      "Security Consultant"
    ],

    requirements: ["Intermediate knowledge of networking and web technologies.", "Experience with Linux and basic scripting languages.","Strong analytical skills and a keen interest in cybersecurity."],

    infoCards: [
      {
        icon: "📊",
        title: "Skill Quest Certification Benefits",
        text: "Gain a Certificate of Achievement that enhances your credibility in the field of security testing and demonstrates your expertise in practical bug hunting."
      },
      {
        icon: "🔍",
        title: "Instructors",
        text: "Courses led by experienced professionals and seasoned bug hunters who bring real-world scenarios and hands-on expertise to the learning environment."
      },
      {
        icon: "🔥",
        title: "Accelerate Your Career",
        text: "Leverage this skill-focused program to enhance your practical skills, making you highly valuable in the fast-evolving field of cybersecurity."
      }
    ],
    
    vedio:"https://www.youtube.com/embed/lqsbhCUPKRk?si=i6-GgookvPQQIm90",

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

      syllabusText:"",
    syllabus: [
      "Cybersecurity Fundamentals — 2 hours",
      "Ethical Hacking Techniques — 3 hours",
      "Setting Up Hacking Labs — 2 hours",
      "Linux Proficiency — 3 hours",
      "Anonymity and Encryption — 3 hours",
      "Penetration Testing — 3 hours",
      "Web Security — 3 hours",
      "Network Security — 2 hours",
      "Advanced Threat Management — 3 hours",
      "Vulnerability Analysis — 3 hours",
      "Regulatory Compliance — 2 hours",
      "Professional Skills Development — 2 hours"
    ],

    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 11,
    slug: "enterprise",
    title: "Data Scientist course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581cb090ee1cfb09695c93_Data%20Science%20course-p-500.png",

    overview: `The Data Scientist program is designed to provide deep insights and practical skills in data analytics, machine learning, and advanced data management. This comprehensive course will empower you to analyze, interpret, and leverage data effectively across various business contexts.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is perfect for aspiring Data Analysts, Data Scientists, Machine Learning Engineers, and IT Professionals who wish to excel in the field of data science and analytics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "Comprehensive training through" },
      { icon: "📝", label: "Quizzes & Assessments", value: "" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Data Analyst",
      "Data Scientist",
      "Business Intelligence Analyst",
      "Machine Learning Engineer",
      "Database Administrator",
      "Prepare for effective incident response and management."
    ],

  careerText:"Equips you for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  careerSubText:"",
  skilsSubText:"",
  
  skills: [
      "Data Analytics",
      "Python Programming",
      "Machine Learning",
      "Statistical Analysis",
      "SQL Database Management",
      "Data Visualization with Tableau and Power BI",
    ],

    careerRoles: [
      "Data Analyst",
      "Data Scientist",
      "Business Intelligence Analyst",
      "Machine Learning Engineer",
      "Database Administrator"
    ],

    requirements: [
      "Basic knowledge of programming.",
      "Familiarity with the fundamentals of databases and data structures.",
      "A strong inclination towards data-driven problem solving."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieve a Certificate of Achievement that demonstrates your expertise in data science and analytics. Use this certification to enhance your job prospects and validate your skills in the competitive tech industry."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Courses are conducted by industry experts with extensive experience in data science and analytics."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This Skill Quest is structured to provide a solid foundation in data science, accelerating your potential for growth in technology-driven industries."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
      "Access restricted to enrolled users only.",
      "Data Analytics Basics   - Including Python, NumPy, and Pandas fundamentals.",
      "Statistical Analysis   - Covering everything from probability to complex statistical methods.",
      "SQL Server Management   - Learn to handle databases with proficiency.",
      "Data Visualization   - Mastering Tableau and Power BI to present data effectively.",
      "Machine Learning   - From theory to practical application using Python."
        ],
    vedio:"https://www.youtube.com/embed/qqpqTltdfGk?si=wKiAM5ib8C9HJr4u",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 12,
    slug: "enterprise",
    title: "Data Insights Architect course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581cc83d8701f3c5b26aba_Data%20Insights%20Architect%20course%20wireframe-p-500.png",

    overview: `The Data Insights Architect program is designed to provide you with a comprehensive understanding of data analysis using Python and Tableau. This course covers everything from basic programming in Python to advanced data manipulation and visualization in Tableau, equipping you with the necessary tools to analyze and interpret complex datasets effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is perfect for Data Analysts, Business Analysts, Aspiring Data Scientists, and anyone interested in gaining deep insights from data using Python and Tableau.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Data Analyst",
      "Business Analyst",
      "Data Scientist",
      "Business Intelligence Developer"
    ],
  careerText:"Equips you for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  careerSubText:"",
  skilsSubText:"",
  
  skills: [
      "Python Programming",
      "Statistical Analysis",
      "Data Manipulation and Visualization",
      "SQL Data Management",
      "Tableau Expertise"
    ],

    careerRoles: [
      "Data Analyst",
      "Business Analyst",
      "Data Scientist",
      "Business Intelligence Developer"
    ],

    requirements: [
      "Basic knowledge of programming concepts.",
      "Interest in data and analytics."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Complete this course to earn a Certificate of Achievement that showcases your expertise in data analytics to potential employers and your professional network."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry veterans with extensive experience in data science and business analytics."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Focused and structured learning to quickly elevate your skills in data analytics, making you a valuable asset to any organization."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
      "Data Analytics with Python:",
      "Basics of Python Programming   - Introduction, Operators, Conditional Statements, Loops, Functions, Data Structures",
      "Data Science Libraries   - Numpy, Pandas, Visualization with Matplotlib",
      "Statistics for Data Science   - Descriptive Statistics, Probability Distributions, Inferential Statistics",
      "Data Handling and Preparation   - Data Wrangling, Preparation Techniques",
      "SQL Server   - SQL Basics, Advanced SQL Techniques, Database Management",
      "Mastering Tableau:",
      "Introduction to Tableau   - Basics, Data Management, Advanced Features",
      "Data Visualization with Tableau   - Creating Charts and Graphs, Advanced Visualization Techniques",
      "Tableau in Depth   - Dashboard Design, Sharing and Publishing Insights"
        ],
        
    vedio:"https://www.youtube.com/embed/6eZ6QYcMc2c?si=NqIPYY_q7Rj5BMkD",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 13,
    slug: "enterprise",
    title: "Data Analytics with power BI and Tableau",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665848d21867a287a679da4f_Data%20Analytics%20with%20powerbi%20and%20tableau-p-500.png",

    overview: `The Data Analyst program is designed to equip you with critical data analytics skills using popular tools like Python, SQL Server, and Tableau. This comprehensive course covers everything from Python programming basics to advanced data visualization techniques, providing you with the knowledge needed to make data-driven decisions effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This Skill Quest is perfect for Data Analysts, Business Analysts, Data Science Enthusiasts, and IT Professionals who are looking to enhance their analytical skills and advance in the field of data analytics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "150" },
      { icon: "📝", label: "Quizzes & Assessments", value: "100" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "50 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Data Analyst",
      "Business Analyst",
      "SQL Developer",
      "Tableau Specialist",
      "Business Intelligence Analyst"
    ],
careerText:"Equips you for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  careerSubText:"",
    skilsSubText:"",
    skills: [
      "Python Programming",
      "SQL Data Management",
      "Data Visualization with Tableau and Power BI",
      "Statistical Analysis",
      "Data Science Libraries Utilization",
      "Advanced Data Handling Techniques"
    ],

    careerRoles: [
      "Data Analyst",
      "Business Analyst",
      "SQL Developer",
      "Tableau Specialist",
      "Business Intelligence Analyst"
    ],

    requirements: [
      "Basic understanding of computer operations.",
      "Familiarity with any programming language (preferable but not mandatory).",
      "A strong analytical mindset and a passion for data."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Successfully completing the course awards you a Certificate of Achievement**. Display your certificate to potential employers to enhance your job prospects and professional credibility."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "This structured Skill Quest is tailored to help you quickly acquire in-demand skills in data analytics, positioning you for success in a variety of industries."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Courses conducted by industry experts with extensive experience in data analytics and business intelligence."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

  syllabusText:"Note: Full course details available exclusively to enrolled users.",
      syllabus: [
      "Basics of Python Programming   — 10 hrs",
      "Data Science Libraries   — 8 hrs",
      "Statistics   — 6 hrs",
      "Data Analysis Foundations   — 10 hrs",
      "SQL Server   — 20 hrs",
      "Tableau   — 12 hrs",
      "POWER BI   — 10 hrs"
        ],
        
    vedio:"https://www.youtube.com/embed/IPhFcJEwucY?si=QKJIaapVKMYVahcy",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 21,
    slug: "Scrum Master",
    title: "Scrum Master",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66974e1d0dd16de716d5b90e_New%20Project%20(6)-p-500.png",

    overview: `The Scrum Master program is expertly designed to equip you with essential skills to lead and facilitate project teams in Agile environments. This course delves into the history, methodologies, and practical tools like JIRA, preparing you to handle real-world challenges and drive project success in any dynamic business setting.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Perfect for aspiring Scrum Masters, Agile Coaches, Project Managers, Team Leads, IT Professionals, and anyone interested in mastering Scrum practices to enhance their project management skills and career.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the historical context and evolution of Scrum.",
      "Explore why Scrum is the preferred Agile methodology.",
      "Gain proficiency in using JIRA and interpreting Agile charts.",
      "Prepare thoroughly for Scrum Master interviews with extensive question sets.",
      "Learn effective conflict resolution within sprints and maximize team productivity."
    ],

  careerText:"Equips you for roles such as:",
  careerSubText:"Equips you for professional roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  skilsSubText:"This Skill Quest boosts your proficiency in:",

    skills: [
      "Scrum Methodologies",
      "Agile Practices",
      "Project Facilitation",
      "Team Leadership",
      "Conflict Resolution",
      "JIRA Tool Utilization",
      "Effective Communication"
    ],

    careerRoles: [
      "Scrum Master",
      "Agile Coach",
      "Project Manager",
      "Team Leader",
      "Agile Project Facilitator"
    ],

    requirements: [
      "Basic understanding of project management principles.",
      "Familiarity with Agile and Scrum concepts.",
      "A strong commitment to developing leadership and facilitation skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieve a Certificate of Achievement upon course completion. Display your certification to potential employers and your professional network to elevate your career."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry experts with extensive experience in Agile methodologies and Scrum leadership."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our structured Skill Quests are designed to fast-track your growth in the field of project management, focusing on Agile and Scrum methodologies which are highly sought after by employers."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
      "SCRUM MASTER - History of Scrum   — 2 hrs",
      "Why Scrum? - Way of Scrum Working   — 2 hrs",
      "JIRA Tool Overview – Charts   — 3 hrs",
      "Interview Questions on Scrum (Part 1 & 2)   — 4 hrs",
      "Conflict Resolution and Effective Team Management   — 3 hrs",
      "Scrum Master Panel Questions and Answers   — 2 hrs",
      "Impediments for Scrum Masters   — 2 hrs",
      "Differences Between Scrum Masters and Project Managers   — 2 hrs"
        ],
        
    vedio:"https://www.youtube.com/embed/IPhFcJEwucY?si=QKJIaapVKMYVahcy",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 22,
    slug: "Salesforce Specialist",
    title: "Salesforce Specialist",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6697516f868f313a406d70ca_New%20Project%20(7)-p-500.png",

    overview: `The Salesforce Specialist program is expertly designed to guide you through the intricacies of Salesforce, from basic navigation to complex functionalities. Gain practical skills in Salesforce architecture, data management, automation tools, and more, enabling you to maximize CRM efficiency and support enterprise needs effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Perfect for CRM Analysts, Salesforce Administrators, Developers, IT Managers, and business professionals who aim to leverage Salesforce in their operations or career.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp the basics of Salesforce, including its ecosystem and architecture.",
      "Learn to manage user security and access settings effectively.",
      "Master data management and automation within Salesforce.",
      "Develop proficiency in Salesforce’s reporting and analytics capabilities.",
      "Execute data migration and integrate Salesforce with other systems."
    ],
  
  careerText:"Equips you for roles such as:",
  careerSubText:"Equip yourself for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  skilsSubText:"This Skill Quest empowers you with essential Salesforce skills:",

    skills: [
      "Salesforce Navigation and Setup",
      "Data Management and Security",
      "Automated Workflow Creation",
      "CRM Reporting and Analytics",
      "System Integration and Deployment"
    ],

    careerRoles: [
      "Salesforce Administrator",
      "CRM Analyst",
      "Salesforce Developer",
      "IT System Manager",
      "Business Solutions Consultant"
    ],

    requirements: [
      "Basic understanding of CRM concepts.",
      "Familiarity with database systems and cloud computing.",
      "A driven mindset focused on enhancing business processes through technology."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Completing this course awards a Certificate of Achievement , showcasing your Salesforce expertise to potential employers and your professional network."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Learn from industry leaders with extensive experience in implementing and managing Salesforce solutions across various sectors."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This structured Skill Quest is designed to fast-track your proficiency in Salesforce, making you a valuable asset to any technology-driven business."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

    syllabusText:"Note: Full course details available exclusively to enrolled users.",
      syllabus: [
          "Introduction to Salesforce   — 5 hrs",
          "Salesforce Objects and Data Management   — 5 hrs",
          "Security and Access   — 5 hrs",
          "Automation Tools   — 4 hrs",
          "Data Modeling and Management   — 4 hrs",
          "Salesforce Reporting and Analytics   — 4 hrs",
          "Salesforce Chatter and Collaboration   — 3 hrs",
          "Data Migration and Integration   — 3 hrs",
          "Deployment and Maintenance   — 3 hrs",
          "Advanced Topics   — 4 hrs"
        ],
        
    vedio:"https://www.youtube.com/embed/IPhFcJEwucY?si=QKJIaapVKMYVahcy",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
   {
    id: 23,
    slug: "Python Full Stack",
    title: "Python",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/668e2b7cf55408a8b7ce83d6_html-css-collage-concept-with-person-p-500.png",

    overview: `The Python Full Stack program is designed to transition you from a novice to a professional Python developer. You'll begin with the fundamentals of Python programming and progress through more complex topics, such as web development with Python, database management, and building real-world projects.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Perfect for aspiring software developers, system architects, backend developers, and programming enthusiasts looking to build a career in Python development.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Master Python syntax and script writing basics.",
      "Understand and implement Python's data structures like lists, tuples, and dictionaries.",
      "Develop skills in web development frameworks like Django or Flask.",
      "Gain proficiency in database management and file handling in Python.",
      "Complete hands-on projects, including a Python-based e-commerce system and an interactive message saver using Tkinter."
    ],

  careerText:"Equips you for roles such as:",
  careerSubText:"Equip yourself for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  skilsSubText:"This Skill Quest enhances your capability in:",


    skills: [
      "Python Programming",
      "Web Development with Python",
      "Database Management",
      "File Handling",
      "Object-Oriented Programming",
      "Software Development Best Practices",
      "Project Deployment"
    ],

    careerRoles: [
      "Python Developer",
      "Backend Developer",
      "Software Engineer",
      "Data Analyst",
      "System Architect"
    ],

    requirements: [
      "Basic understanding of programming concepts.",
      "Familiarity with any programming language is beneficial, but not required.",
      "A strong desire to learn and problem-solve in the programming field."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Successfully completing the course awards you a Certificate of Achievement . Utilize this certificate to enhance your professional profile and demonstrate your programming skills."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Courses led by seasoned software developers and educators with extensive experience in Python and web development."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our structured Skill Quests are designed to quickly escalate your skills in Python programming, preparing you for high-demand jobs in the tech industry."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

  syllabusText:"Note: Full course details available exclusively to enrolled users.",
      syllabus: [
          "Introduction to Python Programming   — 2 hrs",
          "Setting Up Your Development Environment   — 1 hr",
          "Variables and Data Types   — 2 hrs",
          "Working with Numeric Data   — 2 hrs",

          "Conditional Statements and Control Flow   — 2 hrs",
          "Loops and Iterations   — 2 hrs",
          "String Manipulation   — 2 hrs",

          "Regular Expressions   — 2 hrs",
          "Introduction to Lists   — 1 hr",
          "Functions and Modules   — 2 hrs",
          "Exception Handling   — 1 hr",
          "File Handling   — 2 hrs",
          "Object-Oriented Programming   — 2 hrs",
          "Advanced Topics   — 2 hrs",
          "Python Projects  : - Project 1: A Python-based e-commerce system,- Project 2: Tkinter Interactive Message Saver"
        ],
        
    vedio:"https://www.youtube.com/embed/IPhFcJEwucY?si=QKJIaapVKMYVahcy",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 24,
    slug: "Manual Tester",
    title: "Manual Tester",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66964116434d4121d8b600ba_man-working-energy-innovations-his-laptop-p-500.png",

    overview: `The Manual Tester program is intricately designed to develop your proficiency in validating software quality manually. Through this course, you will understand the core principles of manual testing, delve into different testing methodologies, and learn about the software development life cycle and software testing life cycle (STLC).`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Perfect for aspiring Software Testers, QA Analysts, Manual Test Engineers, and IT Professionals looking to enhance their testing skills and understanding of software quality assurance.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp the essentials of the Manual Testing process.",
      "Understand the Software Development Life Cycle (SDLC) and its significance in testing.",
      "Explore various Software Testing Methodologies.",
      "Learn about Static Techniques and their application in quality assurance.",
      "Examine different Levels of Testing to ensure comprehensive software quality.",
      "Dive into the Software Testing Life Cycle (STLC) and its phases.",
      "Understand the roles and responsibilities in Quality Assurance (QA) and Quality Control (QC)."
    ],

  careerText:"Equips you for roles such as:",
  careerSubText:"Equip yourself for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  skilsSubText:"This Skill Quest equips you with essential skills in:",


    skills: [
      "Manual Testing",
      "Software Quality Assurance",
      "Test Planning and Execution",
      "Defect Management",
      "Static Testing Techniques",
      "QA and QC Fundamentals"

    ],

    careerRoles: [
      "Manual Tester",
      "QA Analyst",
      "Test Engineer",
      "Software Quality Inspector"
    ],

    requirements: [
      "Basic IT literacy.",
      "Understanding of software development fundamentals.",
      "Keen attention to detail and a methodical approach to problem-solving."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieve a Certificate of Completion to demonstrate your expertise in Manual Testing to potential employers and enhance your career prospects."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry experts with extensive experience in software testing and quality assurance."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This structured Skill Quest focuses on practical skills and theoretical knowledge to fast-track your career in software testing."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",

   syllabusText:"Note: Full course details available exclusively to enrolled users.",
      syllabus: [
          "Manual Testing   — 2 hrs",
          "Software Development Life Cycle   — 3 hrs",
          "Software Testing Methodologies   — 3 hrs",
          "Static Techniques   — 3 hrs",

          "Levels of Testing   — 2 hrs",
          "Software Testing Life Cycle (STLC)   — 3 hrs",
          "QA & QC   — 2 hrs",
        ],
        
    vedio:"",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 25,
    slug: "Java Fullstack Development",
    title: "Java Fullstack",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66964163fe8db45492817727_programming-background-with-person-working-with-codes-computer-p-500.png",

    overview: `The Java Fullstack program is carefully designed to take you from Java fundamentals to advanced full-stack development. Learn to build robust backend systems and engaging front-end interfaces. Prepare to master frameworks like Spring and front-end technologies such as ReactJS, ensuring comprehensive skills in web development.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Perfect for aspiring Developers, Software Engineers, IT Professionals, and anyone interested in becoming proficient in both backend and frontend Java development.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Develop a strong foundation in Java programming and setup.",
      "Apply Object-Oriented Programming (OOP) principles in real-world scenarios.",
      "Manage database operations using Java with SQL.",
      "Explore web development fundamentals including JavaScript, HTML, and CSS.",
      "Harness Spring Framework for backend operations and RESTful services.",
      "Dive into modern front-end technologies and security practices in web development."
    ],
  careerText:"Equips you for roles such as:",
  careerSubText:"Prepares you for diverse roles in software development:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  skilsSubText:"This Skill Quest sharpens your expertise in:",

    skills: [
      "Java Programming",
      "Web Development",
      "Spring Framework",
      "Database Management",
      "Front-End Technologies",
      "Software Architecture",
      "Security Practices"

    ],

    careerRoles: [
      "Java Developer",
      "Full Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Web Developer"
    ],

    requirements: [
      "Basic knowledge of programming concepts.",
      "Familiarity with database operations.",
      "An eagerness to master full-stack development."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Obtain a Certificate of Achievement to enhance your professional credibility and showcase your comprehensive skills in Java full-stack development to potential employers."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry experts with extensive experience in Java and full-stack technologies."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Engage in a structured learning journey to fast-track your career in software development, focusing on high-demand skills across industries."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Java Programming Foundations: From Setup to Development   — 4 Chapters - Duration: 2 hrs",
          "Object-Oriented Programming and Practical Design   — Duration: 3 hrs",
          "Java Fundamentals and Basic Database Operations   — 4 Chapters - Duration: 3 hrs",
          "Web Development Fundamentals and Java Web Development Basics   — Duration: 4 hrs",
          "Spring Framework and Database Connectivity   — Duration: 3 hrs",
          "Front-End Development and Security in Web Development   — Duration: 2 hrs",
          "RESTful Web Services and Version Control   — Duration: 2 hrs",
          "Spring Boot Microservices and DevOps   — Duration: 3 hrs"
        ],
        
    vedio:"",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 26,
    slug: "Informatica Cloud Services",
    title: "Informatica Cloud Services",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66974d2d484c24ec11c2a9dc_New%20Project%20(5)-p-500.png",

    overview: `Informatica Cloud Services are designed to provide comprehensive data integration solutions that facilitate the connection, synchronization, and management of data across diverse platforms. You will explore key components like architecture, secure agent functionality, connectors, and task configuration to effectively manage data workflows.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for IT Professionals, Cloud Architects, Data Integration Specialists, and Data Engineers interested in mastering cloud data management and integration.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Gain a comprehensive understanding of Informatica Cloud Services architecture.",
      "Learn to configure and manage Secure Agents, connectors, and cloud components.",
      "Master data synchronization, replication, and masking tasks.",
      "Explore advanced features like Mass Ingestion, Taskflow, and Cloud Application Integration."
    ],
  careerText:"Equips you for roles such as:",
  careerSubText:"This training prepares you for roles such as:",
  skilsText:"This Skill Quest sharpens your expertise in:",
  skilsSubText:"This Skill Quest sharpens your expertise in:",

    skills: [
      "Cloud Data Integration",
      "Web Development",
      "Data Management",
      "Informatica Architecture",
      "Task Configuration",
      "Exception Handling"
    ],

    careerRoles: [
      "Cloud Data Integrator",
      "Informatica Developer",
      "Cloud Architect",
      "Data Integration Specialist"
    ],

    requirements: [
      "Basic knowledge of data management principles.",
      "Familiarity with cloud computing concepts.",
      "A strong foundation in database systems."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieve a Certificate of Achievement upon completion. Utilize this certification to demonstrate your capabilities in cloud data integration and boost your professional standing."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Courses delivered by industry professionals with extensive experience in Informatica Cloud Services and cloud data integration."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This structured Skill Quest is designed to fast-track your growth in the field of cloud data management, aligning with skills sought by employers globally."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Informatica Cloud Basics   — Architecture, Secure Agent, Connectors — 3 hrs",
          "Cloud Data Integration Services   — Setting up Integration Tasks — 4 hrs",
          "Synchronization and Replication Tasks   — Configuring and Running Tasks — 3 hrs",
          "Mapping and Masking Tasks   — Setup and Execution — 3 hrs",
          "Mass Ingestion and Taskflow   — Advanced Integration Techniques — 3 hrs",
          "Cloud Application Integration   — Exception Handling, Advanced Configurations — 4 hrs",
        ],
        
    vedio:"",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 27,
    slug: "SQL Server Course",
    title: "SQL Server Mastery",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66570bbe27b7dbfb0951d630_New%20Project-p-500.png",

    overview: `The SQL Server Mastery program is meticulously designed to provide you with a deep understanding of SQL Server database management and optimization. Learn SQL Server setup, database design, query management, and more. Equip yourself with essential skills to efficiently handle and optimize databases.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for Database Administrators, Data Analysts, IT Professionals, and those looking to specialize in database management using SQL Server.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Set up SQL Server and manage database environments.",
      "Develop and manage databases, mastering DML and DDL SQL commands.",
      "Understand and implement table structures, SQL alterations, and database constraints.",
      "Design efficient databases and perform advanced SQL operations and functions.",
      "Optimize database performance through indexing, views, and stored procedures."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "SQL Server Setup",
      "Database Management",
      "SQL Query Optimization",
      "Data Schema Design",
      "Performance Tuning",
      "Transactional Control"
    ],

    careerRoles: [
      "Database Administrator",
      "SQL Developer",
      "Data Analyst",
      "Systems Architect",
      "Performance Tuner"
    ],

    requirements: [
      "Basic understanding of database concepts.",
      "Familiarity with any programming language.",
      "A keen interest in data management and software development."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Successfully completing the course awards you a Certificate of Achievement . Use your certification to demonstrate your SQL Server expertise to potential employers and enhance your career prospects."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Courses led by seasoned SQL Server experts, each with extensive experience in database technologies."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our structured Skill Quests are designed to propel your career in database management, emphasizing skills that are crucial in the tech industry."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "SQL Server Setup & Basics   — 3 hrs",
          "Database Development and Management   — 3 hrs",
          "Mastering Table Structures and SQL Alterations   — 4 hrs",
          "Database Design and Environment Awareness   — 2 hrs",
          "Database Constraints and SQL Query Management   — 3 hrs",
          "Data Management and Query Techniques   — 3 hrs",
          "Data Operations and Functions in SQL   — 3 hrs",
          "Mastering SQL Joins and Queries   — 3 hrs",
          "Optimizing Database Performance with SQL Views   — 2 hrs",
          "Mastering SQL Indexing: Retrieval and Query Optimization   — 2 hrs",
          "Mastering Stored Procedures for Efficient SQL Management   — 3 hrs",
          "SQL Transactions: Control Actions and Query Operations   — 2 hrs",
          "SQL Triggers and Queries for Online Shopping Data   — 2 hrs",
          "Performance Tuning   — 2 hrs",
          "Database Backup and Restore Fundamentals   — 2 hrs",
          "SQL Server Comprehensive Q&A   — 2 hrs",
          "Data Management and Schema Design in Enterprise Applications   — 3 hrs"
        ],
    vedio:"https://www.youtube.com/embed/GcscaneDmxg?si=efLjwjYK0Go4G7Xi",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 28,
    slug: "Rabbit MQ Course",
    title: "RabbitMQ Mastery",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813830f5cb46af22d2a69_Flutter%20(1)-p-500.png",

    overview: `The RabbitMQ Mastery program is expertly designed to teach you the intricacies of RabbitMQ, a critical component in modern software architecture. This course covers everything from AMQP fundamentals to advanced integration techniques with Docker and Kubernetes, equipping you with the skills needed to develop, maintain, and scale robust messaging solutions.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is ideal for Software Developers, System Architects, DevOps Engineers, IT Professionals, and anyone interested in mastering message queue systems for scalable software solutions.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Deep dive into AMQP fundamentals and RabbitMQ anatomy.",
      "Learn to integrate RabbitMQ with Spring Boot and manage consumer implementations.",
      "Develop real-time applications utilizing RabbitMQ.",
      "Conduct unit testing with JUNIT in RabbitMQ environments.",
      "Understand and implement HA clustering to ensure high availability in production.",
      "Compare Kafka and RabbitMQ for better architectural decisions.",
      "Prepare for job interviews with comprehensive RabbitMQ knowledge."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "AMQP Protocols",
      "RabbitMQ Implementation",
      "Real-Time Application Development",
      "Unit Testing with JUNIT",
      "High Availability Systems",
      "Software Architecture",
      "Docker and Kubernetes Integration"
    ],

    careerRoles: [
      "System Architect",
      "Messaging System Developer",
      "DevOps Engineer",
      "Software Tester",
      "Cloud Solutions Architect"
    ],

    requirements: [
      "Basic programming knowledge in Java or similar languages.",
      "Familiarity with Spring Boot and basic software architecture concepts.",
      "Interest in messaging systems and software scalability."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Earn a Certificate of Achievement to showcase your newfound expertise in RabbitMQ to potential employers, bolstering your professional credentials and marketability."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by professionals with extensive experience in software architecture and message queue systems."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our structured Skill Quests fast-track your career progression in software development and system architecture, focusing on in-demand skills."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "AMQP Fundamentals & Anatomy   — Comprehensive exploration through six parts.",
          "RabbitMQ with Spring Boot   — Detailed integration and consumer implementation.",
          "Real-Time Application Development with RabbitMQ   — Practical application development.",
          "Unit Testing with JUNIT   — Testing practices in RabbitMQ environments.",
          "HA Clustering RabbitMQ   — Production-ready application setups.",
          "Kafka vs RabbitMQ   — Comparative analysis.",
          "RabbitMQ Interview Preparation   — Key concepts and common questions.",
          "AWS SQS Programming with RabbitMQ and Spring Boot   — Cloud messaging solutions.",
          "Advanced Docker & Kubernetes Concepts   — Enhancing deployment and scalability.",
          "Advanced Messaging with RabbitMQ   — Integration, comparison, and testing insights.",
        ],
        
    vedio:"https://www.youtube.com/embed/vKqYZmqDMI4?si=tpOCIuNb4mq2AT4a",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 29,
    slug: "PHP Programming Course",
    title: "PHP Programming Course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665719488610bdc9a10acd20_PHP%20Course-p-500.png",

    overview: `The PHP Programming course is expertly designed to teach you the fundamentals and advanced concepts of PHP. From setting up environments to mastering object-oriented programming, you will acquire the skills needed to develop robust web applications and services.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is perfect for Web Developers, Backend Developers, Software Engineers, and aspiring programmers who wish to gain a deep understanding of PHP and its applications in web development.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Gain a solid understanding of PHP syntax, variables, and control structures.",
      "Learn to configure development environments across different operating systems.",
      "Master PHP functions, error handling, and exception management.",
      "Explore object-oriented programming, including classes, inheritance, and polymorphism.",
      "Integrate PHP with MySQL for database operations and management."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "PHP Programming",
      "Web Application Development",
      "Database Integration",
      "Object-Oriented Programming",
      "Error Management"
    ],

    careerRoles: [
      "Web Developer",
      "Backend Developer",
      "PHP Programmer",
      "Software Engineer"
    ],

    requirements: [
      "Basic programming knowledge.",
      "Familiarity with web technologies (HTML/CSS).",
      "Enthusiasm for learning web development."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Complete the course to earn a Certificate of Achievement . This certification can significantly boost your professional profile and open new career opportunities in web development and programming."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry experts with extensive experience in PHP and web technologies."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our structured Skill Quest is designed to fast-track your growth in the field of web development, focusing on practical skills and comprehensive understanding."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Introduction to PHP   — 4 Modules",
          "Setting Up PHP Development Environments   — 8 Modules",
          "PHP Fundamentals: Syntax, Variables, and Control Structures   — 8 Modules",
          "Fundamentals of PHP Functions   — 6 Modules",
          "PHP and Web Forms   — 5 Modules",
          "PHP Arrays   — 5 Modules",
          "PHP String Manipulation   — 4 Modules",
          "Fundamentals of Object-Oriented Programming   — 8 Modules",
          "Integrating PHP with MySQL   — 7 Modules",
          "Error Handling and Exceptions   — 6 Modules",
          "Advanced PHP: Techniques, Integration, and Security   — 7 Modules",
          "Modern PHP Practices and Tools   — 5 Modules",
          "Extending PHP   — 4 Modules",
          "Future of PHP   — 4 Modules",
          "PHP Function Reference   — 2 Modules"
        ],
        
    vedio:"https://www.youtube.com/embed/6eZ6QYcMc2c?si=LtJWVTuxuP_H5jz1",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 30,
    slug: "Laravel course",
    title: "Laravel Architect",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581391cebe5e7a47e0a5f3_laraval-p-500.png",

    overview: `The Laravel Architect program is designed to guide you through every aspect of Laravel, from basic setup to advanced application techniques. This course is structured to help you build sophisticated web applications using Laravel, enhancing your skills in modern web development.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Perfect for Web Developers, PHP Programmers, Backend Developers, and aspiring Full-Stack Developers interested in mastering Laravel for professional application development.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Gain a comprehensive understanding of Laravel’s structure and its role in modern web development.",
      "Set up a development environment and configure Laravel for different projects.",
      "Master routing, middleware, controllers, and advanced backend techniques.",
      "Develop proficiency in database management, Eloquent ORM, and authentication methods.",
      "Implement testing, deployment, and security best practices."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Laravel Development",
      "Web Application Architecture",
      "Backend Programming",
      "Database Management",
      "Authentication and Security",
      "Testing and Deployment"
    ],

    careerRoles: [
      "Laravel Developer",
      "Backend Developer",
      "Full-Stack Developer",
      "Web Application Architect",
      "PHP Developer"
    ],

    requirements: [
      "Fundamental knowledge of PHP and web development.",
      "Basic understanding of MVC architecture.",
      "Eagerness to learn advanced web development techniques."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Earn a Certificate of Achievement to bolster your resume and showcase your advanced Laravel skills to potential employers and peers."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experienced developers and Laravel experts with in-depth knowledge and industry experience."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Structured to fast-track your growth in web development, focusing on comprehensive Laravel techniques and industry practices."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Introduction to Laravel   — Essentials and Setup — 2 hrs",
          "Setting Up and Installation   — Configuration and Environment — 3 hrs",
          "Routing in Laravel   — From Basics to Advanced — 2 hrs",
          "Middleware and Controllers   — Implementation and Usage — 3 hrs",
          "Views and Blade Templating   — Building Dynamic UI — 3 hrs",
          "Database Management   — Techniques and Optimization — 2 hrs",
          "Eloquent ORM   — Data Manipulation and ORM Techniques — 3 hrs",
          "Authentication and Security   — Secure Web Applications — 2 hrs",
          "Testing in Laravel   — Ensuring Code Quality — 2 hrs",
          "Advanced Laravel Topics   — APIs and Real-Time Applications — 3 hrs",
          "Deployment and Best Practices   — Going Live with Applications — 2 hrs",
          "Capstone Project   — Comprehensive Application Development — 3 hrs",
          "Additional Resources and Continued Learning   — Engaging with the Laravel Community — 1 hr",
        ],
        
    vedio:"https://www.youtube.com/embed/iXbBpr4SbMA?si=IXmm5f8gAVS_lPDn",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 31,
    slug: "Golang Masterclass",
    title: "Golang Masterclass",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658139d8a99149c8af3ac6d_golang%20Course-p-500.png",

    overview: `The Golang Masterclass program is designed to thoroughly instruct you in the Go programming language. From foundational concepts to advanced programming techniques, this course ensures you become proficient in creating efficient, scalable, and powerful applications using Go.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is perfect for software developers, IT professionals, and computer science students who are eager to expand their programming skills or specialize in Go for professional advancement.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp the syntax, data handling, and control structures in Go.",
      "Explore advanced features like concurrency models, memory management, and robust error handling.",
      "Develop practical skills in web development, testing, benchmarking, and more.",
      "Engage with real-world projects to apply your learning practically."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Go Programming Fundamentals",
      "Concurrent and Parallel Programming",
      "System and Network Programming",
      "Web Development with Go",
      "Software Testing and Benchmarking",
      "Package and Dependency Management"
    ],

    careerRoles: [
      "Go Developer",
      "Systems Programmer",
      "Back-End Developer",
      "DevOps Engineer",
      "- Software Tester"
    ],

    requirements: [
      "Understanding of basic programming concepts.",
      "Familiarity with command-line interfaces and software development principles.",
      "An enthusiasm for learning new programming languages."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Upon completing this extensive Golang course, receive a Certificate of Achievement that enhances your resume and showcases your expertise in Go programming to potential employers."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experienced professionals renowned in the software development industry, particularly skilled in Go."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Structured to fast-track your career in technology, this Skill Quest prepares you to meet the demands of modern software development and technology jobs focusing on Go."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          " Introduction to Go   – 4 hrs",
          "Basics, history, advantages, and setting up",
          "Fundamentals of Go Programming   – 6 hrs",
          "-Syntax, data handling, control flow, and functions",
          "Data Structures and Type Systems in Go   – 6 hrs",
          "- Structures, maps, slices, arrays, and type systems",
          "Advanced Golang   – 6 hrs",
          "- Methods, memory management, error handling",
          "Mastering Concurrency in Go   – 6 hrs",
          "- Goroutines, channels, select statements",
          "Managing Packages and Workspaces   – 4 hrs",
          "- Package management, custom packages, dependency management",
          "Testing and Benchmarking   – 4 hrs",
          " - Writing tests, mocking, dependency injection",
          " Networking and Web Development   – 5 hrs",
          " Networking basics, RESTful APIs, web sockets",
          "Persistence and Databases   – 5 hrs",
          "- File IO, JSON/XML, database integration",
          "Advanced Go Programming   – 6 hrs",
          " Optimization, secure coding, CI/CD integration",
          " Community and Ecosystem   – 1 hr",
          "Conclusion and Future Prospects   – 2 hrs",
          "Troubleshooting Common Go Errors   – 3 hrs",
          "Golang with AI   – 2 hrs"
        ],
        
    vedio:"https://www.youtube.com/embed/pXOLnxlyOoU?si=CBoRyuuWdwrv15fW",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 32,
    slug: "Flutter Developer Course",
    title: "Flutter Developer",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813af3a156fbcededbaa0_Flutter-p-500.png",

    overview: `The Flutter Developer program is designed to provide a thorough understanding of Flutter and Dart, enabling you to build high-quality applications for mobile, web, and desktop. From setting up your development environment to deploying your apps, this course covers everything you need to become a proficient Flutter developer.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for Software Developers, Mobile App Developers, UI/UX Designers, and aspiring programmers who wish to master cross-platform development using Flutter.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Gain a solid foundation in Flutter and Dart fundamentals.",
      "Learn to set up a development environment for Flutter projects.",
      "Understand and implement state management techniques.",
      "Master building UI components and managing layouts in Flutter.",
      "Explore advanced topics like networking, persistent storage, and animations.",
      "Develop and deploy full-fledged applications for Android and iOS."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Flutter Development",
      "Dart Programming",
      "UI/UX Design",
      "State Management",
      "Data Storage Solutions",
      "Application Deployment"
    ],

    careerRoles: [
      "Flutter Developer",
      "Mobile Application Developer",
      "Frontend Developer",
      "Cross-platform Developer"
    ],

    requirements: [
      "Basic programming knowledge.",
      "Familiarity with object-oriented programming concepts.",
      "Enthusiasm for mobile and web application development."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Obtain a Certificate of Achievement upon completion, showcasing your expertise in Flutter development to potential employers and your professional network."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry veterans specializing in mobile and web development technologies."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our Skill Quest is designed to provide you with industry-relevant skills that are highly sought after in the tech industry, speeding up your career progression."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Introduction to Flutter",
          "- Flutter Fundamentals and Dart Overview",
          "Flutter Development Setup and Initialization",
          "- Setting up the development environment, Installing Flutter SDK",
          "Fundamentals of Dart Programming",
          "- Basics of Dart, Variables, Data Types, Control Flow",
          "Foundations of Flutter Widgets",
          " - Basic and Commonly Used Widgets, Stateless vs. StatefulWidget",
          "Fundamentals of State Management in Flutter",
          "Techniques and Tools for Effective State Management",
          " UI Components and Navigation Techniques",
          "- Advanced Widgets, Routes, Navigation Bar, Forms",
          "Networking, Fetching data from APIs, Data Parsing",
          "Mobile Data Storage Techniques",
          "- Persistent Storage with SQLite, CRUD operations",
          "Package Management and Publishing",
          "- Using and publishing packages on `pub.dev`",
          "Flutter Testing Fundamentals",
          "- Testing and Debugging Techniques",
          "Flutter App Development Lifecycle",
          "- Deploying Apps, App Signing, Publishing to App Stores",
          "Advanced Flutter Development Techniques",
          "- Flutter for Web and Desktop, Integrating Firebase",
          "Web Development and Multithreading with Flutter",
          "- Building websites and webservices using Flutter"
        ],
        
        
    vedio:"https://www.youtube.com/embed/d4FFoO52vFY?si=6I5YOWdeN7nLocRV",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 33,
    slug: "Django Course",
    title: "Django Developer",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813bfed43dc6037008fa4_Django%20Course-p-500.png",

    overview: `The Django Developer program is expertly crafted to equip you with the skills necessary to build, deploy, and manage robust web applications using Django. Learn from the ground up: from basic concepts and environment setup to advanced features like REST API integration and deployment strategies.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This program is perfect for aspiring Web Developers, Python Programmers, Back-end Developers, IT Professionals, and students looking to build practical, scalable web applications using Django.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp the foundational concepts of Django, including its MVT architecture and core principles.",
      "Set up a Django development environment and create your first Django project.",
      "Explore Django models and database management with ORM.",
      "Implement Django forms, authentication systems, and REST APIs.",
      "Master deployment strategies involving Gunicorn, Nginx, and security practices.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",


    skills: [
      "Web Development with Django",
      "Python Programming",
      "Database Management",
      "REST API Development",
      "Web Application Deployment",
      "Security Implementation"
    ],

    careerRoles: [
      "Django Developer",
      "Full-stack Developer",
      "Back-end Developer",
      "Web Application Developer",
      "Python Programmer"
    ],

    requirements: [
      "Proficient in Python programming.",
      "Understanding of web development basics.",
      "Eagerness to develop complex web applications."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieve a Certificate of Completion to boost your career prospects and showcase your expertise in Django development to potential employers."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Guided by professionals with years of experience in web development and teaching Python and Django."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Fast-track your web development career with practical, hands-on knowledge and technical skills that are in high demand."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Foundations of Django   — Architecture, Principles",
          "Setting Up Django   — Environment and Basic Project Configuration",
          "Mastering Django Models   — Database Design and ORM",
          "Web Routing and View Management   — URL Configuration and Views",
          "Web Template Design   — Creating and Managing Templates",
          "Mastering Django Forms   — Form Handling and Customizations",
          "User Management and Authentication   — Secure User Operations",
          "Advanced Database Management   — Complex Relationships and Efficiency",
          "Effective Testing Strategies   — Ensuring Robust Applications",
          "Advanced API Development   — REST Framework Techniques",
          "Advanced Deployment and Security   — Deployment Strategies for Production",
          "Optimizing Django   — Enhancing Performance and Security",
        ],
        
        
    vedio:"https://www.youtube.com/embed/tiYpQjmXFz0?si=pruJ-GTyQDX4N2-M",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
   {
    id: 34,
    slug: "Base SAS and Advance SAS course",
    title: "SAS Mastery",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813d90838c9f8bb3a3c27_SAAS-p-500.png",

    overview: `The SAS Mastery program is designed to guide you through Base SAS and Advanced SAS programming, focusing on comprehensive data manipulation, analysis, and reporting. Gain in-depth knowledge on how to leverage SAS in varied scenarios from academic environments to advanced business applications.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Perfect for Data Analysts, Statisticians, Business Analysts, and anyone keen on mastering SAS programming from the ground up.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Navigate the basics of SAS and its environment including SAS OnDemand for Academics.",
      "Understand and utilize SAS programming, libraries, and data management techniques.",
      "Develop skills in data manipulation, merging, and handling complex data structures with SAS.",
      "Learn to apply SAS functions effectively in real-world scenarios.",
      "Prepare for industry needs with advanced reporting, graphing, and statistical analysis using SAS.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "SAS Programming",
      "Data Management",
      "Statistical Analysis",
      "Data Reporting",
      "Advanced SAS Techniques"
    ],

    careerRoles: [
      "SAS Programmer",
      "Data Analyst",
      "Statistical Analyst",
      "SAS Data Consultant"
    ],

    requirements: [
      "Basic understanding of programming concepts.",
      "Interest in data analysis and statistical methods.",
      "Eagerness to develop advanced SAS programming skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieving this certification demonstrates your ability to handle sophisticated data analysis and reporting tasks using SAS. Show off this credential to enhance your professional credibility and marketability."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Learn from industry leaders and experienced professionals who bring a wealth of practical knowledge and insights in SAS programming.."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This structured, skill-focused program is designed to accelerate your progression in data-driven industries, making you a valuable asset to any analytics team."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Introduction to SAS",
          "  - Getting Started with SAS: Basics to OnDemand for Academics",
          "SAS Programming Essentials",
          "  - Mastering SAS Basics: Environment, Syntax, and Data Handling",
          "Advanced Data Management",
          "- Techniques for Advanced Data Structuring and Management",
          "SAS Reporting and Graphics",
          "- Mastering Reporting and Data Visualization with SAS",
          "SAS for Statistical Analysis",
          "- Utilizing SAS for Complex Statistical Analysis"
        ],
        
        
    vedio:"https://www.youtube.com/embed/V7_18_Xg7uw?si=Qa6JpVmQqhRvHWId",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise", highlight: false }
    ]
  },
  {
    id: 41,
    slug: "Medical Coding Master",
    title: "Medical Coding Master",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/668e4fa8c6719b7cb85eb262_doctor-workplace-with-stethoscope-p-500.png",

    overview: `The Medical Coding Master program is meticulously crafted to provide you with robust skills for accurately coding medical diagnoses and treatments. You will learn to navigate various systems of the human body, understand the related medical terminology, and apply this knowledge in coding with precision. Prepare to become a pivotal part of healthcare operations, ensuring accurate medical billing and documentation.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand and apply medical terminology across different body systems.",
      "Accurately code diagnoses and procedures for various systems using ICD and CPT codes.",
      "Grasp detailed anatomy and physiology for accurate medical documentation.",
      "Navigate medical billing processes and compliance with healthcare regulations.",
      "Develop a skilled portfolio demonstrating competency in real-world medical coding projects.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"Prepares you for roles such as:",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"This Skill Quest enhances your capability in",


    skills: [
      "Medical Terminology",
      "Diagnostic Coding",
      "Procedure Coding",
      "Healthcare Billing",
      "Compliance and Regulations",
      "Anatomical Knowledge"
    ],

    careerRoles: [
      "Medical Coder",
      "Billing Specialist",
      "Health Information Technician",
      "Medical Records Coordinator",
      "Compliance Officer"
    ],

    requirements: [
      "Basic understanding of biology and human anatomy.",
      "Keen attention to detail and a methodical approach to data management.",
      "A strong foundation in problem-solving and analytical skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Successfully completing the course awards you a Certificate of Achievement . Showcase your certification to potential employers and your professional network, enhancing your credentials and competitive edge in the healthcare industry."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Courses led by seasoned healthcare professionals and coding experts with years of practical experience in medical documentation and compliance."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our skill-based Skill Quests are structured to fast-track your career growth in medical coding, focusing on in-demand skills in the healthcare sector."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Female Reproductive System   — 2 hrs",
          "Urinary System   — 2 hrs",
          "Integumentary System   — 2 hrs",
          "Musculoskeletal System   — 3 hrs",
          "Cardiovascular System   — 3 hrs",
          "Respiratory System   — 2 hrs",
          "Blood System Anatomy   — 2 hrs",
          "Sense Organs: The Eye and The Ear Anatomy   — 2 hrs",
          "Male Reproductive System Anatomy   — 2 hrs",
          "Endocrine System   — 2 hrs",
          "Nervous System   — 2 hrs",
          "Digestive System   — 2 hrs"
        ],
        
        
    vedio:"",
    pricing: [
      { title: "Access Only This Skill Quest ₹40,999", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 42,
    slug: "Technical Content Writer Basic Level",
    title: "Technical Content Writer Basic Level",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665814f337eac2582951c4a2_Technical%20content%20writer%20basic%20level-p-500.png",

    overview: `The Technical Content Writer Basic Level program is expertly designed to develop your skills in creating precise and clear technical documentation. Engage in comprehensive training on technical writing fundamentals, effective communication, and the use of essential tools and technologies.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the essentials of technical writing and documentation.",
      "Master grammar and editing for clear communication.",
      "Learn to use major tools and technologies for technical writing.",
      "Develop skills in creating visual aids and effective documentation design.",
      "Build a professional portfolio that showcases your writing prowess.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",
    
    skills: [
      "Technical Writing",
      "Documentation Process",
      "Grammar and Editing",
      "Clear Communication",
      "Use of Technical Writing Tools",
      "Documentation Design"
    ],

    careerRoles: [
      "Technical Writer",
      "Documentation Specialist",
      "Content Strategist",
      "Communications Coordinator"
    ],

    requirements: [
      "Basic proficiency in English language and grammar.",
      "Interest in technical subjects and writing.",
      "Desire to develop professional writing skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Earn a Certificate of Achievement that demonstrates your new skills in technical writing, making you a valuable asset to potential employers."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Courses led by experts with extensive experience in technical communication and instructional design."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our skill-based Skill Quests are specifically structured to fast-track your career in technical writing, focusing on practical skills and industry demands."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Data Analytics Basics   - Including Python, NumPy, and Pandas fundamentals.",
          "Statistical Analysis   - Covering everything from probability to complex statistical methods.",
          "SQL Server Management   - Learn to handle databases with proficiency.",
          "Data Visualization   - Mastering Tableau and Power BI to present data effectively.",
          "Machine Learning   - From theory to practical application using Python."
        ],
        
        
    vedio:"https://www.youtube.com/embed/XRudAUBaZyo?si=41cho0hBqkT1SF1V",
    pricing: [
      { title: "Access Only This Skill Quest ₹7,999", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
   {
    id: 43,
    slug: "Technical Content Writer Advance Level",
    title: "Technical Content Writer Advance Level",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658150a484367e5a7197efa_Technical%20content%20writer%20-%20Advance%20level-p-500.png",

    overview: `The Technical Content Writer Advance Level program is designed to deepen your expertise in technical writing and documentation. This course covers everything from the fundamentals to advanced tools and strategies, preparing you to create detailed, clear, and user-focused documentation. Sharpen your skills to become a top-tier technical writer in the industry.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the core principles of technical writing and documentation.",
      "Explore essential technical writing processes and tools.",
      "Develop skills in technical style and task analysis.",
      "Gain mastery over the foundations of technical documentation.",
      "Learn to utilize advanced tools and software essential for technical writing.",
      "Create impactful technical documents with advanced design and format techniques.",
      "Acquire strategic insights to enhance your technical writing career."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Technical Writing",
      "Documentation Design",
      "Advanced Content Formatting",
      "Use of Technical Writing Tools and Software",
      "Task Analysis and Technical Style"
    ],

    careerRoles: [
      "Senior Technical Writer",
      "Lead Documentation Specialist",
      "Technical Content Strategist",
      "Documentation Manager"
    ],

    requirements: [
      "Basic to intermediate knowledge of technical writing.",
      "Experience with standard documentation tools.",
      "A strong foundation in writing and editing."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieving this course provides a Certificate of Achievement . Utilize this certificate to demonstrate your advanced technical writing skills to employers and advance your career."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry veterans with extensive experience in technical communication and documentation."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Advance quickly in your career by acquiring specialized skills in technical writing that are highly sought after in the tech industry."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Fundamentals of Technical Writing and Documentation   — 2 hrs",
          "Technical Writing Essentials: Processes and Tools   — 2 hrs",
          "Technical Style and Task Analysis   — 2 hrs",
          "Foundations of Technical Documentation   — 2 hrs",
          "Technical Writing: Tools and Software Essentials   — 2 hrs",
          "Advanced Technical Documentation: Design and Format   — 2 hrs",
          "Mastering Advanced Technical Writing: Tools and Career Strategies   — 2 hrs"
        ],
        
        
    vedio:"https://www.youtube.com/embed/6eZ6QYcMc2c?si=pcorI-GL65lPNUVP",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 44,
    slug: "Tableau Master",
    title: "Tableau Master",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658152460758a2209601c69_Tableau%20Course-p-500.png",

    overview: `The Tableau Master program is expertly designed to empower you with essential skills for effective data visualization and analysis using Tableau. You will delve into the fundamentals of Tableau, advanced data management, calculation techniques, filtering methods, and master the art of crafting insightful dashboards.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the basics of Tableau and set up your environment.",
      "Manage data effectively within Tableau and perform complex workbook operations.",
      "Master advanced calculations, functions, and Tableau’s powerful analytics capabilities.",
      "Utilize filtering techniques to refine data visualization.",
      "Create compelling and interactive charts, graphs, and dashboards.",
      "Explore advanced visualization techniques including motion charts and waterfall charts.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Tableau Basics and Setup",
      "Data Management",
      "Advanced Calculations",
      "Data Visualization",
      "Dashboard Design",
      "Sharing Insights with Tableau Public"
    ],

    careerRoles: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Data Visualization Specialist",
      "Tableau Consultant"
    ],

    requirements: [
      "Basic knowledge of data analysis concepts.",
      "Familiarity with any spreadsheet software like Microsoft Excel.",
      "A keen interest in data visualization and business intelligence."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Gain a Certificate of Achievement that showcases your expertise in Tableau to potential employers and your professional network, enhancing your job prospects and credibility."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Learn from industry experts with extensive experience in data analytics and business intelligence, bringing real-world applications into the classroom."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our structured learning path in Tableau is designed to boost your analytical skills quickly and effectively, preparing you for immediate application in any business context."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Introduction to Tableau: Basics, Setup, and Essential Features   — 2 hrs",
          "Tableau Data Management and Workbook Operations   — 3 hrs",
          "Advanced Tableau Calculations and Functions   — 3 hrs",
          "Tableau Filtering Techniques   — 3 hrs",
          "Tableau Chart Techniques: Mastering Data Visualization   — 3 hrs",
          "Mastering Tableau: Dashboard Design and Formatting   — 2 hrs",
          "Mastering Tableau Public: From Basics to Sharing Insights   — 2 hrs"
        ],
        
        
    vedio:"https://www.youtube.com/embed/LWJoF1p20cA?si=vWz2Av1kj7lxnlUB",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 45,
    slug: "Reception Course",
    title: "Reception Course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658168bf11a8e5e14b861a1_Reception%20Course-p-500.png",

    overview: `The Reception Course is carefully designed to prepare you for a dynamic role at the forefront of an organization. This program covers everything from effective communication to advanced office management, ensuring you are equipped to handle the diverse demands of a receptionist's role.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "30" },
      { icon: "📝", label: "Quizzes & Assessments", value: "60" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "25 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the critical role of receptionists in shaping organizational culture.",
      "Master verbal, non-verbal, and digital communication techniques.",
      "Learn principles of excellent customer service tailored for diverse clientele.",
      "Acquire essential administrative skills including scheduling, record keeping, and managing office equipment.",
      "Enhance your professional image and develop career advancement skills.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",


    skills: [
      "Effective Communication",
      "Customer Service Excellence",
      "Office Administration",
      "Software Proficiency",
      "Task Management",
      "Professional Development"
    ],

    careerRoles: [
      "Receptionist",
      "Administrative Assistant",
      "Front Desk Manager",
      "Office Coordinator"
    ],

    requirements: [
      "High school diploma or equivalent.",
      "Basic proficiency in English.",
      "Familiarity with basic office software."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Gain a Certificate of Achievement to showcase your comprehensive training in reception and administrative skills, enhancing your employability and professional credibility."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experts with extensive experience in administrative roles and corporate training."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our targeted Skill Quest ensures you rapidly acquire the skills necessary for success in reception and administration roles."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Overview of the Receptionist Role",
          "Verbal and Non-Verbal Communication Techniques",
          "Principles of Excellent Customer Service",
          "Essential Office Administration and Management Skills",
          "Familiarization with Common Software Tools",
          "Prioritizing Tasks for Receptionists",
          "Professional Development and Career Advancement Essentials",
          "Basic Health and Safety Guidelines in the Workplace",
          "Advanced Communication and Inclusivity Skills for Diverse Workplaces",
          "The Importance of Discretion and Confidentiality",
          "Simulated Reception Scenarios",
          "Course Review and Evaluation"
        ],
        
        
    vedio:"https://www.youtube.com/embed/WG75YHw3BqY?si=us7W8V2iQn0KgJJY",
    pricing: [
      { title: "Access Only This Skill Quest ₹4,999", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 46,
    slug: "Power BI Mastery",
    title: "Power BI Mastery",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658169e9186d46c6f0c13f4_power%20bi-p-500.png",

    overview: `The Power BI Mastery program is expertly designed to transform you into a data wizard, adept at leveraging Power BI to enhance business intelligence. Explore comprehensive modules covering everything from data warehousing basics to advanced DAX and data visualization techniques.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "50" },
      { icon: "📝", label: "Quizzes & Assessments", value: "60" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "25 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp foundational concepts of business intelligence and data warehousing.",
      "Set up and optimize Power BI environments for robust data analysis.",
      "Utilize Power BI tools to create impactful data visualizations and reports.",
      "Perform advanced data analysis using DAX expressions.",
      "Complete hands-on projects to build a professional BI portfolio.",
    ],
    
    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Business Intelligence",
      "Data Warehousing",
      "Data Visualization",
      "Power BI Tools",
      "DAX and Data Modeling"
    ],

    careerRoles: [
      "Business Intelligence Analyst",
      "Data Analyst",
      "Power BI Consultant",
      "Data Visualization Expert",
      "Reporting Specialist"
    ],

    requirements: [
      "A basic understanding of databases and data analysis.",
      "Eagerness to learn about advanced data manipulation and visualization.",
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieve a Certificate of Achievement upon course completion to elevate your professional profile and validate your skills in Power BI."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry veterans with extensive experience in data analytics and business intelligence."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Focus on high-demand skills in business intelligence that are crucial in the data-driven job market."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Foundations of BI and Data Warehousing   — 2 hrs",
          "Mastering Power BI: Fundamentals and Elements   — 2 hrs",
          "Introduction to Power BI: Installation and Overview   — 3 hrs",
          "... [List continues up to Module 34]",
        ],
        
        
    vedio:"https://www.youtube.com/embed/K1Z9cJmrdyk?si=gz-g3eC7D8y32cE2",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 47,
    slug: "Office Administrator",
    title: "Office Administration Course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581b023ab4092c105393c2_Administration-p-500.png",

    overview: `The Office Administrator program is carefully designed to enhance your administrative capabilities in modern office settings. You will learn about the evolution of office administration, the role of administrators, advanced office software skills, and much more. Prepare yourself to manage office environments efficiently and support business operations effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the history and development of office administration.",
      "Master workplace design, health, and communication skills.",
      "Gain proficiency in advanced computer skills and office software applications.",
      "Learn techniques for managing workplace efficiency, including stress management and organization.",
      "Acquire fundamental knowledge in bookkeeping, project management, and event planning.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Office Management",
      "Business Communication",
      "Document Management",
      "Workplace Health and Safety",
      "Time Management",
      "Bookkeeping and Budgeting",
      "Project and Event Planning",
    ],

    careerRoles: [
      "Office Manager",
      "Administrative Assistant",
      "Executive Secretary",
      "Receptionist",
      "Records Manager"
    ],

    requirements: [
      "Basic knowledge of office environments.",
      "Familiarity with common office software.",
      "Interest in developing administrative skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Gain a Certificate of Achievement that enhances your professional credibility and marketability in the administrative field."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Learn from industry experts with extensive experience in office administration and management."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This Skill Quest is structured to fast-track your administrative skills, focusing on comprehensive learning that addresses the demands of modern office environments."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Overview and Evolution of Office Administration   — 3 hrs",
          "Workplace Excellence: Design, Health, and Communication Skills   — 6 hrs",
          "Advanced Computer Skills and Office Software Applications   — 3 hrs",
          "Mastering Workplace Efficiency: Techniques, Organization, and Stress Management   — 4 hrs",
          "Basics of Bookkeeping, Accounting, and Managing Office Budgets   — 3 hrs",
          "Effective Project Management and Event Planning in Business Administration   — 4 hrs",
          "Career Growth and Pathways in Office Administration   — 3 hrs",
          "Capstone Project and Assessment   — 4 hrs"
        ],
        
        
    vedio:"https://www.youtube.com/embed/Sm6BTl7azWo?si=hEiDiXTTvae9rUZt",
    pricing: [
      { title: "Access Only This Skill Quest ₹4,999", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 48,
    slug: "Modern Recruitment Master",
    title: "Modern Recruitment Practices",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581b16c2cb7ce6a7a609ff_Modern%20Recruitment-p-500.png",

    overview: `The Modern Recruitment Master program is intricately designed to equip you with the most effective and innovative recruitment techniques. Learn to navigate the complexities of organizational structures, master HR management, and implement cutting-edge recruitment technologies. Prepare yourself to drive strategic hiring and foster organizational development.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "50" },
      { icon: "📝", label: "Quizzes & Assessments", value: "60" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "25 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand organizational structures and strategic objectives.",
      "Master core functions of HR including recruitment, training, and development.",
      "Implement advanced recruitment strategies using the latest tools and trends.",
      "Develop skills in vendor management, employee mobility, and payroll systems.",
      "Craft effective employment contracts with a deep understanding of legal implications.",
      "Utilize software consulting and project bidding strategies effectively."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Strategic HR Management",
      "Advanced Recruitment Techniques",
      "HR Operations Management",
      "Legal Compliance in HR",
      "Software Consulting",
      "Ethical Workplace Communication",
      "AI in Recruitment",
    ],

    careerRoles: [
      "HR Manager",
      "Recruitment Specialist",
      "Talent Acquisition Consultant",
      "HR Business Partner",
      "Organizational Development Specialist"
    ],

    requirements: [
      "A fundamental understanding of HR principles.",
      "Experience in recruitment or HR management is advantageous.",
      "Eagerness to adopt new technologies and methodologies in recruitment."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Complete this course to receive a Certificate of Achievement that showcases your modern recruitment strategies and skills to prospective employers and your professional network."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experts in HR and recruitment with extensive experience in modernizing recruitment processes across various industries."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This structured, skill-focused Skill Quest propels your career by equipping you with the necessary skills to adapt to and lead in the evolving HR landscape."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Organizational Foundations   — 4 hrs",
          "Comprehensive HR Management   — 5 hrs",
          "Recruitment Evolution   — 4 hrs",
          "Comprehensive Recruitment Strategy   — 5 hrs",
          "Employment Contracts   — 3 hrs",
          "Software Consulting and Project Bidding   — 3 hrs",
          "Effective Communication and Ethics   — 2 hrs",
          "Understanding Organizational Hierarchies   — 2 hrs",
          "Strategies for Global Recruitment   — 3 hrs",
          "AI Transformation in Recruitment   — 3 hrs",
          "Innovating Recruitment Through Technology   — 2 hrs"
        ],
        
        
    vedio:"https://www.youtube.com/embed/6eZ6QYcMc2c?si=th9ax98DL83Toz1p",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 49,
    slug: "Business Analyst",
    title: "Business Analyst course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581b400ff348be32546662_BUSSINESS-p-500.png",

    overview: `The Business Analyst program is intricately designed to provide you with comprehensive skills in business analysis. Learn to understand business needs, stakeholder analysis, strategic frameworks, and effective use of tools like Jira for process improvements. Prepare to impact business strategies and operations profoundly.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "50" },
      { icon: "📝", label: "Quizzes & Assessments", value: "60" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "25 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp the foundational concepts and evolution of business analysis.",
      "Apply strategic frameworks such as SWOT, PESTLE, and MOST.",
      "Utilize Jira for business analysis, including requirements management and business process modeling.",
      "Master techniques for data-driven analysis, risk management, and decision-making frameworks.",
      "Develop effective communication and reporting skills tailored for business analysis.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Business Analysis Fundamentals",
      "Strategic Planning and Analysis",
      "Jira for Business Analysis",
      "Data Analysis and Risk Management",
      "Agile and Scrum Methodologies",
      "Effective Communication and Reporting"
    ],

    careerRoles: [
      "Business Analyst",
      "Project Manager",
      "Agile Coach",
      "Business Strategy Consultant",
      "Process Improvement Specialist"
    ],

    requirements: [
      "Basic understanding of project management principles.",
      "Familiarity with any project management software.",
      "Strong analytical skills and attention to detail."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Earn a Certificate of Achievement upon completion. Showcase your certification to potential employers and your professional network to enhance your visibility and marketability."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry leaders with extensive experience in business analysis and strategic planning."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This Skill Quest is designed to speed up your career advancement in business analysis, focusing on real-world applications and in-demand skills."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Organizational Foundations   — 4 hrs",
          "Comprehensive HR Management   — 5 hrs",
          "Recruitment Evolution   — 4 hrs",
          "Comprehensive Recruitment Strategy   — 5 hrs",
          "Employment Contracts   — 3 hrs",
          "Software Consulting and Project Bidding   — 3 hrs",
          "Effective Communication and Ethics   — 2 hrs",

          "Understanding Organizational Hierarchies   — 2 hrs",
          "Strategies for Global Recruitment   — 3 hrs",
          "AI Transformation in Recruitment   — 3 hrs",
          "Innovating Recruitment Through Technology   — 2 hrs"
        ],
        
        
    vedio:"https://www.youtube.com/embed/5_7yOhQMKkk?si=mNNOs4lIJ-NyRBh8",
    pricing: [
      { title: "Access Only This Skill Quest ₹24,999", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 50,
    slug: "Entrepreneurial Mastery",
    title: "Enterpreneurship",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581b552e8f748ebb7d3a47_Enterprenuership-p-500.png",

    overview: `The Entrepreneurial Mastery program is expertly designed to guide you from the fundamentals of entrepreneurship through to launching your own business. Learn to create robust business models, manage risks, secure financing, and master strategic planning. Equip yourself with the necessary tools to start, manage, and scale your business effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the foundational concepts of entrepreneurship and develop an entrepreneurial mindset.",
      "Learn to identify business opportunities and conduct thorough market and risk analyses.",
      "Master strategic business planning and financial management.",
      "Gain insights into securing funding, managing finances, and pitching to investors.",
      "Navigate the startup landscape from registering a business to scaling it efficiently.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",


    skills: [
      "Business Strategy Development",
      "Risk Management",
      "Financial Literacy and Management",
      "Market Research",
      "Sales Strategy Implementation",
      "Team Building and Management",
      "Startup Scaling Techniques"
    ],

    careerRoles: [
      "Startup Founder",
      "Business Strategist",
      "Financial Planner",
      "Marketing Director",
      "Sales Manager",
      "Team Leader"
    ],

    requirements: [
      "A basic understanding of business principles.",
      "Strong analytical skills and a creative mindset.",
      "Motivation and a drive to succeed in the business world."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Earn a Certificate of Achievement that demonstrates your capability to launch and manage a successful business. Share this achievement with potential partners and investors to enhance your business credibility."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experienced entrepreneurs and business leaders who provide real-world insights and strategies."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Structured learning to fast-track your entrepreneurial journey, focusing on critical business skills that drive success."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Foundations of Entrepreneurship: From Idea to Business Model   — 2 hrs",
          "Strategic Business Analysis: Identifying Opportunities and Managing Risks   — 3 hrs",
          "Strategic Business Planning and Analysis   — 3 hrs",
          "Startup Financing Mastery   — 3 hrs",
          "Financial Management Essentials for Entrepreneurs   — 3 hrs",
          "Establishing Your Business: Location, Registration, and Virtual Setup   — 2 hrs",
          "Mastering Market Research and Strategy   — 2 hrs",

          "Sales Strategy Development and Implementation   — 2 hrs",
          "Building and Structuring Effective Teams for Automation   — 2 hrs",
          "Strategic Execution and Scaling for Business Growth   — 3 hrs",
          "Capstone Project: Launching Your Startup   — 3 hrs"
        ],
        
        
    vedio:"https://www.youtube.com/embed/5HVhjsYE5Q4?si=LFgO7QuT5wm9ex-T",
    pricing: [
      { title: "Access Only This Skill Quest ₹39,999", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 51,
    slug: "Excel Virtuoso",
    title: "Excel VBA course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581b62cea1a38ab485e777_XL-p-500.png",

    overview: `The Excel Virtuoso program is designed to provide an in-depth understanding of Excel and VBA, emphasizing practical applications in modern data landscapes. Learn everything from foundational skills to advanced data analysis and automation with VBA, equipping you to handle complex data tasks efficiently.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "50" },
      { icon: "📝", label: "Quizzes & Assessments", value: "60" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "25 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Master the fundamentals and advanced features of Excel.",
      "Understand and implement VBA for automating repetitive tasks.",
      "Develop custom functions and macros to streamline workflows.",
      "Perform complex data analysis using PivotTables and advanced charting.",
      "Build interactive tools and dashboards for data visualization.",
    ],
    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",


    skills: [
      "Excel Mastery",
      "VBA Programming",
      "Data Analysis",
      "Macro Automation",
      "Interactive Reporting",
    ],

    careerRoles: [
      "Data Analyst",
      "Business Analyst",
      "Financial Analyst",
      "Business Intelligence Specialist",
      "VBA Developer",
    ],

    requirements: [
      "Basic knowledge of Excel.",
      "Interest in data analysis and automation.",
      "Eagerness to develop advanced Excel and VBA skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Earn a Certificate of Achievement that validates your expertise in Excel and VBA, enhancing your professional credibility and marketability."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experts with extensive experience in Excel and VBA, and a deep understanding of business and data analytics."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our structured Skill Quests are designed to fast-track your proficiency in Excel and VBA, catering to demands in data-heavy roles across industries."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Excel and VBA Foundations   — 3 hrs",
          "Excel Essentials: Setup and Basics   — 3 hrs",
          "Excel Fundamentals: Data Entry to Visualization   — 4 hrs",
          "Advanced Excel Techniques for Data Management   — 4 hrs",
          "Introduction to Excel VBA   — 3 hrs",
          "Excel VBA Programming Fundamentals   — 4 hrs",
          "Advanced Excel VBA Automation   — 3 hrs",

          "Advanced Integration and Optimization in VBA   — 4 hrs",
          "Advanced VBA Applications for Business   — 4 hrs",
          "Troubleshooting and Future Trends in Excel and VBA   — 3 hrs"
        ],
        
        
    vedio:"https://www.youtube.com/embed/3h-Pu1_fLek?si=piRilUVklboi3CfT",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 52,
    slug: "Manual Tester",
    title: "Manual Testing course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581b738c0b7b809088e672_Manual%20testing-p-500.png",

    overview: `The Manual Tester program is expertly designed to provide you with a comprehensive understanding of manual software testing. You will explore the Software Development Life Cycle (SDLC), various testing methodologies, static techniques, and more. Prepare to excel in ensuring software quality and managing testing processes effectively.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the entire Manual Testing process and its importance in the Software Development Life Cycle.",
      "Gain familiarity with various Software Testing Methodologies.",
      "Learn about Static Techniques and their application in pre-execution testing phases.",
      "Explore different Levels of Testing to ensure comprehensive coverage.",
      "Master the Software Testing Life Cycle (STLC) and distinguish between QA & QC.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Manual Testing",
      "Software Testing Methodologies",
      "Static Techniques",
      "Levels of Testing",
      "Software Testing Life Cycle (STLC)",
      "Quality Assurance & Quality Control",
    ],

    careerRoles: [
      "Manual Tester",
      "Quality Assurance Specialist",
      "Software Quality Analyst",
      "Test Manager",
    ],

    requirements: [
      "Basic knowledge of software development.",
      "Interest in software quality and testing.",
      "Problem-solving skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieve a Certificate of Achievement upon completing the course. Use this certification to highlight your skills and advance your career in software testing."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry veterans with extensive experience in software testing and quality assurance."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our focused Skill Quests are designed to equip you with specialized knowledge and practical skills that align with industry demands."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Manual Testing Basics   — 2 hrs",
          "Software Development Life Cycle (SDLC)   — 3 hrs",
          "Software Testing Methodologies   — 3 hrs",
          "Static Techniques   — 2 hrs",
          "Levels of Testing   — 3 hrs",
          "Software Testing Life Cycle (STLC)   — 3 hrs",
          "Quality Assurance & Quality Control (QA&QC)   — 2 hrs",
        ],
        
        
    vedio:"https://www.youtube.com/embed/Pphhs7YFmec?si=YVG4cq5FXSXqSxY8",
    pricing: [
      { title: "Access Only This Skill Quest ₹11,999", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 53,
    slug: "Technology Training Program",
    title: "Technology Training Program",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581b9620fa83eaa49af863_Technology%20training%20program-p-500.png",

    overview: `The Technology Training Program is an exhaustive course designed to equip you with a profound understanding and practical skills across a broad spectrum of computing and IT disciplines. From foundational computing concepts to advanced infrastructure management, this program offers a comprehensive tech education.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "" },
      { icon: "📝", label: "Quizzes & Assessments", value: "" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Grasp the evolution and fundamentals of computing and software systems.",
      "Apply practical knowledge in designing computer systems and managing cloud infrastructures.",
      "Develop hands-on skills in programming, web development, and database management.",
      "Gain insights into business intelligence, middleware integration, and ERP systems.",
      "Prepare for industry demands with strategic CRM development and advanced IT project management.",
    ],
    
    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Computing Fundamentals",
      "System Design",
      "Cloud Infrastructure",
      "Business Intelligence",
      "Programming and Web Development",
      "Database Management",
      "IT Project Management"
    ],

    careerRoles: [
      "Systems Analyst",
      "Cloud Architect",
      "Business Intelligence Analyst",
      "Software Developer",
      "Database Manager",
      "IT Project Manager"
    ],

    requirements: [
      "A solid understanding of basic IT concepts.",
      "Interest in deepening technical skills across various IT disciplines.",
      "Motivation to apply knowledge to practical, real-world technology problems."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Complete the program to receive a Certificate of Achievement . This certification demonstrates your broad and detailed expertise in technology, enhancing your career and professional profile."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experts who are not only deep in theory but seasoned in practical applications across various technology sectors."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Structured learning paths in the Skill Quest are designed to fast-track your growth in the technology sector, focusing on critical areas that match industry needs and future trends."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Foundations of Computing   - History, Development, and Practical Exploration",
          "Fundamentals of Computer Systems Design",
          "Exploring Multi-Tier Architectures",
          "Business Intelligence Essentials",
          "Cloud Infrastructure Management and Deployment",
          "ERP System Deployment and Strategic Frameworks",
          "Strategic CRM Development",
          "Middleware Integration and System Design",
          "Professional Certifications",
          "Fundamentals of Programming",
          "Web Development Fundamentals",
          "Mastering Business Communication",
          "Transitioning to Open Source",
          "Server Infrastructure Management",
          "Database Management and Applications",
          "Web Browsers and User Experience Enhancements",
          "Future-Ready Network Infrastructure",
          "Advanced IT Project Management"
        ],
        
        
    vedio:"https://www.youtube.com/embed/aPRH97FD8IM?si=5L2QTltBMDfUqdSL",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 54,
    slug: "AML KYC Specialist",
    title: "AML KYC Course",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581bbe733d3c480190d443_AML-p-500.png",

    overview: `The AML KYC Specialist program is meticulously crafted to equip you with essential skills for mastering Anti-Money Laundering (AML) and Know Your Customer (KYC) compliance. Learn the fundamentals, the regulatory framework, customer due diligence, and the use of technology in AML/KYC processes. This program prepares you to ensure compliance and secure operations within financial services.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"Ideal for budding Digital Forensic Analysts, Cybersecurity Professionals, Law Enforcement Officers, IT Security Consultants, and anyone looking to specialize in the field of digital forensics.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "40" },
      { icon: "📝", label: "Quizzes & Assessments", value: "50" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "20 hours" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the fundamentals and regulatory framework of AML/KYC.",
      "Navigate through the AML KYC process, including Customer Identification Programs.",
      "Analyze the role of shell and front companies in compliance.",
      "Develop expertise in customer due diligence and KYC technology solutions.",
      "Learn through case studies and real-world examples to understand best practices in AML/KYC.",
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",


    skills: [
      "AML Compliance",
      "KYC Procedures",
      "Regulatory Compliance",
      "Financial Forensics",
      "Risk Management",
      "Legal Framework Understanding"
    ],

    careerRoles: [
      "Compliance Officer",
      "KYC Analyst",
      "AML Specialist",
      "Risk Manager",
      "Financial Compliance Consultant",
    ],

    requirements: [
      "Basic understanding of financial operations and regulations.",
      "A keen interest in financial compliance and risk management.",
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Successfully completing the course awards you a Certificate of Achievement . Showcase your certification to potential employers and enhance your professional stature in the financial industry."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Courses led by seasoned professionals with extensive experience in financial compliance and anti-money laundering."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Our skill-based Skill Quests are structured to fast-track your career in financial compliance, focusing on in-demand skills in the finance industry."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"Note: Full course details available exclusively to enrolled users.",
    syllabus: [
          "Fundamentals and Regulatory Framework of AML/KYC   — 2 hrs",
          "AML KYC Process Overview   — 2 hrs",
          "Customer Identification Program (CIP) and Business Entities   — 3 hrs",
          "Customer Due Diligence   — 3 hrs",
          "Legal and Regulatory Framework   — 2 hrs",
          "AML KYC Technology Solutions   — 2 hrs",
          "AML KYC Best Practices   — 2 hrs",
          "Case Studies and Examples   — 2 hrs",
        ],
        
        
    vedio:"https://www.youtube.com/embed/6eZ6QYcMc2c?si=LmnWyFM2Ms9ZWgNO",
    pricing: [
      { title: "Access Only This Skill Quest", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
   {
    id: 61,
    slug: "OSS and BSS",
    title: "Telecom Operations Mastery",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665709a96cb4c85432f2ab92_OSS%20%26%20BSS-p-500.png",

    overview: `The OSS and BSS Skill Quest is intricately designed to provide in-depth knowledge and skills in operational support systems (OSS) and business support systems (BSS) which are vital for managing modern telecommunications services. Learn about everything from the basics of telecommunications to advanced BSS and OSS architectures.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is essential for Telecom Managers, Network Operations Personnel, IT Professionals in Telecom, System Architects, and those interested in mastering telecom operations.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "" },
      { icon: "📝", label: "Quizzes & Assessments", value: "" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the foundational telecom concepts and networking essentials.",
      "Gain knowledge about BSS and OSS systems including their architecture and key components.",
      "Learn about the integration and modernization of OSS and BSS in telecommunications.",
      "Explore real-world applications and case studies in BSS and OSS implementations.",
    ],
    
    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Telecom Fundamentals",
      "Networking Essentials",
      "OSS and BSS Architecture",
      "Advanced Telecom Management Strategies",
      "Regulatory Compliance",
      "Integration Techniques"
    ],

    careerRoles: [
      "Telecom Project Manager",
      "OSS/BSS Architect",
      "Network Operations Analyst",
      "Telecom Business Analyst",
      "Service Assurance Manager",
    ],

    requirements: [
      "Basic knowledge of telecommunications principles.",
      "Experience with IT systems and networking.",
      "A strong analytical mindset and problem-solving skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieving this certification demonstrates your comprehensive understanding of complex telecom systems, making you a valuable asset in the telecom industry."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry veterans with decades of experience in telecommunications systems and operations."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This structured educational pathway is designed to rapidly elevate your professional capabilities in the telecom sector, aligning your skills with industry demands."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"",
    syllabus: [
          "Access restricted to enrolled users.",
          "Understanding Basic Telecom Fundamentals",
          "BSS and OSS Systems: Core of Telecom Management",
          "Advanced Strategies in BSS and OSS Integration",
          "Modern BSS and OSS Systems: Innovations and Real-World Applications",
        ],
        
        
    vedio:"https://www.youtube.com/embed/2z9Z-TnOVKQ?si=RZiQpRcX4UENC9k8",
    pricing: [
      { title: "Access Only This Skill Quest One-time Payment: INR (discounted from INR )", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad One-time Payment: INR (discounted from INR )", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
  {
    id: 62,
    slug: "Basic Telecommunication course",
    title: "Basic Telecommunication",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66570b99d69e8f5d36f7ce83_tele-p-500.png",

    overview: `The OSS and BSS Skill Quest is intricately designed to provide in-depth knowledge and skills in operational support systems (OSS) and business support systems (BSS) which are vital for managing modern telecommunications services. Learn about everything from the basics of telecommunications to advanced BSS and OSS architectures.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is essential for Telecom Managers, Network Operations Personnel, IT Professionals in Telecom, System Architects, and those interested in mastering telecom operations.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "" },
      { icon: "📝", label: "Quizzes & Assessments", value: "" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Understand the foundational telecom concepts and networking essentials.",
      "Gain knowledge about BSS and OSS systems including their architecture and key components.",
      "Learn about the integration and modernization of OSS and BSS in telecommunications.",
      "Explore real-world applications and case studies in BSS and OSS implementations.",
    ],
    
    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "Telecom Fundamentals",
      "Networking Essentials",
      "OSS and BSS Architecture",
      "Advanced Telecom Management Strategies",
      "Regulatory Compliance",
      "Integration Techniques"
    ],

    careerRoles: [
      "Telecom Project Manager",
      "OSS/BSS Architect",
      "Network Operations Analyst",
      "Telecom Business Analyst",
      "Service Assurance Manager",
    ],

    requirements: [
      "Basic knowledge of telecommunications principles.",
      "Experience with IT systems and networking.",
      "A strong analytical mindset and problem-solving skills."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieving this certification demonstrates your comprehensive understanding of complex telecom systems, making you a valuable asset in the telecom industry."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by industry veterans with decades of experience in telecommunications systems and operations."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "This structured educational pathway is designed to rapidly elevate your professional capabilities in the telecom sector, aligning your skills with industry demands."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"",
    syllabus: [
          "Access restricted to enrolled users.",
          "Understanding Basic Telecom Fundamentals",
          "BSS and OSS Systems: Core of Telecom Management",
          "Advanced Strategies in BSS and OSS Integration",
          "Modern BSS and OSS Systems: Innovations and Real-World Applications",
        ],
        
        
    vedio:"https://www.youtube.com/embed/QBVb-G_sIF8?si=yNo2kceEDncwatPq",
    pricing: [
      { title: "Access Only This Skill Quest One-time Payment: INR (discounted from INR )", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad One-time Payment: INR (discounted from INR )", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
   {
    id: 63,
    slug: "4G&5G RAN",
    title: "4G 5G RAN Specialist",
    subtitle: "Master the art of protecting networks with comprehensive defense strategies.",
    bannerImage:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66570baec67753d1066899a0_4GAND5G-p-500.png",

    overview: `The 4G 5G RAN Specialist program is expertly designed to provide in-depth knowledge of the architecture, technologies, and operational strategies in 4G and 5G radio access networks. From foundational telecommunications to advanced network functionalities, equip yourself to excel in the evolving landscape of mobile communications.`,

    targetAudience: [
      "Courses Included in This Skill Quest",
      "Note: Detailed syllabus available post-enrollment.",
    ],
    targetAudienceTex:"This course is perfect for Network Engineers, Telecommunications Specialists, RF Engineers, System Designers, and students or professionals eager to advance their expertise in mobile communications technologies.",
    stats: [
      { icon: "💡", label: "Expert Sessions", value: "" },
      { icon: "📝", label: "Quizzes & Assessments", value: "" },
      { icon: "🌐", label: "Language", value: "English" },
      { icon: "⏱️", label: "Premium content", value: "" },
      { icon: "💬", label: "Subtitles", value: "English" },
      { icon: "🏆", label: "Certificate of Completion", value: "" }
    ],

    learningOutcomes: [
      "Gain a solid understanding of telecommunication fundamentals specific to 4G and 5G technologies.",
      "Explore the intricacies of signal transmission, modulation, and multiple access techniques.",
      "Delve into GSM, LTE, and Advanced LTE configurations and operations.",
      "Understand the architecture and protocols of both 4G and 5G RAN.",
      "Master the deployment and optimization strategies for next-generation mobile networks."
    ],

    careerText:"Equips you for roles such as:",
    careerSubText:"",
    skilsText:"This Skill Quest sharpens your expertise in:",
    skilsSubText:"",

    skills: [
      "4G Technologies",
      "5G Innovations",
      "RAN Architecture and Management",
      "Signal Processing",
      "Network Design and Optimization",
      "Regulatory and Standardization Compliance"
    ],

    careerRoles: [
      "RAN Engineer",
      "Telecommunications Analyst",
      "RF System Designer",
      "Network Optimization Specialist",
    ],

    requirements: [
      "Fundamental knowledge of telecommunications principles.",
      "Basic familiarity with radio frequency technologies.",
      "Enthusiasm for deepening technical knowledge in mobile communications."
    ],

    infoCards: [
      {
        icon: "🛡️",
        title: "Skill Quest Certification Benefits",
        text: "Achieving this certification demonstrates your advanced competency in 4G and 5G networks, making you a valuable asset to employers in the telecommunications industry."
      },
      {
        icon: "👨‍🏫",
        title: "Instructors",
        text: "Led by experts with extensive experience in telecommunications and network engineering."
      },
      {
        icon: "📈",
        title: "Accelerate Your Career",
        text: "Achieving this certification demonstrates your advanced competency in 4G and 5G networks, making you a valuable asset to employers in the telecommunications industry."
      }
    ],

    certificateImage:
      "https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/666fbffc03a209c0ded9bc07_Cyber%20Security%20Certificate-p-1080.png",
syllabusText:"",
    syllabus: [
          "Access restricted to enrolled users.",
          "Telecommunication Basics to understand 4G&5G RAN",
          "Basics of Telecommunication",
          "Signal Transmission Concepts",
          "Modulation and Demodulation Techniques",
          "Multiple Access Techniques in Communication Systems",
          "Fundamentals of Cellular Network Operations and Management",
          "Advanced Techniques in Multiple Access Technologies: CDMA and OFDMA.4G (LTE RAN)",
          "LTE Network Fundamentals",
          "LTE Protocols and Architecture",
          "LTE Air Interface Capabilities",
          "LTE Identifiers and Channels 5G RAN",
          "Fundamentals and Concepts of 5G RAN",
          "5G Core Network and Physical Layer Overview",
          "Understanding 5G Communication: Setup, Data Transfer, and Termination Procedures"
        ],
        
        
    vedio:"https://www.youtube.com/embed/bDfB5Ogzlz0?si=C-_ZQEawxK5x8e_O",
    pricing: [
      { title: "Access Only This Skill Quest One-time Payment: INR (discounted from INR )", highlight: false },
      { title: "Skill Quest + ORN-AI Career LaunchPad One-time Payment: INR (discounted from INR 89,998 )", highlight: true },
      { title: "ORN-AI Enterprise Customized solutions for team training.", highlight: false }
    ]
  },
];

const SkillQuestPage = () => {
  const { id } = useParams();

  const data = cyberLabs.find((item) => item.id === Number(id)) || cyberLabs[0];
console.log('bannerImage=',data.bannerImage);
  return (
     <Shell>
    <div className="w-full">

      <HeroBanner
        title={data.title}
        subtitle={data.subtitle}
        image={data.bannerImage}
        height="h-[300px]"
        
      />

      <Section title="Overview">
        <p className="text-gray-700 leading-7 text-lg">{data.overview}</p>
      </Section>
      
      <Section title="Target Audience">
        <p className="text-gray-700 leading-7 text-lg">{data.targetAudienceTex}</p> <br />
       {data.vedio && (
  <iframe
    width="100%"
    height="400"
    src={data.vedio}
    className="rounded-xl shadow-lg"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
)}

      <br />

        <Bullets items={data.targetAudience} />
      </Section>

      <div className="px-4 max-w-[1180px] mx-auto grid md:grid-cols-2 gap-6">
        {data.stats.map((s, i) => (
          <RightStat key={i} {...s} />
        ))}
      </div>

      <Section title="Learning Outcomes">
        <Bullets items={data.learningOutcomes} />
      </Section>

      <Section title="Skills Acquired">
        <p>
          <b>{data.skilsText}</b>
        
        </p>
        <p>{data.skilsSubText}</p>

        <Bullets items={data.skills} />
      </Section>

      <Section title="Career Readiness">
         <p>
          <b>{data.careerText}</b>
          </p>
        <p>{data.careerSubText}</p>
        <Bullets items={data.careerRoles} />
      </Section>

      <Section title="Entry Requirements">
        <Bullets items={data.requirements} />
      </Section>

      <Section title="Certificate & Program Details">
        <div className="grid md:grid-cols-2 gap-6">
          {data.infoCards.map((card, i) => (
            <InfoCard key={i} {...card} />
          ))}
          <img src={data.certificateImage} className="rounded-xl border shadow" />
        </div>
      </Section>

      <Section title="Course Syllabus">
        <b>{data.syllabusText}</b>
        <ol className="list-decimal ml-6 space-y-2 text-lg">
          {data.syllabus.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </Section>

      <Section title="Pricing">
        <div className="grid md:grid-cols-3 gap-6">
          {data.pricing.map((p, i) => (
            <PriceCard key={i} {...p} />
          ))}
        </div>
      </Section>

    </div>
    </Shell>
  );
};

/* Utility Components */
const Section = ({ title, children }) => (
  <div className="px-4 max-w-[1180px] mx-auto py-10">
    <h2 className="text-3xl font-bold mb-6">{title}</h2>
    {children}
  </div>
);

const Bullets = ({ items }) => (
  <ul className="space-y-3 text-lg text-gray-700">
    {items.map((i, idx) => (
      <li key={idx}>🟦 {i}</li>
    ))}
  </ul>
);

const RightStat = ({ icon, label, value }) => (
  <div className="flex justify-between px-4 py-3 border rounded-lg bg-[#DDF7D7] shadow">
    <div className="flex items-center gap-2">
      <span>{icon}</span> <span>{label}</span>
    </div>
    <span className="font-semibold">{value}</span>
  </div>
);

const InfoCard = ({ icon, title, text }) => (
  <div className="bg-white rounded-xl p-6 border shadow">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-700 mt-2">{text}</p>
  </div>
);

const PriceCard = ({ title, highlight }) => (
  <div
    className={`p-6 rounded-xl text-center border shadow ${
      highlight ? "bg-green-500 text-white scale-105" : "bg-[#DDF7D7]"
    }`}
  >
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <button className="bg-white text-green-700 px-6 py-2 rounded-full font-semibold shadow">
      Get Started
    </button>
  </div>
);

export default SkillQuestPage;
