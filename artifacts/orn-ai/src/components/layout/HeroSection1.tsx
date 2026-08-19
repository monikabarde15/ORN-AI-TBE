import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { User, CheckCircle, BookOpen, Send, ArrowRight, Sparkles, Check } from "lucide-react";

interface StageConfig {
  id: string;
  number: string;
  name: string;
  desc: string;
  hoverTooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glowColor: string;
  percent: number;
}

const STAGES: StageConfig[] = [
  {
    id: "talent",
    number: "01",
    name: "Talent",
    desc: "Discover potential",
    hoverTooltip: "Potential identified",
    icon: User,
    color: "#6E56CF",
    glowColor: "rgba(110, 86, 207, 0.4)",
    percent: 25,
  },
  {
    id: "intelligence",
    number: "02",
    name: "Intelligence",
    desc: "Map skills & gaps",
    hoverTooltip: "Skills & gaps mapped",
    icon: CheckCircle,
    color: "#7C66DC",
    glowColor: "rgba(124, 102, 220, 0.4)",
    percent: 50,
  },
  {
    id: "capability",
    number: "03",
    name: "Capability",
    desc: "Build the right skills",
    hoverTooltip: "Learning pathway aligned",
    icon: BookOpen,
    color: "#8E75F0",
    glowColor: "rgba(142, 117, 240, 0.4)",
    percent: 75,
  },
  {
    id: "deployment",
    number: "04",
    name: "Deployment",
    desc: "Workforce ready",
    hoverTooltip: "Workforce ready",
    icon: Send,
    color: "#7C66DC",
    glowColor: "rgba(124, 102, 220, 0.4)",
    percent: 100,
  },
];

export function HeroSection1() {
  const [activeStage, setActiveStage] = useState(0);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 1600);

    return () => clearInterval(interval);
  }, [isInView]);

  const signalLeftPositions = ["12.5%", "37.5%", "62.5%", "87.5%"];
  const currentSignalLeft = signalLeftPositions[activeStage];
  const currentProgressPercent = STAGES[activeStage].percent;
  const isFinalStage = activeStage === 3;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#f7f9fb] flex items-center py-16 lg:py-20 px-6 sm:px-8 lg:px-14 selection:bg-[#17122A] selection:text-white"
    >
      {/* Background Decorative Mesh with #17122A brand tones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[35%] right-[20%] w-[520px] h-[520px] bg-[#6E56CF]/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] bg-[#17122A]/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(23,18,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(23,18,42,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 25%, black 75%, transparent 100%)",
          }}
        />
        <div className="absolute -top-40 -right-40 w-[680px] h-[680px] rounded-full border border-[#17122A]/10 pointer-events-none" />
      </div>

      <div className="max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
        
        {/* Left Column: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="lg:col-span-5 flex flex-col justify-center max-w-2xl lg:max-w-none pr-0 lg:pr-3"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-[2.5px] bg-[#6E56CF] rounded-full" />
            <span className="font-mono text-xs sm:text-sm text-[#6E56CF] uppercase tracking-[0.2em] font-bold">
              European Workforce Intelligence
            </span>
          </motion.div>

          {/* Clean, Bold Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px] 2xl:text-[56px] font-extrabold text-[#17122A] leading-[1.28] sm:leading-[1.25] tracking-tight mb-8"
          >
            ORN-AI bridges Europe’s talent gap{" "}
            <span className="whitespace-nowrap">
              with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6E56CF] via-[#8E75F0] to-[#A48FFF]">
                deployment-ready
              </span>
            </span>{" "}
            workforce capability.
          </motion.h1>

          {/* CTA Action */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-wrap items-center gap-5"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-3.5 bg-[#17122A] hover:bg-[#2B234B] text-white px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow-xl shadow-[#17122A]/15 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
            >
              <span>Signup Now</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Continuous ORN-AI Journey Storyboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.25 }}
          className="lg:col-span-7 flex justify-center items-center relative"
        >
          <div className="relative w-full max-w-[720px] bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#e2e8f0] shadow-[0_20px_60px_rgba(23,18,42,0.06)] overflow-hidden transition-all duration-500">
            
            {/* Subtle Capability Intelligence Field */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
              style={{
                background:
                  activeStage === 0
                    ? "radial-gradient(circle, rgba(110,86,207,0.12) 0%, transparent 70%)"
                    : activeStage === 1
                    ? "radial-gradient(circle, rgba(124,102,220,0.14) 0%, transparent 70%)"
                    : activeStage === 2
                    ? "radial-gradient(circle, rgba(142,117,240,0.14) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(110,86,207,0.16) 0%, transparent 70%)",
              }}
            />

            {/* Header / Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#e4e9ee] relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#17122A] uppercase tracking-wider">
                {/* <Sparkles className="w-3.5 h-3.5 text-[#6E56CF] animate-pulse" /> */}
                <span>How ORN-AI moves talent to deployment</span>
              </div>
              <div className="text-[11px] font-mono text-[#8792a0]">
                PLATFORM PRINCIPLE
              </div>
            </div>

            {/* Principle Tagline */}
            <div className="text-center my-6 relative z-10">
              <span className="text-[10px] font-mono text-[#9aa5b2] uppercase tracking-widest block mb-1">
                Workflow Matrix
              </span>
              <p className="text-sm sm:text-base font-bold text-[#17122A]">
                Potential <span className="text-[#6E56CF]">→</span> capability <span className="text-[#6E56CF]">→</span> deployment
              </p>
            </div>

            {/* Stage Path & Nodes Container */}
            <div className="relative py-8 my-4">
              {/* Static Background Path */}
              <div className="absolute top-[48px] left-[12.5%] right-[12.5%] h-[3px] bg-[#e2e7ed] rounded-full" />

              {/* Dynamic Illuminated Path */}
              <div
                className="absolute top-[48px] left-[12.5%] h-[3px] bg-gradient-to-r from-[#6E56CF] via-[#7C66DC] to-[#8E75F0] rounded-full transition-all duration-700 ease-out"
                style={{
                  width:
                    activeStage === 0
                      ? "0%"
                      : activeStage === 1
                      ? "25%"
                      : activeStage === 2
                      ? "50%"
                      : "75%",
                }}
              />

              {/* Animated Capability Signal */}
              <div
                className="absolute top-[48px] -translate-y-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-in-out pointer-events-none"
                style={{ left: currentSignalLeft }}
              >
                <div className="w-4 h-4 rounded-full bg-white border-2 border-[#6E56CF] shadow-[0_0_12px_rgba(110,86,207,0.9),0_0_24px_rgba(142,117,240,0.6)] animate-pulse" />
                <div className="absolute inset-0 -m-1.5 rounded-full border border-[#6E56CF]/60 animate-ping" />
              </div>

              {/* 4 Sequential Stage Nodes */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 relative z-20">
                {STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isActive = activeStage === idx;
                  const isCompleted = activeStage > idx;
                  const isHovered = hoveredStage === idx;

                  return (
                    <div
                      key={stage.id}
                      onMouseEnter={() => setHoveredStage(idx)}
                      onMouseLeave={() => setHoveredStage(null)}
                      className="flex flex-col items-center text-center cursor-pointer group relative"
                    >
                      {/* Micro-interaction Hover Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-10 bg-[#17122A] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap z-40 border border-white/10 animate-fade-in pointer-events-none">
                          {stage.hoverTooltip}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#17122A] rotate-45" />
                        </div>
                      )}

                      {/* Node Icon Ring */}
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-500 relative ${
                          isActive
                            ? "bg-white scale-110 shadow-lg"
                            : isCompleted
                            ? "bg-white/95 shadow-sm"
                            : "bg-white/90 shadow-sm"
                        }`}
                        style={{
                          borderWidth: "1.5px",
                          borderColor: isActive
                            ? stage.color
                            : isCompleted
                            ? `${stage.color}80`
                            : "#dce4ea",
                          boxShadow: isActive
                            ? `0 0 0 6px ${stage.glowColor}, 0 10px 25px rgba(23,18,42,0.12)`
                            : "0 4px 12px rgba(23,18,42,0.05)",
                        }}
                      >
                        {isActive && (
                          <div
                            className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-30"
                            style={{ backgroundColor: stage.color }}
                          />
                        )}

                        <Icon
                          className={`w-6 h-6 transition-all duration-300 ${
                            isActive ? "scale-110" : "scale-100"
                          }`}
                          style={{
                            color: isActive || isCompleted ? stage.color : "#64748b",
                          }}
                        />

                        {/* Number Badge */}
                        <span
                          className={`absolute -bottom-1.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full transition-all duration-300 shadow-sm ${
                            isActive
                              ? "bg-[#17122A] text-white ring-2 ring-white scale-105"
                              : isCompleted
                              ? "bg-[#6E56CF] text-white"
                              : "bg-[#8792a0] text-white"
                          }`}
                        >
                          {stage.number}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <strong
                        className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${
                          isActive ? "text-[#17122A]" : "text-[#334155]"
                        }`}
                      >
                        {stage.name}
                      </strong>
                      <span
                        className={`text-[10px] sm:text-xs mt-0.5 leading-tight transition-colors duration-300 ${
                          isActive ? "text-[#6E56CF] font-medium" : "text-[#8792a0]"
                        }`}
                      >
                        {stage.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Outcome Card */}
            <div
              className={`mt-4 rounded-2xl p-4 sm:p-5 shadow-lg border relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-500 ${
                isFinalStage
                  ? "bg-[#17122A] border-[#6E56CF]/40 -translate-y-1 shadow-[0_15px_35px_rgba(23,18,42,0.35)]"
                  : "bg-[#17122A] border-white/10 translate-y-0"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-[#A48FFF] uppercase tracking-wider block">
                  VERIFIED OUTCOME
                </span>
                <strong className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Deployment-ready workforce</span>
                </strong>
                <div className="flex items-center gap-2 mt-1 text-xs text-white/80">
                  <span
                    className={`font-bold transition-colors duration-300 ${
                      isFinalStage ? "text-[#35d0b4] scale-110" : "text-[#35d0b4]/70"
                    }`}
                  >
                    ✓
                  </span>
                  <span>Capability aligned to Tier-1 European demand</span>
                </div>
              </div>

              {/* Synchronized Live Progression Indicator */}
              <div className="w-full sm:w-44 shrink-0">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#6E56CF] via-[#7C66DC] to-[#A48FFF] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${currentProgressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/70 mt-1.5">
                  <span className="capitalize">{STAGES[activeStage].name}</span>
                  <span
                    className={`transition-all duration-300 ${
                      isFinalStage
                        ? "text-[#C4B5FD] font-bold tracking-wide"
                        : "text-white/70"
                    }`}
                  >
                    {isFinalStage ? "100% Validated" : `${currentProgressPercent}% Completed`}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default HeroSection1;
