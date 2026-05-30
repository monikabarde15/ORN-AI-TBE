import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";


export function VideoSection() {

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 1, 1, 0.3]
  );

  return (
    <div className="min-h-[40vh] md:min-h-screen bg-[#130f20] flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8358ff]/20 rounded-full blur-[120px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#39c6fa]/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div
        ref={containerRef}
        className="h-auto md:h-screen flex items-center justify-center w-full"
        style={{ perspective: "2000px" }}
      >
        <motion.div
          style={{ rotateX, scale, opacity }}
          className="relative w-full max-w-full md:max-w-4xl"
        >
          {/* Window Frame */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-[0_20px_80px_rgba(131,88,255,0.3),0_0_40px_rgba(57,198,250,0.2)]">

            {/* RESPONSIVE VIDEO FRAME */}
            <div className="w-full aspect-[16/9] md:aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/6eZ6QYcMc2c"
                title="ORN-AI Learning"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

          </div>

          {/* Reflection */}
          <div className="absolute inset-x-0 -bottom-40 h-40 bg-gradient-to-b from-[#8358ff]/20 via-[#39c6fa]/10 to-transparent blur-2xl opacity-60 pointer-events-none"></div>

          {/* Extra Glow */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#8358ff]/10 via-transparent to-[#39c6fa]/10 blur-3xl rounded-xl"></div>
        </motion.div>
      </div>
    </div>
  );
}

export default VideoSection;