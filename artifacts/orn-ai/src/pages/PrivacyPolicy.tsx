import React from "react";
import { motion } from "framer-motion";
import { Shell } from "@/components/layout/Shell";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
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
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-700">
            ORN-AI ("we/us") is committed to protecting your personal data. This Policy
            explains what we collect, how we use it, and your rights.
          </p>
        </section>

        {/* WHAT DATA WE COLLECT */}
        <section>
          <h2 className="text-2xl font-bold mb-4">2. What Data We Collect</h2>
          <p className="text-gray-700">We may collect:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 mt-3">
            <li><b>Identity & Contact Data:</b> Name, email, phone, address</li>
            <li><b>Technical Data:</b> IP address, device details, browser data, cookies</li>
            <li><b>Education & Usage Data:</b> Course progress, assignments, assessments</li>
            <li><b>Financial Data:</b> Payment details processed by third-party gateways</li>
            <li><b>Marketing Data:</b> Communication preferences, interests</li>
          </ul>
          <p className="text-gray-700 mt-2">
            We do <b>not</b> collect sensitive personal data unless required by law and with consent.
          </p>
        </section>

        {/* PURPOSE AND SCOPE */}
        <section>
          <h2 className="text-2xl font-bold mb-4">3. Purpose and Scope</h2>
          <p className="text-gray-700">
            This policy outlines how ORN-AI collects, uses, and shares your information through our
            digital platforms, including our website and mobile applications. It also covers data
            security, transfers, and your rights related to personal data.
          </p>
        </section>

        {/* TYPES OF PERSONAL DATA */}
        <section>
          <h2 className="text-2xl font-bold mb-4">4. Types of Personal Data Collected</h2>
          <p className="text-gray-700">We may collect the following categories of data:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 mt-3">
            <li><b>A. Personal Identification Data:</b> Name, job title, signature, photos</li>
            <li><b>B. Identification Data:</b> Aadhar, PAN, tax IDs</li>
            <li><b>C. Financial Data:</b> Bank info, salary details (excluding payment gateway data)</li>
            <li><b>D. Personal Characteristics:</b> Age, gender, DOB, nationality</li>
            <li><b>E. Contact Data:</b> Postal address, email, phone</li>
            <li><b>F. Education Data:</b> Qualifications, work experience</li>
            <li><b>G. Electronic Data:</b> IP, device, browser, location, login details</li>
            <li><b>H. Inquiry Data:</b> Forms, calls, support interactions</li>
            <li><b>I. User-Generated Data:</b> Assignments, assessments, feedback</li>
            <li><b>J. Marketing Data:</b> Preferences & interests</li>
            <li><b>K. Behavioral Data:</b> Activity-based inferred data</li>
          </ul>
          <p className="text-gray-700 mt-2"><b>Note:</b> Payment information is handled only by secure third-party gateways.</p>
        </section>

        {/* SPECIAL CATEGORIES */}
        <section>
          <h2 className="text-2xl font-bold mb-4">5. Special Categories of Personal Data</h2>
          <p className="text-gray-700">
            We do not currently process sensitive data such as religion, sexual orientation,
            political views, biometrics, or health details.
          </p>
        </section>

        {/* SOURCES */}
        <section>
          <h2 className="text-2xl font-bold mb-4">6. Sources of Data Collection</h2>
          <p className="text-gray-700">We collect data from:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 mt-3">
            <li>Registrations (webinars, courses, workshops)</li>
            <li>Customer support interactions</li>
            <li>Website and app usage</li>
            <li>Third-party partners and analytics providers</li>
          </ul>
        </section>

        {/* COOKIES */}
        <section>
          <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
          <p className="text-gray-700">
            We use cookies to improve user experience, analyze performance, and personalize
            content. Third-party cookies (Google, Facebook, etc.) may also track your activity.
          </p>
        </section>

        {/* ANALYTICS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">8. Data Analytics</h2>
          <p className="text-gray-700">
            We use tools like Google Analytics and Facebook Custom Audiences to understand usage
            patterns and improve marketing effectiveness.
          </p>
        </section>

        {/* AGGREGATED DATA */}
        <section>
          <h2 className="text-2xl font-bold mb-4">9. Aggregated Data</h2>
          <p className="text-gray-700">
            Aggregated data is anonymized and cannot identify individuals. We use it for planning,
            analytics, and improving services.
          </p>
        </section>

        {/* DATA PROTECTION */}
        <section>
          <h2 className="text-2xl font-bold mb-4">10. Data Protection Principles</h2>
          <p className="text-gray-700">
            ORN-AI adheres to fairness, transparency, purpose limitation, data minimization,
            accuracy, storage limitation, and confidentiality principles.
          </p>
        </section>

        {/* LEGAL BASIS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">11. Legal Basis for Processing Your Data</h2>
          <p className="text-gray-700">
            We process your data based on contractual necessity, legal obligations, legitimate
            interests, vital interests, public interest, or consent.
          </p>
        </section>

        {/* CONSENT */}
        <section>
          <h2 className="text-2xl font-bold mb-4">12. Consent</h2>
          <p className="text-gray-700">
            By using our platform, you provide consent for data collection. You may withdraw
            consent, but it may affect service availability.
          </p>
        </section>

        {/* PURPOSE */}
        <section>
          <h2 className="text-2xl font-bold mb-4">13. Purpose of Collecting Personal Data</h2>
          <p className="text-gray-700">
            We collect personal data to deliver services, improve user experience, process
            payments, ensure security, and comply with legal requirements.
          </p>
        </section>
      </motion.div>

    </div>
    </Shell>
  );
}
