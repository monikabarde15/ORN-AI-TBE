import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What makes ORN-AI's architecture unique?",
    answer:
      "ORN-AI utilizes a proprietary High-Tech Minimalist neural framework. Unlike traditional models, our architecture relies on transparent layering of decision pathways, ensuring absolute clarity in enterprise AI operations. This fluid-fixed hybrid grid processing allows for seamless scaling from mobile to global infrastructure.",
  },
  {
    id: 2,
    question: "How do you ensure data security?",
    answer:
      "Data security is embedded at Level 1 of our foundation. We employ deep encryption protocols and isolate critical datasets within secured enclaves. Every transaction is verifiable through our transparent edge computing nodes.",
  },
  {
    id: 3,
    question: "Can ORN-AI integrate with legacy systems?",
    answer:
      "Yes. Our APIs act as a semantic shell, adapting to existing enterprise resource planners and legacy databases without structural disruption. We maintain casing integrity of your legacy data while applying modern inference engines to extract new value.",
  },
  {
    id: 4,
    question: "What is the expected ROI implementation timeline?",
    answer:
      "Standard implementations realize operational ROI within 90 days. The high-contrast structural foundation of our setup process minimizes downtime, while the intuitive UI accelerates team adoption, rapidly translating technical superiority into measurable business outcomes.",
  },
  {
    id: 5,
    question: "Do you offer dedicated enterprise support?",
    answer:
      "Enterprise partners receive 24/7 access to our engineering corps. Support is delivered through an exclusive portal featuring \"The Pulse\"—our live AI diagnostic tool that anticipates system needs before human intervention is required, ensuring calm efficiency.",
  },
  {
    id: 6,
    question: "Who can benefit from ORN-AI's learning programs?",
    answer:
      "Students, working professionals, and enterprise organizations can all benefit from our role-aligned curriculums, practical hands-on labs, AI mentorship, and specialized career placement services.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-white flex flex-col lg:flex-row min-h-[750px] selection:bg-[#17122A] selection:text-white border-t border-gray-100">
      {/* Left Column: Anchor (Clean White Background) */}
      <div className="w-full lg:w-[40%] bg-white text-[#17122A] p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 flex flex-col justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="max-w-md mx-auto lg:mx-0 lg:ml-auto relative z-10"
        >
          <span className="font-mono text-xs text-[#6E56CF] uppercase tracking-widest block mb-4 sm:mb-6 font-bold">
            Support &amp; Guidance
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#17122A] leading-[1.15] tracking-tight mb-6">
            Frequently <br className="hidden sm:block" />
            Asked <br className="hidden sm:block" />
            Questions
          </h2>

          <p className="text-base sm:text-lg text-[#43474e] leading-relaxed font-normal">
            Explore our comprehensive guide to ORN-AI's enterprise capabilities, integration protocols, and data security standards.
          </p>
        </motion.div>
      </div>

      {/* Right Column: Accordion (Clean White Background) */}
      <div className="w-full lg:w-[60%] bg-white p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
          className="max-w-3xl w-full mx-auto lg:mx-0 divide-y divide-gray-200 relative z-10"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.id} className="group py-6 sm:py-7 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-start text-left focus:outline-none transition-colors"
                >
                  <h3
                    className={`text-xl sm:text-2xl font-bold pr-6 leading-snug transition-colors duration-200 ${
                      isOpen ? "text-[#17122A]" : "text-[#17122A]/90 hover:text-[#17122A]"
                    }`}
                  >
                    {faq.question}
                  </h3>

                  <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#17122A]/5 group-hover:bg-[#17122A] text-[#17122A] group-hover:text-white transition-all duration-300 mt-0.5">
                    {isOpen ? (
                      <Minus className="w-5 h-5 transition-transform duration-300" />
                    ) : (
                      <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-2 pr-6 md:pr-12 text-[#43474e] text-base sm:text-[17px] leading-relaxed font-normal">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default FAQ;
