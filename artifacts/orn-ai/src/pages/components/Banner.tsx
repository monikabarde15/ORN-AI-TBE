import React from "react";
import { motion } from "framer-motion";


export default function HeroBanner({
  title,
  subtitle,
  ctaText = "Get Started",
  ctaHref = "#",
  image,
  height = "h-96",
}) {
  return (
    <section className={`relative w-full overflow-hidden ${height} bg-gray-800`}>
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${image})`, filter: "brightness(0.6)" }}
        aria-hidden
      />

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/40 via-transparent to-black/30" />

      <div className="relative z-10 max-w-6xl mx-auto h-full flex items-center px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 md:space-y-6 text-white max-w-2xl"
        >
         <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-center w-full mx-auto">
  {title} 
</h1>


          {/* <p className="text-sm md:text-base text-gray-200/90">
            {subtitle}
          </p> */}

          {/* <div className="flex items-center gap-3 pt-2">
            {ctaText && (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600/95 hover:bg-indigo-700 transition-shadow shadow-md text-sm font-medium"
              >
                {ctaText}
              </a>
            )}
          </div> */}
        </motion.div>
      </div>

      <svg className="absolute right-6 bottom-6 w-36 opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path fill="url(#g1)" d="M43.8,-63.5C57.6,-51.4,68.5,-38.1,73.9,-22.5C79.3,-6.9,79.1,10.9,71.9,25.8C64.8,40.7,50.6,52.6,35.1,59.5C19.6,66.5,2.9,68.4,-13.6,71.2C-30.1,74.1,-46.3,77.9,-56.6,70.7C-66.9,63.5,-71.4,45.3,-73.6,27.1C-75.8,8.9,-75.6,-9.3,-68.3,-24.7C-61,-40.1,-46.6,-52.6,-31,-64.6C-15.3,-76.6,1.6,-88.1,16.6,-86.2C31.6,-84.3,43.9,-69.7,43.8,-63.5Z" transform="translate(100 100)" />
      </svg>
    </section>
  );
}


