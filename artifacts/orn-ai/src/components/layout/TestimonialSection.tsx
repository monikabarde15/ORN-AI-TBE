import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "I recently completed the 21-day learning module, and I must say, it exceeded my expectations! The course materials were detailed and easy to follow, and the self-practice labs allowed me to gain hands-on experience at my own pace. The Red Hat Linux High-Availability Cluster Lab was particularly impressive—it gave me the confidence to handle real-world scenarios.",
    author: "Abhinav R.",
    role: "Los Angeles, CA",
    rating: 5,
    company: "Tech Solutions Inc"
  },
  {
    quote: "The training was exceptionally well-organized. I loved how every concept came with a real-world example. The WebSSH-based remote lab access made it easy for me to practice from anywhere in the world—even during my travel.",
    author: "Nandini M.",
    role: "Toronto, Canada",
    rating: 5,
    company: "Global IT Networks"
  },
  {
    quote: "As someone shifting my career into Linux and Cloud, ORN-AI gave me exactly what I needed. The CV writing support and mock interviews helped me secure my first job abroad!.",
    author: "Rahul S",
    role: "Bangalore, India",
    rating: 5,
    company: "SysCloud Solutions"
  },
  {
    quote: "The hands- Red Hat cluster lab was the best part. I could recreate failures, test fencing, and understand HA concepts deeply. No other platform has given me such realistic exposure.",
    author: "Kimberly J.",
    role: "Melbourne, Australia",
    rating: 5,
    company: "AeroTech Digital"
  },
  {
    quote: "Very clean explanation style and detailed guidance! The instructors were always available and answered every doubt with clarity. The real-time troubleshooting sessions were a game changer.",
    author: "Lisa Anderson",
    role: "VP Marketing",
    rating: 5,
    company: "RetailCo"
  },
  {
    quote: "The best marketing agency we've ever worked with. Professional, creative, and most importantly - they get results. Their data-driven approach has transformed our business.",
    author: "James Wilson",
    role: "Director",
    rating: 5,
    company: "MediaGroup"
  },
  {
    quote: "Outstanding platform for continuous learning. The hands-on labs and real-world scenarios have significantly improved my technical skills. I feel much more confident in my abilities now.",
    author: "Priya Sharma",
    role: "DevOps Engineer",
    rating: 5,
    company: "CloudTech"
  },
  {
    quote: "The customer support is phenomenal. Every question was answered promptly and the team went above and beyond to ensure our success. Highly recommend to anyone serious about growth.",
    author: "Robert Chang",
    role: "Product Manager",
    rating: 5,
    company: "InnovateCorp"
  }
];

function QuoteIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g>
        <path d="M6 19c.4-3.7 1.88-7.03 6-9V7a4 4 0 1 0-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M17 19c.4-3.7 1.88-7.03 6-9V7a4 4 0 1 0-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase">
           Real Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mt-4 mb-4">
            What Our  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Learners Say</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Honest experiences from students who transformed their careers with ORN-AI.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={handlePrev}
              className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-300 border border-gray-700 hover:border-purple-500"
              aria-label="Previous testimonials"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-300 border border-gray-700 hover:border-purple-500"
              aria-label="Next testimonials"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentTestimonials.map((t, i) => (
                  <div
                    key={`${currentIndex}-${i}`}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col"
                  >
                    <div className="mb-4">
                      <QuoteIcon />
                    </div>
                    <div className="flex mb-4">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <span key={idx} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <blockquote className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
                      "{t.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {t.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{t.author}</div>
                        <div className="text-gray-400 text-sm">
                          {t.role} {t.company && `at ${t.company}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-purple-500 w-8' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;