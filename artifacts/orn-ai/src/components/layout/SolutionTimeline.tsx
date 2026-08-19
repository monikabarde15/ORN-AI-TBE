import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  FileCheck2,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Network,
  FileText,
  Briefcase,
  Users2,
  Building2,
  FolderGit2,
} from "lucide-react";

export function SolutionTimeline() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const processSteps = [
    {
      number: "01",
      title: "Assess & Score",
      desc: "Standardized intake and AI-powered evaluation of CVs, technical skills, English proficiency, work eligibility, and workforce readiness.",
      icon: FileCheck2,
    },
    {
      number: "02",
      title: "Upskill & Validate",
      desc: "Targeted upskilling pathways, realtime project validation, and guided learning designed to close deployment gaps efficiently.",
      icon: Layers,
    },
    {
      number: "03",
      title: "Prepare & Deploy",
      desc: "AI-ranked, recruiter-ready, talent-matched candidate pipelines delivered with standardized readiness scoring and recruiter intelligence.",
      icon: Sparkles,
    },
  ];

  const careerSupportCards = [
    {
      title: "Cross-Technology Training",
      desc: "Expanding skillsets across adjacent stacks to increase deployment versatility.",
      icon: Network,
    },
    {
      title: "CV Writing & Optimization",
      desc: "Algorithmic optimization of resumes for modern ATS systems and human review.",
      icon: FileText,
    },
    {
      title: "Interview Preparation",
      desc: "Rigorous simulation of technical, architecture, and behavioral interview panels.",
      icon: Users2,
    },
    {
      title: "Soft Skills & Communication",
      desc: "Executive communication and collaboration coaching tailored for Tier-1 engineering teams.",
      icon: Briefcase,
    },
    {
      title: "Job Placement & Career Support",
      desc: "Direct routing of verified candidate profiles into employer CRMs and hiring pipelines.",
      icon: Building2,
    },
    {
      title: "Career Portfolio Building & Industry Projects",
      desc: "Curation of verifiable enterprise-grade project work into presentation-ready formats.",
      icon: FolderGit2,
    },
  ];

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const cardWidth = 320;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveSlide(Math.min(Math.max(index, 0), careerSupportCards.length - 1));
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 330;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setActiveSlide(index);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) scrollToSlide(activeSlide - 1);
  };

  const handleNext = () => {
    if (activeSlide < careerSupportCards.length - 1) scrollToSlide(activeSlide + 1);
  };

  return (
    <section className="relative w-full bg-[#f7f9fb] text-[#191c1e] py-16 md:py-24 px-6 md:px-12 lg:px-16 overflow-hidden selection:bg-[#17122A] selection:text-white">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,18,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(23,18,42,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Top Split Section: The Solution & 3 Process Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start mb-20 md:mb-28">
          
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.2 }}
              className="lg:sticky lg:top-28 flex flex-col gap-4"
            >
              {/* Pipeline Tag */}
              <div className="inline-flex items-center gap-2.5 text-[#6E56CF] mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6E56CF]"></span>
                </span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                  The Solution
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold text-[#17122A] leading-[1.15] tracking-tight">
                Turning raw talent into recruiter-ready pipelines.
              </h2>

              {/* Description */}
              <p className="text-[#43474e] text-base sm:text-lg leading-relaxed max-w-md mt-2 font-normal">
                Our proprietary assessment engine evaluates technical competency, soft skills, and cultural fit, creating a verifiable profile of capability before deployment.
              </p>

              {/* Action Button */}
              <div className="mt-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-[#17122A] hover:bg-[#2B234B] active:scale-95 text-white font-mono text-xs uppercase tracking-wider font-semibold px-6 py-3.5 rounded-lg shadow-sm hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span>Explore Engine</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Process Cards (01, 02, 03) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.15 }}
                  className="group bg-[#17122A] text-white rounded-2xl p-7 sm:p-8 relative overflow-hidden shadow-lg border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Subtle Background Number */}
                  <div className="absolute top-4 right-6 text-white/15 font-extrabold text-5xl sm:text-6xl select-none pointer-events-none group-hover:text-white/30 transition-colors duration-300">
                    {step.number}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start relative z-10">
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white group-hover:bg-[#6E56CF] group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col gap-2 flex-grow pr-10 sm:pr-12">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        {step.title}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-[15px] leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Bottom Section: Comprehensive Career Support (Scrollable Carousel) */}
        <div className="pt-12 md:pt-16 border-t border-[#17122A]/10 relative">
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-10 md:mb-14"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#17122A] mb-3 tracking-tight">
              Comprehensive Career Support
            </h3>
            <p className="text-[#43474e] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              Beyond technical proficiency, we equip talent with the collateral needed to navigate modern hiring ecosystems.
            </p>
          </motion.div>

          {/* Scrollable Container with Smooth Snap & Overflow */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {careerSupportCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.15 }}
                  className="career-card group bg-[#17122A] text-white rounded-2xl p-7 sm:p-8 border border-white/10 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 min-w-[280px] sm:min-w-[310px] md:min-w-[330px] max-w-[340px] snap-start flex flex-col justify-between flex-shrink-0 relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-white/90 mb-5 group-hover:scale-110 group-hover:text-[#A48FFF] transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl sm:text-[22px] font-bold text-white mb-3 tracking-tight leading-snug">
                      {card.title}
                    </h4>
                    <p className="text-white/75 text-sm sm:text-[15px] leading-relaxed font-light">
                      {card.desc}
                    </p>
                  </div>

                  {/* Bottom subtle accent indicator line */}
                  <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
                    <div className="w-0 group-hover:w-full h-full bg-[#6E56CF] transition-all duration-500 rounded-full" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Controls: Arrows & Active Indicator Dots */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={activeSlide === 0}
              aria-label="Previous Slide"
              className="w-10 h-10 rounded-full border border-[#17122A]/20 flex items-center justify-center text-[#17122A] hover:bg-[#17122A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {careerSupportCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === i
                      ? "bg-[#17122A] w-7"
                      : "bg-[#17122A]/25 hover:bg-[#17122A]/50 w-2.5"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={activeSlide === careerSupportCards.length - 1}
              aria-label="Next Slide"
              className="w-10 h-10 rounded-full border border-[#17122A]/20 flex items-center justify-center text-[#17122A] hover:bg-[#17122A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

export default SolutionTimeline;
