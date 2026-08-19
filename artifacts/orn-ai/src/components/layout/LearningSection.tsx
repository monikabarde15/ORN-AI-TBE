import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ShieldCheck,
  BrainCircuit,
  Laptop,
  Infinity,
  Code2,
  Layers,
  Database,
  ArrowRight,
} from "lucide-react";

interface CourseCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  stats?: string[];
}

export function LearningSection() {
  const featuredCourse: CourseCard = {
    title: "Cyber Security",
    description:
      "Gain foundational knowledge and practical skills to protect digital assets. Learn key concepts, threat mitigation strategies, and best practices. Join us to master safeguarding against cyber threats.",
    icon: ShieldCheck,
    link: "/cyber-security",
    stats: [
      "3 node linux web ssh lab",
      "2 node iscsi Lab",
      "WebSSH Lab Integration",
      "3 Hrs Video Tutorial",
      "Blogs",
      "Complete steps along with screenshot example",
    ],
  };

  const remainingCourses: CourseCard[] = [
    {
      title: "Data Science & A.I",
      description:
        "Fully acquire essential skills in data analysis and AI development, focusing on key concepts and machine learning techniques. Join us to harness the transformative potential of data and artificial intelligence configured environment for professionals.",
      icon: BrainCircuit,
      link: "/data-science-ai",
    },
    {
      title: "Advance Programs",
      description:
        "Learn essential skills in continuous integration, infrastructure automation, and collaboration tools. Master streamlined software development practices for modern environments.",
      icon: Laptop,
      link: "/advanced-programs",
    },
    {
      title: "DevOps Engineering",
      description:
        "Build a strong foundation in programming and modern software development practices, from core logic to deployment-ready applications. Gain hands-on experience with real projects.",
      icon: Infinity,
      link: "/technology-programs",
    },
    {
      title: "Advanced Programming Tracks",
      description:
        "Deep-dive into specialized areas of software engineering with guided, project-based modules. Focus on writing clean, scalable code while mastering tools used in professional teams.",
      icon: Code2,
      link: "/technology-programs",
    },
    {
      title: "Full-Stack Development",
      description:
        "Learn to build complete web applications from front end to back end with modern frameworks. Practice deploying responsive, secure apps that are optimized for real users and real servers.",
      icon: Layers,
      link: "/technology-programs",
    },
    {
      title: "Data Science & Analytics",
      description:
        "Hands-on data analytics, visualization, and containerized pipelines practice. Explore datasets, machine learning models, statistical analysis, and interactive dashboard creation.",
      icon: Database,
      link: "/business-analytics",
    },
  ];

  const FeaturedIcon = featuredCourse.icon;

  return (
    <section className="relative w-full bg-[#f7f9fb] text-[#191c1e] overflow-hidden selection:bg-[#17122A] selection:text-white">
      {/* Full-Width Deep Midnight Brand (#17122A) Header */}
      <div className="w-full bg-[#17122A] text-white py-16 md:py-24 px-6 md:px-12 text-center relative overflow-hidden">
        {/* Subtle geometric blueprint grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="font-mono text-xs sm:text-sm text-[#A48FFF] uppercase tracking-widest font-semibold bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
              ORN-AI Your Path to Professional Growth
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-white mb-5 font-bold leading-[1.18] tracking-tight">
            Learn with purpose, grow with guidance, and take confident{" "}
            <span className="text-[#A48FFF]">
              steps toward your dream career.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Enjoy a curated selection of courses designed to help you build
            strong skills, gain practical experience, and move closer to your
            career goals.
          </p>
        </motion.div>
      </div>

      {/* Cards Layout Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Featured Primary Category: Cyber Security */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="group relative bg-[#17122A] text-white rounded-2xl p-8 sm:p-10 md:p-12 shadow-xl border border-white/10 flex flex-col lg:flex-row gap-10 lg:gap-12 justify-between items-start overflow-hidden hover:border-white/20 transition-all duration-500"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#6E56CF]/20 rounded-full blur-[110px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#A48FFF]/10 rounded-full blur-[90px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            {/* Left Content */}
            <div className="flex-1 max-w-2xl flex flex-col h-full relative z-10">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#6E56CF]/30 transition-all duration-300">
                  <FeaturedIcon className="w-8 h-8 text-[#A48FFF]" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
                  {featuredCourse.title}
                </h3>
                <p className="text-white/80 text-base leading-relaxed max-w-xl font-normal">
                  {featuredCourse.description}
                </p>
              </div>

              <div className="mt-auto pt-2">
                <Link
                  href={featuredCourse.link}
                  className="inline-flex items-center gap-2 bg-[#6E56CF] hover:bg-[#5842B5] active:scale-95 text-white px-8 py-3.5 rounded-lg font-mono text-sm tracking-wider uppercase font-semibold transition-all duration-300 shadow-lg shadow-[#6E56CF]/25 group/btn"
                >
                  <span>Explore Lab</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Right Key Features Box */}
            <div className="flex-1 lg:max-w-md w-full bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10 relative z-10 group-hover:border-white/20 transition-colors duration-300">
              <h4 className="font-mono text-[#A48FFF] text-xs sm:text-sm uppercase tracking-widest mb-6 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6E56CF]" />
                Key Features
              </h4>
              <ul className="space-y-3.5">
                {featuredCourse.stats?.map((stat, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                    viewport={{ once: false }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A48FFF] mt-2 flex-shrink-0" />
                    <span className="text-white/90 text-sm leading-snug">
                      {stat}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Grid of Remaining 6 Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingCourses.map((course, index) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: (index % 3) * 0.08,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  viewport={{ once: false, amount: 0.15 }}
                  className="group bg-white border border-[#17122A]/10 hover:border-[#6E56CF]/50 rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle hover gradient on top border */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6E56CF]/0 to-transparent group-hover:via-[#6E56CF] transition-all duration-500" />

                  <div>
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-[#f0edf7] group-hover:bg-[#17122A] flex items-center justify-center mb-6 text-[#17122A] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl text-[#17122A] font-bold mb-3 tracking-tight group-hover:text-[#6E56CF] transition-colors duration-300">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#43474e] text-sm leading-relaxed mb-8 font-normal">
                      {course.description}
                    </p>
                  </div>

                  {/* Learn More Link */}
                  <Link
                    href={course.link}
                    className="font-mono text-xs sm:text-sm text-[#17122A] group-hover:text-[#6E56CF] font-bold flex items-center gap-2 mt-auto uppercase tracking-wider group/link pt-4 border-t border-[#17122A]/5 group-hover:underline"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LearningSection;
