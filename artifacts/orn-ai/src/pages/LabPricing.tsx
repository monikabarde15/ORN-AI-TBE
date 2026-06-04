// LabPricing.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "wouter";

import HeroBanner from "./components/Banner";


export const cyberLabs = [
  {
    id: 1,
    subtitle: "CERTIFIED NETWORK DEFENDER",
    name: "Certified Network Defender",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66966ede0988eafe7b33bf31_New%20Project%20(3).png",
    shortDesc:
      "The Certified Network Defender program is meticulously crafted to provide you with a comprehensive understanding of network security. Through this program, you will gain in-depth knowledge of network defense fundamentals, security threats and vulnerabilities, and advanced protective measures. Prepare to become a proficient network defender equipped with the skills to secure modern networks effectively.",

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
    id: 2,
    subtitle: "SOC ANALYST",
    name: "Secure and manage cybersecurity operations with strategic SOC analyst techniques.",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/665848ffb866f7a06e845357_SOC%20ANA-p-500.png",
    shortDesc:
      "The SOC Analyst program is expertly designed to equip you with essential skills needed for Security Operations Centers. You will explore SOC operations, utilize advanced security tools, and understand the role of a SOC Analyst in combating cybersecurity threats.",

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
    id: 3,
    subtitle: "CYBER DEFENDER",
    name: "Information Security and Ethical Hacking Course",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66584925cdee6b58f49bed23_information%20security-p-500.png",
    shortDesc:
      "The Cyber Defender program is meticulously crafted to arm you with robust skills for protecting and securing digital environments. You will learn advanced ethical hacking techniques, network security, malware analysis, and more. Equip yourself to stay ahead of cyber threats and safeguard systems effectively.",

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
    id: 4,
    subtitle: "CYBER FORENSICS",
    name: "Cyber Forensics",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/66584939f4815c7515fe822d_Cyber%20forensic-p-500.png",
    shortDesc:
      "The Cyber Forensics program is intricately designed to provide you with extensive skills in digital investigation and security. Learn to conduct thorough digital forensic investigations, manage digital evidence, and apply advanced security techniques to protect and analyze digital information effectively.",

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
    id: 5,
    subtitle: "BUG BOUNTY",
    name: "Bug Bounty",
    image:
      "https://cdn.prod.website-files.com/664b240b7fabdc2000ff433a/6658494cab129396f38d3925_BIG%20BUNTY-p-500.png",
    shortDesc:
      "The Bug Bounty program is designed to provide you with comprehensive skills in identifying, analyzing, and exploiting software vulnerabilities. Learn to use advanced tools and techniques to uncover and address security flaws, contributing to software integrity and resilience against attacks.",

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
  }
];

const LabPricing = () => {
const [, navigate] = useLocation();
  const [labs] = useState(cyberLabs);

  const handlePlanClick = (lab) => {
    toast.success("Added to cart", { autoClose: 2000 });
  };

  return (
    <div className="py-10 px-4 md:px-10 bg-white">
      {/* Banner */}
     {/* <div className="relative w-full h-64 bg-blue-900">
        <img
          src="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
          alt="Privacy Policy Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Courses
</h1>
        </div>
      </div> */}
     

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
  );
};

export default LabPricing;
