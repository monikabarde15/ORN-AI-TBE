import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Assess & Score",
    desc: "Standardized intake and AI-powered evaluation of CVs, technical skills, English proficiency, work eligibility, and workforce readiness.",
    number: "01",
    icon: (
      <svg viewBox="0 0 38 38" width="38" height="38">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="38" y2="38">
            <stop stopColor="#7e55fa" />
            <stop offset="1" stopColor="#53d1e0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" rx="14" width="38" height="38" fill="url(#g1)" />
        <circle cx="16.5" cy="17" r="6.2" stroke="#fff" strokeWidth="2" fill="none" />
        <line x1="27" y1="27" x2="22.2" y2="22.2" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Upskill & Validate",
    desc: "Targeted upskilling pathways, realtime project validation, and guided learning designed to close deployment gaps efficiently.",
    number: "02",
    icon: (
      <svg viewBox="0 0 38 38" width="38" height="38">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="38" y2="38">
            <stop stopColor="#53d1e0" />
            <stop offset="1" stopColor="#7e55fa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" rx="14" width="38" height="38" fill="url(#g2)" />
        <path d="M10 20h18M19 10v18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Prepare & Deploy",
    desc: "AI-ranked, recruiter-ready, talent-matched candidate pipelines delivered with standardized readiness scoring and recruiter intelligence.",
    number: "03",
    icon: (
      <svg viewBox="0 0 38 38" width="38" height="38">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="38" y2="38">
            <stop stopColor="#ff7a7a" />
            <stop offset="1" stopColor="#ffb347" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" rx="14" width="38" height="38" fill="url(#g3)" />
        <polygon points="10,28 19,10 28,28" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
  },
];

const categories = [
  {
    name: "Cross-Technology Training",
    color: "rgba(249, 199, 79, 0.15)",
    iconColor: "#F9C74F",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.684-.287 2.489.107.711.327 1.419.671 2.086l.003-.001c1.634 3.163 6.993 4.065 10.324 1.977 1.96-1.228 3.327-3.113 3.967-5.173.64-2.06.49-4.218-.416-6.05l-.062-.13c-.823-1.687-2.326-2.837-3.784-3.586-1.458-.749-2.998-1.192-4.5-1.472z"/>
      </svg>
    )
  },
  {
    name: "CV Writing & Optimization",
    color: "rgba(239, 71, 111, 0.15)",
    iconColor: "#EF476F",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11.25 3.75l-8.5 8.5 8.5 8.5M12.75 3.75l8.5 8.5-8.5 8.5"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    )
  },
  {
    name: "Interview Preparation",
    color: "rgba(6, 174, 213, 0.15)",
    iconColor: "#06AED5",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.25v4.66c0 4.23-2.88 8.17-6 9.14-3.12-.97-6-4.91-6-9.14V6.43l6-2.25z"/>
      </svg>
    )
  },
  {
    name: "Soft Skills & Communication",
    color: "rgba(17, 138, 178, 0.15)",
    iconColor: "#118AB2",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    )
  },
  {
    name: "Job Placement & Career Support",
    color: "rgba(138, 201, 38, 0.15)",
    iconColor: "#8AC926",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      </svg>
    )
  },
  {
    name: "Career Portfolio Building & Industry Projects",
    color: "rgba(255, 159, 28, 0.15)",
    iconColor: "#FF9F1C",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18M7 16l4-4 3 3 5-7"/>
        <circle cx="7" cy="16" r="1.5" fill="currentColor"/>
        <circle cx="11" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="14" cy="15" r="1.5" fill="currentColor"/>
        <circle cx="19" cy="8" r="1.5" fill="currentColor"/>
      </svg>
    )
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const SolutionTimeline = () => (
  <section className="py-[60px] px-4 md:px-6 lg:px-8 bg-white text-black min-h-[80vh] overflow-hidden">
    <motion.div
      className="max-w-[900px] mx-auto mb-10 text-center px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      variants={fadeUp}
    >
      <span className="text-[#a789fa] text-base md:text-[1.05rem] font-bold tracking-[2px] uppercase mb-3 block">
        THE SOLUTION
      </span>
      <h2 className="text-2xl md:text-[2.1rem] lg:text-[2.4rem] font-bold mb-2 leading-tight">
        Turning raw talent into recruiter-ready pipelines.
        <br />
        <span className="bg-gradient-to-r from-[#7e55fa] via-[#7e55fa] to-[#53d1e0] bg-clip-text text-transparent">
          Recruiter-ready talent pipelines.
        </span>
      </h2>
    </motion.div>

    <div className="relative max-w-[1200px] w-[90%] mx-auto">
      {/* Background Line - hidden on mobile */}
      <div className="absolute left-0 right-0 top-[60px] h-[3px] w-full bg-gradient-to-r from-[#7e55fa22] via-[#53d1e038] to-[#53d1e038] rounded-[2px] pointer-events-none hidden md:block"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 justify-items-center items-stretch relative z-[2]">
        {steps.map((step, i) => (
          <motion.div
            className="group bg-[#171721] rounded-[17px] border-[1.6px] border-[rgba(140,130,255,0.12)] p-6 md:p-7 lg:p-8 text-center max-w-[360px] transition-all duration-300 ease-out hover:border-[#7e55fa] hover:-translate-y-2 hover:scale-[1.02] lg:hover:scale-105 hover:shadow-[0_6px_20px_rgba(126,85,250,0.25)] hover:z-[2]"
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            custom={i}
            variants={fadeUp}
          >
            <div className="flex justify-center mb-4 relative">
              <span className="relative inline-block w-[38px] h-[55px]">
                {step.icon}
                <span className="absolute left-full -translate-x-1/2 -top-[13px] bg-[#140f3c] text-[#a789fa] rounded-full px-[11px] py-[2px] font-bold text-[0.95rem] border-2 border-[#a789fa] z-[3]">
                  {step.number}
                </span>
              </span>
            </div>
            <div className="text-[#a789fa] text-base md:text-[1.18rem] font-bold mb-2">
              {step.title}
            </div>
            <div className="text-[#e0dbff] text-sm md:text-[0.98rem] font-normal leading-relaxed">
              {step.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Category Buttons Section */}
    <motion.div
      className="mt-4 mb-12 px-4 md:px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      variants={fadeUp}
    >
      <div className="max-w-7xl mx-auto">
        {/* First Row - 4 buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {categories.slice(0, 4).map((category, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(126, 85, 250, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-2xl py-7 px-6 flex flex-col items-center gap-3.5 cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:border-[#7e55fa]/30"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
            >
              <div 
                className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: category.color, color: category.iconColor }}
              >
                {category.icon}
              </div>
              <span className="text-base font-semibold text-black">
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Second Row - 2 buttons (remaining) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto lg:max-w-none lg:mx-0">
          {categories.slice(4).map((category, idx) => (
            <motion.button
              key={idx + 4}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 30px rgba(126, 85, 250, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-2xl py-7 px-6 flex flex-col items-center gap-3.5 cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:border-[#7e55fa]/30"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
            >
              <div 
                className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: category.color, color: category.iconColor }}
              >
                {category.icon}
              </div>
              <span className="text-base font-semibold text-black">
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);

export default SolutionTimeline;