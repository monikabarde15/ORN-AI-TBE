import React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  CheckCircle2,
  Compass,
  PlaneTakeoff,
  Eye,
  ShieldCheck,
  RefreshCw,
  Shield,
} from "lucide-react";

export function TalentInfrastructure() {
  const missionCards = [
    {
      icon: CheckCircle2,
      title: "Workforce Readiness",
      description:
        "Prepare deployment-ready talent.",
    },
    {
      icon: Compass,
      title: "Industry Alignment",
      description:
        "Align talent with real workforce needs.",
    },
    {
      icon: PlaneTakeoff,
      title: "Reliable Deployment",
      description:
        "Build trusted talent pipelines across Europe.",
    },
  ];

  const visionCards = [
    {
      icon: ShieldCheck,
      title: "Verified Talent",
      description:
        "Build a trusted layer for verified and job-ready talent.",
    },
    {
      icon: RefreshCw,
      title: "Continuous Conditioning",
      description:
        "Enable continuous upskilling, validation, & workforce readiness.",
    },
    {
      icon: Shield,
      title: "Workforce Reliability",
      description:
        "Create dependable talent pipelines aligned to industry needs.",
    },
  ];

  return (
    <section id="Portfilo" className="w-full flex flex-col overflow-hidden bg-white selection:bg-[#17122A] selection:text-white">
      {/* Top Header Section (#17122A) with compact spacing */}
      <div className="w-full bg-[#17122A] pt-14 md:pt-16 pb-10 md:pb-12 px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.15] tracking-tight font-extrabold text-white max-w-4xl mx-auto mb-4 sm:mb-5"
        >
          ORN-AI is building that<br className="hidden md:block" /> <span className="text-[#A48FFF]">Talent Infrastructure.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-5xl mx-auto font-normal"
        >
          Through role-focused evaluation, talent conditioning, practical readiness, and professional preparation, ORN-AI creates stronger resource pipelines for organisations that need resources who are aligned to real role requirements, prepared for client expectations, and ready to contribute with confidence.
        </motion.p>
      </div>

      {/* Main Grid: White Background with #17122A Cards */}
      <div className="w-full bg-white py-12 md:py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Our Mission */}
          <div className="w-full">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.2 }}
              className="flex items-center gap-3.5 mb-8"
            >
              <div className="w-11 h-11 rounded-xl bg-[#17122A]/10 flex items-center justify-center text-[#17122A]">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-[28px] font-bold text-[#17122A] tracking-tight">
                Our Mission
              </h3>
            </motion.div>

            {/* Cards Stack */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {missionCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.15 }}
                    className="group bg-[#17122A] border border-[#17122A]/20 rounded-xl p-6 sm:p-7 flex items-start gap-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="text-white shrink-0 mt-0.5 group-hover:scale-110 group-hover:text-[#A48FFF] transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl text-white font-semibold tracking-tight">
                        {card.title}
                      </h4>
                      <p className="text-sm sm:text-[15px] leading-relaxed text-white/80 mt-1.5 font-light">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Our Vision */}
          <div className="w-full">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.2 }}
              className="flex items-center gap-3.5 mb-8"
            >
              <div className="w-11 h-11 rounded-xl bg-[#17122A]/10 flex items-center justify-center text-[#17122A]">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-[28px] font-bold text-[#17122A] tracking-tight">
                Our Vision
              </h3>
            </motion.div>

            {/* Cards Stack */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {visionCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.15 }}
                    className="group bg-[#17122A] border border-[#17122A]/20 rounded-xl p-6 sm:p-7 flex items-start gap-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="text-white shrink-0 mt-0.5 group-hover:scale-110 group-hover:text-[#A48FFF] transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl text-white font-semibold tracking-tight">
                        {card.title}
                      </h4>
                      <p className="text-sm sm:text-[15px] leading-relaxed text-white/80 mt-1.5 font-light">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default TalentInfrastructure;
