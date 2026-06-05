import React from "react";

import { motion } from "framer-motion";
import { Shell } from "@/components/layout/Shell";

export default function TermsCondition() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Use
</h1>
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
          <h2 className="text-2xl font-bold mb-4">Effective Date</h2>
          <p className="text-gray-700">
These Terms of Use (“Terms”) govern your access to and use of the website, mobile applications, learning platforms, and services offered by ORN-AI (“Company,” “we,” “us,” or “our”).

          </p>
          <p className="text-gray-700">By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must discontinue use immediately.
</p>
        </section>

        {/* WHAT DATA WE COLLECT */}
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Use of the Platform</h2>
          <p className="text-gray-700">The Platform includes our website, mobile applications, online programs, digital content, and all associated services (“Platform”).
You are responsible for ensuring that your use of the Platform complies with all applicable laws. Access from jurisdictions where the Platform is illegal is prohibited.</p>

          
        </section>

        {/* PURPOSE AND SCOPE */}
        <section>
          <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
          <p className="text-gray-700">
To access Programs, you must create a verified User Account using OTP or email authentication.
          </p>
          <p>
You agree to:
          </p>
          <p>
 Provide accurate and complete information
          </p>
          <p>
 Maintain one account only
          </p>
          <p>
            Keep your login credentials confidential
          </p>
          <p>
              Sharing account access is strictly prohibited. ORN-AI may suspend or terminate accounts with inaccurate information or unauthorized use.
          </p>
        </section>

        {/* TYPES OF PERSONAL DATA */}
        <section>
          <h2 className="text-2xl font-bold mb-4">3. Program Access, Payments & Refunds</h2>
          <p className="text-gray-700">Program access is granted upon full or partial fee payment. Enrollment is non-transferable.
Payments must be made through approved payment methods. ORN-AI does not store restricted financial data and is not responsible for third-party gateway issues.
Refunds, cancellations, and free trial eligibility are governed solely by Program-specific policies.
</p><p className="text-gray-700">Failure to complete payment may result in access revocation.
</p>
        </section>

         <section>
          <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
          <p className="text-gray-700">All content on the Platform—including courses, videos, assignments, software, graphics, and trademarks (“ORN-AI Content”)—is owned by ORN-AI or its licensors and is protected by applicable IP laws.</p>
          <p className="text-gray-700" >You are granted a limited, personal, non-transferable, revocable license for non-commercial use only.</p>
          <p className="text-gray-700" >You may not copy, reproduce, distribute, publish, modify, or commercially exploit any ORN-AI Content without written permission.</p>
          <p className="text-gray-700" >Unauthorized use of third-party IP is strictly prohibited.</p>
        </section>

         <section>
          <h2 className="text-2xl font-bold mb-4">5. User Conduct</h2>
          <p className="text-gray-700">You agree not to:</p>
          <p className="text-gray-700" >Harass users or disrupt learning environments.</p>
          <p className="text-gray-700" >Cheat or share exam materials.</p>
          <p className="text-gray-700" >Upload unlawful, infringing, harmful, misleading, or defamatory content.</p>
          <p className="text-gray-700" >Use bots, scrapers, or automated tools</p>
          <p className="text-gray-700" >Engage in phishing, fraud, or impersonation</p>
          <p className="text-gray-700" >Violation may result in suspension or permanent removal from the Platform.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. User Content</h2>
          <p className="text-gray-700">By submitting content (“User Content”), you grant ORN-AI a worldwide, perpetual, royalty-free license to use, modify, distribute, and display such content for operational and commercial purposes.
          </p>
          <p className="text-gray-700" >You represent that you have all necessary rights to submit such content.</p>
          <p className="text-gray-700" >ORN-AI may remove User Content at any time.</p>
        </section>

         <section>
          <h2 className="text-2xl font-bold mb-4">7. Platform Security</h2>
          <p className="text-gray-700">You must not:
          </p>
          <p className="text-gray-700" >Access systems without authorization.</p>
          <p className="text-gray-700" >Attempt to probe, scan, or test vulnerabilities.</p>
          <p className="text-gray-700" >Interfere with the Platform’s functioning.</p>
          <p className="text-gray-700" >Introduce viruses, malware, or harmful code.</p>
          <p className="text-gray-700" >  Security violations may result in legal action.</p>
        </section>

         <section>
          <h2 className="text-2xl font-bold mb-4">8. Disclaimer</h2>
          <p className="text-gray-700">The Platform and all ORN-AI Content are provided “as is” without warranties of any kind.
We do not guarantee uninterrupted access, accuracy, error-free service, or specific results.
Use of the Platform and downloads are at your own risk.

          </p>
          <p className="text-gray-700" >Testimonials represent individual experiences and are not guarantees.</p>
          
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-700">ORN-AI shall not be liable for indirect, incidental, consequential, or special damages.
Total liability will not exceed ₹1,000 or the total Program fees paid by you, whichever is higher.


          </p>
          
        </section>

         <section>
          <h2 className="text-2xl font-bold mb-4">10. Third-Party Links</h2>
          <p className="text-gray-700">
          Linked third-party websites are not under ORN-AI’s control.
          We are not responsible for their content, policies, advertisements, or transactions.
          Accessing such sites is at your own risk.
          </p>
          
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
          <p className="text-gray-700">
          You agree to indemnify and hold ORN-AI harmless from any claims arising out of:
          </p>
          <p className="text-gray-700">
            Your use or misuse of the Platform
          </p>
          <p className="text-gray-700" >
             Your violation of these Terms or any applicable law
          </p>
          <p className="text-gray-700" >
              Your User Content
          </p>
          
        </section>

         <section>
          <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
          <p className="text-gray-700">
ORN-AI may suspend or terminate your account or access at any time for violations of these Terms or applicable laws.
ORN-AI may retain certain user information as permitted by law.
          </p>
          
        </section>

         <section>
          <h2 className="text-2xl font-bold mb-4">13. Governing Law & Dispute Resolution</h2>
          <p className="text-gray-700">
            These Terms are governed by the laws of India.
          Courts in Hyderabad, Telangana shall have exclusive jurisdiction.
        Disputes shall be resolved first through negotiation, then arbitration under the Arbitration and Conciliation Act, 1956.

          </p>
          
        </section>

                 <section>
          <h2 className="text-2xl font-bold mb-4">14. Miscellaneous</h2>
          <p className="text-gray-700">
             Users under 18 must use the Platform under parental supervision.
          </p>
          <p className="text-gray-700">
              ORN-AI may assign its rights; users may not without consent.
          </p>
          <p className="text-gray-700">
            If any part of these Terms is invalid, the remainder stays in effect.
          </p>
          <p className="text-gray-700">
            ORN-AI is not liable for delays caused by force-majeure events.
          </p>
          <p className="text-gray-700">
             Terms may be updated at any time; continued use constitutes acceptance.
          </p>
          
        </section>


      
      </motion.div>

    </div>
    </Shell>
  );
}
