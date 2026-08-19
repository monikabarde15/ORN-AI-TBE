import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function SignupSection() {
  return (
    <section className="w-full bg-[#17122A] text-white py-20 md:py-28 px-6 text-center relative overflow-hidden selection:bg-[#6E56CF] selection:text-white">
      {/* Subtle geometric line pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6E56CF]/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
          Signup
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-white/90 font-normal max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Start your learning journey with ORN-AI and access personalized career support.
        </p>

        <Link
          href="/register"
          className="bg-white text-[#17122A] font-bold text-base sm:text-lg px-8 py-3.5 sm:px-10 sm:py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-slate-100 hover:-translate-y-1 active:scale-95 transition-all duration-300 inline-flex items-center justify-center"
        >
          Get Started Now
        </Link>
      </motion.div>
    </section>
  );
}

export default SignupSection;
