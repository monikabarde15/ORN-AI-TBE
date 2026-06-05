import React from "react";
import { motion } from "framer-motion";
import { Rocket, Target, Users, Award, Server, CheckCircle } from "lucide-react";
import { Shell } from "@/components/layout/Shell";

const AboutUs = () => {
  const features_new = [
    {
      icon: <Server className="w-6 h-6" />,
      title: "1. Misleading Training Promises",
      description:
        "Many learners are misled by unrealistic guarantees and high fees without real career outcomes.",
      sub: [
        "Overpromised job placements without real proof",
        "Expensive courses that don’t deliver practical value",
        "Marketing claims that don’t match training quality",
      ],
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "2. Lack of Real Skill Preparation",
      description:
        "Graduates struggle because training often lacks practical, industry-aligned learning.",
      sub: [
        "Minimal hands-on practice or real-world labs",
        "Outdated course material",
        "Too much theory instead of employable skills",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "3. Unsafe Job Channels",
      description:
        "Fraudulent agencies, risky backdoor hiring, and unclear roles are becoming common.",
      sub: [
        "Fake consultancies charging illegal placement fees",
        "Non-compliant hiring pathways",
        "No proper contracts or employer clarity",
      ],
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "4. No Post-Placement Support",
      description:
        "Most institutions leave students after placement—with no long-term guidance.",
      sub: [
        "No support for job stability",
        "No help with workplace challenges",
        "No future upskilling guidance",
      ],
    },
  ];

  const whyschoos = [
    "Ethical & Transparent Placement Process",
    "Practical, Industry-Aligned Training",
    "Region-Specific CV & Interview Guidance",
    "Support for Expats & International Job Seekers",
    "Continuous Career Mentoring",
    "100% Job-Guaranteed Programs (Merit-Based)",
  ];

  return (
    <>
        <Shell>


      {/* TOP BLUE HEADER */}
      <div
        className="w-full h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png')",
        }}
      >
        <h1 className="text-white text-5xl font-bold drop-shadow-lg">About Us</h1>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* ABOUT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="rounded-xl shadow-lg w-full object-cover"
          />

          <div>
            <h3 className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-2">
              About ORN-AI
            </h3>

            <h2 className="text-4xl font-bold text-gray-900 leading-snug mb-6">
              Welcome to ORN-AI E-Learning
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              ORN-AI is a boutique training platform dedicated to transforming careers
              through personalized, high-quality learning. We specialize in cross-technology
              training, CV writing, interview preparation, and ethical placements.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our mission is to empower learners with ethical, career-focused
              education & guaranteed job opportunities.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you are starting your IT journey or upgrading your skills,
              ORN-AI supports you at every step.
            </p>
          </div>
        </div>

        {/* PAIN POINTS SECTION */}
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Challenges Learners Face Today
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {features_new.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-md bg-white border hover:shadow-xl transition duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 mt-2">{item.description}</p>

                  <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                    {item.sub.map((point, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WHY CHOOSE SECTION */}
        <div className="bg-blue-50 rounded-2xl p-12 border mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Why Choose ORN-AI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {whyschoos.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="text-blue-600 w-6 h-6" />
                <p className="text-gray-700 text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="text-center bg-white border rounded-2xl p-12 shadow-sm">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Global Expansion
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            ORN-AI is expanding across Europe to support expats with localized CVs,
            market-specific job preparation, and career advancement pathways.
          </p>

          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 transition">
            Step Into Your Future with ORN-AI
          </button>
        </div>
      </div>

         </Shell>

    </>
  );
};

export default AboutUs;
