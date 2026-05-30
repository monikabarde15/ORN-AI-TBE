import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
const stories = [
  {
    category: "Our Mission",
    labelColor: "text-purple-400",
    cardBg: "bg-gradient-to-br from-[#2B234A] to-[#232942]",
    title: "Workforce Readiness",
    description: "Prepare deployment-ready talent.",

    title1: "Industry Alignment",
    description1: "Align talent with real workforce needs.",

    title2: "Reliable Deployment",
    description2: "Build trusted talent pipelines across Europe.",

    stat: "450%",
    statLabel: "ROI Increase",
    gradient: "from-secondary/20 to-cyan-500/20",
  },
  {
    category: "Our Vision",
    labelColor: "text-purple-400",
    cardBg: "bg-gradient-to-br from-[#241C38] to-[#18233B]",
    title: "Verified Talent",
    description: "Build a trusted layer for verified and job-ready talent.",

    title1: " Continuous Conditioning",
    description1: "Enable continuous upskilling, validation, and workforce readiness.",

    title2: "Workforce Reliability",
    description2: "Create dependable talent pipelines aligned to industry needs.",

    stat: "2.3M",
    statLabel: "New Followers",
    gradient: "from-secondary/20 to-cyan-500/20",
  },
  
];
const TalentInfrastructure = () => (
  <section className="bg-[#0E0A1F] text-white py-24 px-2 md:px-6" id="Portfilo" >
    <div className=" mb-12">
      {/* <h5 className="text-sm font-semibold text-purple-400 tracking-wider mb-2">PORTFOLIO</h5> */}
      <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-4">
        ORN-AI is building that
        {" "}
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Talent Infrastructure.
        </span>
      </h2>
      <p className="text-gray-400 max-w-7xl mx-auto text-justify">
        Through role-focused evaluation, talent conditioning, practical readiness, and professional preparation, ORN-AI creates stronger resource pipelines for organisations that need resources who are aligned to real role requirements, prepared for client expectations, and ready to contribute with confidence.
     </p>
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {stories.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          whileHover={{ scale: 1.03, y: -5 }}
          className={`relative w-full rounded-2xl p-8 min-h-[220px] ${item.cardBg} shadow-lg flex flex-col justify-between border-2 border-transparent transition-all duration-300 group`}
        >
          {/* Content */}
          <div>
            <div className={`text-4xl font-bold mb-2 ${item.labelColor}`}>
              {item.category}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3> {/* static color */}
            <p className="text-gray-300 mb-6 text-sm">{item.description}</p>

            <h3 className="text-xl font-bold mb-2">{item.title1}</h3> {/* static color */}
            <p className="text-gray-300 mb-6 text-sm">{item.description1}</p>


            <h3 className="text-xl font-bold mb-2">{item.title2}</h3> {/* static color */}
            <p className="text-gray-300 mb-6 text-sm">{item.description2}</p>

          </div>

          {/* <div>
    <div className={`text-3xl font-extrabold ${item.gradient}`}>{item.stat}</div>
    <div className="text-sm text-gray-400 font-medium">{item.statLabel}</div>
  </div> */}

          <button className="absolute top-7 right-7 bg-[#262143] rounded-full p-1.5 hover:bg-[#31286A] transition-colors">
            <ArrowUpRight className="w-4 h-4 text-gray-300" />
          </button>

          {/* Only border changes on hover */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-transparent group-hover:border-purple-400 transition-all duration-300" />
        </motion.div>


      ))}
    </div>

    {/* <div className="flex justify-center mt-14">
      <button className="border border-purple-400 rounded-full px-8 py-3 text-purple-400 font-semibold text-base hover:bg-purple-400 hover:text-white transition-colors">
        View All Case Studies
      </button>
    </div> */}
  </section>
)

export default TalentInfrastructure;