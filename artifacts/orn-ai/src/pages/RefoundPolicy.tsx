import React from "react";
import { motion } from "framer-motion";
import { Shell } from "@/components/layout/Shell";

export default function RefoundPolicy() {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Shell>
    <div className="bg-white text-black min-h-screen">

      {/* Banner */}
      <div className="relative w-full h-64 bg-blue-900">
        <img
          src="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
          alt="Privacy Policy Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Refund Policy</h1>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="max-w-5xl mx-auto py-16 px-6 space-y-12"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {/* INTRODUCTION */}
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Refund Eligibility</h2>
          <p className="text-gray-700">
          ORN-AI offers a 100% refund if the refund request is raised within 14 days of the first purchase date.
No refunds are provided after the 14-day refund window, regardless of usage, dissatisfaction, or payment method.

          </p>
        </section>

        {/* WHAT DATA WE COLLECT */}
        <section>
          <h2 className="text-2xl font-bold mb-4">2. Refund Method</h2>
          {/* <p className="text-gray-700">We may collect:</p> */}
          <ul className="list-disc ml-6 text-gray-700 space-y-2 mt-3">
            <li>All refunds are issued only to a bank account via NEFT/IMPS/RTGS</li>
            <li>You may be asked to provide verification documents (e.g., cancelled cheque, ID proof).</li>
            <li>Refunds are processed within 30 days after receiving all required information.</li>
            <li>If payment was made through a loan provider, loan cancellation timelines depend on the third-party lender, not ORN-AI.</li>
          </ul>
        </section>

        {/* PURPOSE AND SCOPE */}
        <section>
          <h2 className="text-2xl font-bold mb-4">3. How to Request a Refund</h2>
          <p className="text-gray-700">
           <b>Step 1:</b> Email [connect@orn-ai.com](mailto:connect@orn-ai.com) from your registered email ID with your registration details.
          </p>
          <p>
            <b>Step 2:</b>  Our team will verify whether you are within the refund window (1 business day).
          </p>
          <p>
            <b>Step 3:</b> If eligible, we will share a refund form and contact you within 2 business days to understand your concern.
          </p>
          <p>
            <b>Step 4:</b> If you still wish to proceed, the finance team will initiate the refund. Refunds take 7–9 business days to reflect in your account (bank/lender delays may occur).
          </p>
        </section>

        {/* TYPES OF PERSONAL DATA */}
        <section>
          <h2 className="text-2xl font-bold mb-4">4. Data & Privacy Note</h2>
          <p className="text-gray-700">Browsing the website does not require personal information. Providing personal details is optional but may be required for Program enrollment or refund processing.</p>
        </section>

      
      </motion.div>

    </div>
    </Shell>
  );
}
