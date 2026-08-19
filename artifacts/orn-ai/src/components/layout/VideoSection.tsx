import React from "react";
import { motion } from "framer-motion";

export function VideoSection() {
  const features = [
    "Resume Enhancement",
    "Curated Programs",
    "Employment Support",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#f8f9fa] py-16 md:py-20 lg:py-28 selection:bg-[#17122A] selection:text-white border-[8px] sm:border-[12px] md:border-[16px] border-white shadow-sm">
      {/* Split Background Layer: Left Brand Midnight (#17122A), Right Off-White */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full lg:w-[48%] h-full bg-[#17122A] relative overflow-hidden">
          {/* Subtle blueprint grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Bullet Points */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="lg:col-span-5 text-white pr-0 lg:pr-4"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.18] tracking-tight text-white mb-8">
              Learn with<br />
              purpose,<br />
              grow with<br />
              guidance.
            </h2>

            {/* Feature List with Brand Purple Accent Bars */}
            <div className="space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="flex items-center gap-3.5 group cursor-default"
                >
                  <span className="w-[3.5px] h-6 bg-[#6E56CF] rounded-full flex-shrink-0 group-hover:scale-y-125 transition-transform duration-300" />
                  <span className="text-white/95 text-base sm:text-lg font-medium tracking-wide group-hover:text-white transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Embedded YouTube Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.25 }}
            className="lg:col-span-7 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-2xl rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(23,18,42,0.22)] hover:shadow-[0_25px_60px_rgba(23,18,42,0.32)] transition-shadow duration-500 bg-black border border-black/10">
              <div className="relative w-full aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/6eZ6QYcMc2c?autoplay=1&mute=1&loop=1&playlist=6eZ6QYcMc2c&controls=1&rel=0&modestbranding=1"
                  title="ORN-AI Learning"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default VideoSection;
