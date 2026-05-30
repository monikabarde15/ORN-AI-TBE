import { motion } from "framer-motion";
import heroTeam from "../../../public/orn-ai//assets/home/hero.jpeg"
export function HeroSection() {


  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-15 pt-0 pb-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ================= Left Content ================= */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            className="space-y-8 text-black"
          >
           

            <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            className="space-y-8 text-black"
          >

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            >
             ORN-AI bridges Europe’s talent gap with {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8358ff] to-[#39c6fa]">
                 deployment-ready workforce capability.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-xl text-[#bfc0c4] max-w-xl"
            >
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
            <a href="/register">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgb(23 13 62)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-8 py-3 bg-[#2e254d]  text-white font-bold rounded-xl shadow-lg transition-all group text-lg"
              >
                Signup Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform text-xl">
                  →
                </span>
              </motion.button>
            </a>
            
            </motion.div>

            
          </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-xl text-[#bfc0c4] max-w-xl"
            >
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
            
            </motion.div>

            
          </motion.div>

             {/* ================= Right Image & Floating Cards ================= */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative"
          >
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 150 }}
              src={heroTeam}
              alt="Creative marketing team collaborating"
              className="rounded-2xl shadow-2xl shadow-primary/20 w-full"
            />

            {/* Floating Stats Cards */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="absolute top-8 -left-4 p-4 bg-[#2e254d] bg-opacity-90 backdrop-blur-lg border border-primary/20 rounded-lg shadow-xl"
            >
            
              {/*<div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8358ff] to-[#39c6fa]">
                5x ROI
              </div>*/}
              <div className="text-sm text-white"><a href="#pricing"> <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-white text-sm font-semibold">
                Talent Infrastructure
              </span></a></div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-8 -right-4 p-4 bg-[#2e254d] bg-opacity-90 backdrop-blur-lg border border-secondary/20 rounded-lg shadow-xl"
            >
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-white text-lg">
                    ★
                  </span>
                ))}
              </div>
              <div className="text-sm text-white">Rating</div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}