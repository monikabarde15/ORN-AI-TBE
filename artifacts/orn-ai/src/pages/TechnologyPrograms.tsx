// LabPricing.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "wouter";
import HeroBanner from "./components/Banner";
import { Shell } from "@/components/layout/Shell";


export const cyberLabs = [
  {
    id: 21,
    subtitle: "Scrum Master",
    name: "Scrum Master",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66974e1d0dd16de716d5b90e_New%20Project%20(6)-p-500.png",
    shortDesc:
      "The Scrum Master program is expertly designed to equip you with essential skills to lead and facilitate project teams in Agile environments. This course delves into the history, methodologies, and practical tools like JIRA, preparing you to handle real-world challenges and drive project success in any dynamic business setting.",

    longDesc:
      "The Certified Network Defender program is meticulously crafted to provide you with a comprehensive understanding of network security. Through this program, you will gain in-depth knowledge of network defense fundamentals, security threats and vulnerabilities, and advanced protective measures. Prepare to become a proficient network defender equipped with the skills to secure modern networks effectively.Target Audience This program is ideal for Network Administrators, IT Security Professionals, Security Analysts, Network Engineers, and individuals seeking to specialize in network security.",

    features: [
      "Grasp the essentials of network defense, including security architecture and practical configurations.",
      "Understand network security, vulnerabilities, and penetration testing methodologies.",
      "Implement advanced network security protocols and design comprehensive security policies.",
      "Explore unified security frameworks, host security, and secure firewall management.",
      "Develop skills in VPN, IDS configuration, wireless network defense, and traffic monitoring.",
      "Prepare for effective incident response and management."
    ],

    syllabus: [
      "Network Defense",
      "Threat Analysis",
      "Penetration Testing",
      "Security Policy Design",
      "Intrusion Detection",
      "Intrusion Detection",
      "Wireless Security"
    ]
  },

  {
    id: 22,
    subtitle: "Salesforce Specialist",
    name: "Salesforce Specialist",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6697516f868f313a406d70ca_New%20Project%20(7)-p-500.png",
    shortDesc:
      "The Salesforce Specialist program is expertly designed to guide you through the intricacies of Salesforce, from basic navigation to complex functionalities. Gain practical skills in Salesforce architecture, data management, automation tools, and more, enabling you to maximize CRM efficiency and support enterprise needs effectively.",

    longDesc:
      "Learn Security Operations, SIEM tools, threat intelligence, alert management and attacker tactics used in real-world SOC environments.",

    features: [
      "SIEM Practical Labs",
      "Threat Intelligence Analysis",
      "SOC Alert Investigation",
      "MITRE ATT&CK Framework",
      "Hands-on Incidents Training"
    ],

    syllabus: [
      "Module 1: SOC Fundamentals",
      "Module 2: SIEM & Log Analysis",
      "Module 3: Threat Intelligence",
      "Module 4: MITRE Tactics & Techniques",
      "Module 5: Incident Response Playbooks"
    ]
  },

  {
    id: 23,
    subtitle: "Python Full Stack",
    name: "Python",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/668e2b7cf55408a8b7ce83d6_html-css-collage-concept-with-person-p-500.png",
    shortDesc:
      "The Python Full Stack program is designed to transition you from a novice to a professional Python developer. You'll begin with the fundamentals of Python programming and progress through more complex topics, such as web development with Python, database management, and building real-world projects.",

    longDesc:
      "Train in offensive & defensive security, ethical hacking labs, exploitation techniques, and malware analysis basics.",

    features: [
      "VAPT Practical Labs",
      "Web App Hacking",
      "Network Attack Simulations",
      "Exploit Development Basics",
      "Malware & Payload Analysis"
    ],

    syllabus: [
      "Module 1: Basics of Cyber Security",
      "Module 2: Footprinting & Scanning",
      "Module 3: Network Attacks",
      "Module 4: Web Application Hacking",
      "Module 5: Exploitation & Priv Escalation"
    ]
  },

  {
    id: 24,
    subtitle: "Manual Tester",
    name: "Manual Tester",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66964116434d4121d8b600ba_man-working-energy-innovations-his-laptop-p-500.png",
    shortDesc:
      "The Manual Tester program is intricately designed to develop your proficiency in validating software quality manually. Through this course, you will understand the core principles of manual testing, delve into different testing methodologies, and learn about the software development life cycle and software testing life cycle (STLC).",

    longDesc:
      "Learn digital crime investigation, forensic imaging, evidence reconstruction, and incident investigation techniques.",

    features: [
      "Disk & Memory Forensics",
      "Log Investigation Labs",
      "Malware Behavioral Analysis",
      "Evidence Imaging & Chain of Custody",
      "Forensic Report Writing"
    ],

    syllabus: [
      "Module 1: Introduction to Cyber Forensics",
      "Module 2: Evidence Handling & Imaging",
      "Module 3: File System Analysis",
      "Module 4: Network Forensics",
      "Module 5: Malware & Threat Analysis"
    ]
  },

  {
    id: 25,
    subtitle: "Java Fullstack Development",
    name: "Java Fullstack",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66964163fe8db45492817727_programming-background-with-person-working-with-codes-computer-p-500.png",
    shortDesc:
      "The Java Fullstack program is carefully designed to take you from Java fundamentals to advanced full-stack development. Learn to build robust backend systems and engaging front-end interfaces. Prepare to master frameworks like Spring and front-end technologies such as ReactJS, ensuring comprehensive skills in web development.",

    longDesc:
      "Learn end-to-end bug bounty hunting, reconnaissance, web vulnerabilities, exploitation & reporting.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
  {
    id: 26,
    subtitle: "Informatica Cloud Services",
    name: "Informatica Cloud Services",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66974d2d484c24ec11c2a9dc_New%20Project%20(5)-p-500.png",
    shortDesc:
      "Informatica Cloud Services are designed to provide comprehensive data integration solutions that facilitate the connection, synchronization, and management of data across diverse platforms. You will explore key components like architecture, secure agent functionality, connectors, and task configuration to effectively manage data workflows.",

    longDesc:
      "Learn end-to-end bug bounty hunting, reconnaissance, web vulnerabilities, exploitation & reporting.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
   {
    id: 27,
    subtitle: "SQL Server Course",
    name: "SQL Server Mastery",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66570bbe27b7dbfb0951d630_New%20Project-p-500.png",
    shortDesc:
      "The SQL Server Mastery program is meticulously designed to provide you with a deep understanding of SQL Server database management and optimization. Learn SQL Server setup, database design, query management, and more. Equip yourself with essential skills to efficiently handle and optimize databases.",

    longDesc:
      "Learn end-to-end bug bounty hunting, reconnaissance, web vulnerabilities, exploitation & reporting.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
  {
    id: 28,
    subtitle: "Rabbit MQ Course",
    name: "RabbitMQ Mastery",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813830f5cb46af22d2a69_Flutter%20(1)-p-500.png",
    shortDesc:
      "The RabbitMQ Mastery program is expertly designed to teach you the intricacies of RabbitMQ, a critical component in modern software architecture. This course covers everything from AMQP fundamentals to advanced integration techniques with Docker and Kubernetes, equipping you with the skills needed to develop, maintain, and scale robust messaging solutions.",

    longDesc:
      "Learn end-to-end bug bounty hunting, reconnaissance, web vulnerabilities, exploitation & reporting.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
  {
    id: 29,
    subtitle: "PHP Programming Course",
    name: "PHP Programming",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665719488610bdc9a10acd20_PHP%20Course-p-500.png",
    shortDesc:
      "The PHP Programming course is expertly designed to teach you the fundamentals and advanced concepts of PHP. From setting up environments to mastering object-oriented programming, you will acquire the skills needed to develop robust web applications and services.",

    longDesc:
      "Learn end-to-end bug bounty hunting, reconnaissance, web vulnerabilities, exploitation & reporting.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
   {
    id: 30,
    subtitle: "Laravel course",
    name: "Laravel Architect",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66581391cebe5e7a47e0a5f3_laraval-p-500.png",
    shortDesc:
      "The PHP Programming course is expertly designed to teach you the fundamentals and advanced concepts of PHP. From setting up environments to mastering object-oriented programming, you will acquire the skills needed to develop robust web applications and services.",

    longDesc:
      "The Laravel Architect program is designed to guide you through every aspect of Laravel, from basic setup to advanced application techniques. This course is structured to help you build sophisticated web applications using Laravel, enhancing your skills in modern web development.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
   {
    id: 31,
    subtitle: "Golang Masterclass",
    name: "Golang Masterclass",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658139d8a99149c8af3ac6d_golang%20Course-p-500.png",
    shortDesc:
      "The Golang Masterclass program is designed to thoroughly instruct you in the Go programming language. From foundational concepts to advanced programming techniques, this course ensures you become proficient in creating efficient, scalable, and powerful applications using Go.",

    longDesc:
      "The Laravel Architect program is designed to guide you through every aspect of Laravel, from basic setup to advanced application techniques. This course is structured to help you build sophisticated web applications using Laravel, enhancing your skills in modern web development.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
  {
    id: 32,
    subtitle: "Flutter Developer Course",
    name: "Flutter Developer",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813af3a156fbcededbaa0_Flutter-p-500.png",
    shortDesc:
      "The Flutter Developer program is designed to provide a thorough understanding of Flutter and Dart, enabling you to build high-quality applications for mobile, web, and desktop. From setting up your development environment to deploying your apps, this course covers everything you need to become a proficient Flutter developer.",

    longDesc:
      "The Laravel Architect program is designed to guide you through every aspect of Laravel, from basic setup to advanced application techniques. This course is structured to help you build sophisticated web applications using Laravel, enhancing your skills in modern web development.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
   {
    id: 33,
    subtitle: "Django Course",
    name: "Django Developer",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813bfed43dc6037008fa4_Django%20Course-p-500.png",
    shortDesc:
      "The Django Developer program is expertly crafted to equip you with the skills necessary to build, deploy, and manage robust web applications using Django. Learn from the ground up: from basic concepts and environment setup to advanced features like REST API integration and deployment strategies.",

    longDesc:
      "The Laravel Architect program is designed to guide you through every aspect of Laravel, from basic setup to advanced application techniques. This course is structured to help you build sophisticated web applications using Laravel, enhancing your skills in modern web development.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  },
  {
    id: 34,
    subtitle: "Base SAS and Advance SAS course",
    name: "SAS Mastery",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665813d90838c9f8bb3a3c27_SAAS-p-500.png",
    shortDesc:
      "The SAS Mastery program is designed to guide you through Base SAS and Advanced SAS programming, focusing on comprehensive data manipulation, analysis, and reporting. Gain in-depth knowledge on how to leverage SAS in varied scenarios from academic environments to advanced business applications.",

    longDesc:
      "The Laravel Architect program is designed to guide you through every aspect of Laravel, from basic setup to advanced application techniques. This course is structured to help you build sophisticated web applications using Laravel, enhancing your skills in modern web development.",

    features: [
      "Web Vulnerability Labs",
      "BurpSuite Hands-on",
      "Real Bug Bounty Techniques",
      "Payload Crafting",
      "Report Writing & Submission"
    ],

    syllabus: [
      "Module 1: Recon & Enumeration",
      "Module 2: OWASP Top 10 Deep Dive",
      "Module 3: Exploitation Techniques",
      "Module 4: Bug Reporting & POCs",
      "Module 5: Live Bug Hunting Strategy"
    ]
  }
];

const TechnologyPrograms = () => {
  const [, navigate] = useLocation(); 
  const [labs] = useState(cyberLabs);

  const handlePlanClick = (lab) => {
    toast.success("Added to cart", { autoClose: 2000 });
  };

  return (
    <Shell>
    <div className="py-10 px-4 md:px-10 bg-white">
       <HeroBanner
          title="Business & Data Analytics"
          subtitle="Your subtitle or description goes here"
          ctaText="Sign up"
          ctaHref="/signup"
          image="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
          height="h-96"
          />
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto mt-12">
        {labs.map((lab, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200"
          >
            {/* Image */}
            <div className="w-full h-52">
              <img
                src={lab.image}
                alt={lab.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Text Content */}
            <div className="p-6">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {lab.subtitle}
              </p>

              <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 leading-tight">
                {lab.name}
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed mb-5">
                {lab.shortDesc}
              </p>

             <button
  onClick={() => navigate(`/lab/${lab.id}`)}
  className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
>
  Learn more →
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Shell>
  );
};

export default TechnologyPrograms;
