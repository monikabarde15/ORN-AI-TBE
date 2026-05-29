import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              ORN-AI bridges Europe's talent gap with
              <span className="block bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                deployment-ready workforce capability.
              </span>
            </h1>

            <button className="mt-10 px-8 py-4 rounded-2xl bg-[#22114f] text-white font-semibold">
              Signup Now →
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src="https://vidya-merege.vercel.app/assets/home/hero.jpeg"
              className="rounded-[32px] shadow-2xl"
            />

            <div className="absolute top-5 left-5 bg-[#2b215e] text-white px-5 py-3 rounded-xl">
              Talent Infrastructure
            </div>

            <div className="absolute bottom-5 right-5 bg-[#2b215e] text-white px-5 py-3 rounded-xl">
              ★★★★★ Rating
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}