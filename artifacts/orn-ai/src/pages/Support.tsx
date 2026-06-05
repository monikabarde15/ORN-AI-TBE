import React from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Mail,
  MessageCircle,
  Send,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";

const Support: React.FC = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <>
    <Shell>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-center mb-16"
            >
              <div className="inline-block mb-4">
                <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                  Support Center
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  ORN-AI Support
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Here you’ll find answers to common questions and direct support
                options, all designed to help you get the most out of ORN-AI.
              </p>
            </motion.div>

            {/* Intro Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="relative mb-16"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>

              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Using ORN-AI
                    </h2>
                    <p className="text-purple-400 font-semibold">
                      Learn by doing — not by watching
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    ORN-AI is a practical, hands-on learning platform designed
                    for Linux, Red Hat technologies, and IT professionals. We focus
                    on providing labs, real infrastructure, and guided tasks — with
                    zero dependency on long videos.
                  </p>

                  <p className="text-gray-300">
                    Our platform features:
                  </p>

                  <ul className="list-disc ml-6 text-gray-400 space-y-2">
                    <li>
                      A strict{" "}
                      <span className="text-purple-300 font-semibold">
                        Learn by Doing
                      </span>{" "}
                      approach with hands-on labs.
                    </li>
                    <li>Real online lab environments directly in your browser.</li>
                    <li>
                      Practical, step-by-step tasks with real server setups.
                    </li>
                    <li>
                      Clustering, Docker, Kubernetes, Terraform and more — updated
                      continuously.
                    </li>
                    <li>
                      AI-powered assistance to help you solve doubts quickly.
                    </li>
                  </ul>

                  <p>
                    If you need help, scroll below for support options or reach out
                    to our support team anytime.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Support Options */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
            >
              {/* Feedback */}
              <motion.div
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Post Feedback
                    </h3>
                    <p className="text-gray-400">
                      Share your suggestions or issues in our community forums.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Forum */}
              <motion.div
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Join Our Forum
                    </h3>
                    <p className="text-gray-400">
                      Ask questions or help others — learn with the community.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Send an Email
                    </h3>
                    <p className="text-gray-400">
                      Contact our support team at{" "}
                      <span className="text-green-300 font-semibold">
                       chandra@orn-ai.co.uk
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Ask a question */}
              <motion.div
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Ask a Question
                    </h3>
                    <p className="text-gray-400">
                      Our support team answers quickly — ask anything.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Start CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-violet-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-10">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Quick Start Guide
                </h3>
                <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                  Begin your learning journey by understanding how our lab system
                  works from the ground up.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                >
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
    </Shell>
    </>
    
  );
};

export default Support;
