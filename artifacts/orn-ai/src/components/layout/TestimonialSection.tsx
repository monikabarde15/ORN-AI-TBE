import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string | number;
  author: string;
  role: string;
  company?: string;
  initials: string;
  quote: string;
  rating: number;
}

const testimonialSets: Testimonial[][] = [
  // Set 1 (Featured + 3 grid cards)
  [
    {
      id: "set1-1",
      author: "Alex Rivera",
      role: "AI Systems Architect",
      company: "Apex Global",
      initials: "AR",
      rating: 5,
      quote:
        "The specialized conditioning pipeline transformed my understanding of model deployment. In just four months, I bridged the gap from theoretical knowledge to building enterprise-grade LLM architectures that our engineering lead approved on first review.",
    },
    {
      id: "set1-2",
      author: "Nikita Miller",
      role: "Machine Learning Engineer",
      company: "DataVantage",
      initials: "NM",
      rating: 5,
      quote:
        "The curriculum was practical, modern, and aligned with Tier-1 European tech standards. The hands-on project labs gave me the exact confidence needed for senior technical interviews.",
    },
    {
      id: "set1-3",
      author: "Rohan Sharma",
      role: "Cyber Security Analyst",
      company: "FortressNet",
      initials: "RS",
      rating: 5,
      quote:
        "The Linux WebSSH simulation labs and ISCSI environment practice were unmatched. It felt like handling a real production incident on day one.",
    },
    {
      id: "set1-4",
      author: "Sophia Kowalska",
      role: "Full-Stack Engineer",
      company: "CloudScale Europe",
      initials: "SK",
      rating: 5,
      quote:
        "ORN-AI helped me standardize my technical signal and clear interviews across 3 EU jurisdictions. The mentor guidance and video resume coaching were invaluable.",
    },
  ],
  // Set 2 (Rotated Featured + 3 grid cards)
  [
    {
      id: "set2-1",
      author: "Dmitri Volkov",
      role: "Senior DevOps Engineer",
      company: "ScaleGrid Europe",
      initials: "DV",
      rating: 5,
      quote:
        "Transitioning from legacy infrastructure to cloud automation felt seamless. The hands-on containerization and CI/CD pipelines mirror production architectures at Tier-1 tech giants.",
    },
    {
      id: "set2-2",
      author: "Elena Popova",
      role: "Data & BI Specialist",
      company: "InsightTech",
      initials: "EP",
      rating: 5,
      quote:
        "The statistical depth, interactive visualization projects, and real enterprise datasets pushed my problem-solving ability to an executive level.",
    },
    {
      id: "set2-3",
      author: "Mateusz Nowak",
      role: "Security Operations Specialist",
      company: "SecureCore",
      initials: "MN",
      rating: 5,
      quote:
        "The zero-trust simulation modules and vulnerability assessment capstones were decisive in landing my offer at a Berlin-based fintech firm.",
    },
    {
      id: "set2-4",
      author: "Klara Varga",
      role: "Cloud Infrastructure Architect",
      company: "Nordic AI Labs",
      initials: "KV",
      rating: 5,
      quote:
        "Structured scoring gave recruiters confidence in my profile before the first screening call. It cut my job search from 5 months to 3 weeks.",
    },
  ],
];

function LargeQuoteIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-10 h-10 ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

export function Testimonials() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSets = testimonialSets.length;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % totalSets);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, totalSets]);

  const handlePrev = () => {
    setCurrentSetIndex((prev) => (prev - 1 + totalSets) % totalSets);
  };

  const handleNext = () => {
    setCurrentSetIndex((prev) => (prev + 1) % totalSets);
  };

  const currentSet = testimonialSets[currentSetIndex];
  const featuredTestimonial = currentSet[0];
  const secondaryTestimonial = currentSet[1];
  const bottomTestimonial1 = currentSet[2];
  const bottomTestimonial2 = currentSet[3];

  return (
    <section className="w-full bg-[#f9f9f9] text-[#1a1c1c] overflow-hidden selection:bg-[#17122A] selection:text-white">
      {/* Header Section (#17122A Theme) */}
      <div className="bg-[#17122A] text-white w-full py-16 md:py-20 px-6 md:px-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
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
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="font-mono text-xs text-[#A48FFF] uppercase tracking-widest block mb-3 font-semibold">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight mb-4 leading-tight">
            What Our Learners Say
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Honest experiences from students who transformed their careers with ORN-AI.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid Area with Smooth Disappear / Reappear Cycling */}
      <div
        className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-16 py-16 md:py-20"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSetIndex}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Top Row: Large Featured Dark #17122A Card (8 cols) */}
            <div className="md:col-span-8 bg-[#17122A] text-white rounded-2xl p-8 md:p-12 shadow-md border border-white/10 flex flex-col justify-between relative overflow-hidden group">
              {/* Subtle background ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#6E56CF]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />

              <div className="relative z-10">
                {/* Quote Icon */}
                <LargeQuoteIcon className="text-[#6E56CF] mb-5 opacity-90" />

                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-6 text-[#6E56CF]">
                  {Array.from({ length: featuredTestimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#6E56CF] text-[#6E56CF]"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-base sm:text-lg md:text-[19px] text-white/95 leading-relaxed font-normal mb-8">
                  "{featuredTestimonial.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 relative z-10 pt-4 border-t border-white/10 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#6E56CF] flex items-center justify-center font-bold text-base text-white shadow-md">
                  {featuredTestimonial.initials}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {featuredTestimonial.author}
                  </h4>
                  <p className="text-sm text-[#A48FFF]">
                    {featuredTestimonial.role}
                    {featuredTestimonial.company && ` at ${featuredTestimonial.company}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Row: Medium White Card (4 cols) */}
            <div className="md:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div>
                <LargeQuoteIcon className="text-[#74777f]/60 mb-5" />
                <p className="text-sm sm:text-base text-[#43474e] leading-relaxed mb-6 font-normal">
                  "{secondaryTestimonial.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 border-t border-[#E2E8F0] mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#f3f3f4] border border-[#E2E8F0] flex items-center justify-center font-bold text-sm text-[#17122A]">
                  {secondaryTestimonial.initials}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#17122A]">
                    {secondaryTestimonial.author}
                  </h4>
                  <p className="text-xs text-[#43474e]">
                    {secondaryTestimonial.role}
                    {secondaryTestimonial.company && ` at ${secondaryTestimonial.company}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Left Small Card (6 cols) */}
            <div className="md:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div>
                <LargeQuoteIcon className="text-[#74777f]/60 mb-5" />
                <p className="text-sm sm:text-base text-[#43474e] leading-relaxed mb-6 font-normal">
                  "{bottomTestimonial1.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 border-t border-[#E2E8F0] mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#f3f3f4] border border-[#E2E8F0] flex items-center justify-center font-bold text-sm text-[#17122A]">
                  {bottomTestimonial1.initials}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#17122A]">
                    {bottomTestimonial1.author}
                  </h4>
                  <p className="text-xs text-[#43474e]">
                    {bottomTestimonial1.role}
                    {bottomTestimonial1.company && ` at ${bottomTestimonial1.company}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Right Small Card (6 cols) */}
            <div className="md:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div>
                <LargeQuoteIcon className="text-[#74777f]/60 mb-5" />
                <p className="text-sm sm:text-base text-[#43474e] leading-relaxed mb-6 font-normal">
                  "{bottomTestimonial2.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 border-t border-[#E2E8F0] mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#f3f3f4] border border-[#E2E8F0] flex items-center justify-center font-bold text-sm text-[#17122A]">
                  {bottomTestimonial2.initials}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#17122A]">
                    {bottomTestimonial2.author}
                  </h4>
                  <p className="text-xs text-[#43474e]">
                    {bottomTestimonial2.role}
                    {bottomTestimonial2.company && ` at ${bottomTestimonial2.company}`}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel / Set Controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={handlePrev}
            aria-label="Previous testimonials"
            className="w-10 h-10 rounded-full border border-[#17122A]/20 flex items-center justify-center text-[#17122A] hover:bg-[#17122A] hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {testimonialSets.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSetIndex(idx)}
                aria-label={`Go to testimonial group ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSetIndex === idx
                    ? "bg-[#17122A] w-7"
                    : "bg-[#17122A]/25 hover:bg-[#17122A]/50 w-2.5"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next testimonials"
            className="w-10 h-10 rounded-full border border-[#17122A]/20 flex items-center justify-center text-[#17122A] hover:bg-[#17122A] hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
