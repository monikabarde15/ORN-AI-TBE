// components/layout/footer/PublicFooter.tsx

import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import logoimg from "../../../../public/logo.jpg";

export default function PublicFooter() {
  return (
    <footer className="bg-[#17122A] text-white py-12 px-6 md:px-16 lg:px-24">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-700 pb-10 text-center md:text-left">
        {/* Logo + Description */}
        <div>
          <div className="flex justify-center md:justify-start mb-4">
            <div className="bg-white p-2 rounded-xl inline-flex items-center justify-center shadow-md">
              <img
                src={logoimg}
                alt="ORN-AI"
                width={180}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto md:mx-0">
            An ISO-certified training partner committed to your skills, growth,
            and career success.
          </p>

          <div className="flex justify-center md:justify-start gap-3">
            {[
              {
                Icon: FaInstagram,
                link: "https://www.instagram.com/ornai_official/",
              },
              {
                Icon: FaLinkedin,
                link: "https://www.linkedin.com/company/orn-ai/",
              },
              {
                Icon: FaYoutube,
                link: "https://www.youtube.com/@ORN-AILearning",
              },
            ].map(({ Icon, link }, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2B234B] p-2.5 rounded-lg hover:bg-[#6E56CF] transition-colors"
              >
                <Icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-white">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="/" className="hover:text-white">
                Platform
              </a>
            </li>

            <li>
              <a href="/about-us" className="hover:text-white">
                About Us
              </a>
            </li>

            <li>
              <a href="/contact-us" className="hover:text-white">
                Contact Us
              </a>
            </li>

            <li>
              <a href="/blogs" className="hover:text-white">
                Blogs
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4 text-white">
            Resources
          </h3>

          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="/cyber-security" className="hover:text-white">
                Cyber Security
              </a>
            </li>

            <li>
              <a href="/data-science-ai" className="hover:text-white">
                Data Science & AI
              </a>
            </li>

            <li>
              <a href="/advanced-programs" className="hover:text-white">
                Advanced Programs
              </a>
            </li>

            <li>
              <a href="/business-analytics" className="hover:text-white">
                Business Analytics
              </a>
            </li>

            <li>
              <a href="/technology-programs" className="hover:text-white">
                Technology Programs
              </a>
            </li>

            <li>
              <a href="/science-programs" className="hover:text-white">
                Science Programs
              </a>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-4 text-white">
            Help
          </h3>

          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>

            <li>
              <a
                href="/terms-and-conditions"
                className="hover:text-white"
              >
                Terms and Conditions
              </a>
            </li>

            <li>
              <a href="/support" className="hover:text-white">
                Support
              </a>
            </li>

            <li>
              <a href="/contact-us" className="hover:text-white">
                Contact Us
              </a>
            </li>

            <li>
              <a href="/refund-policy" className="hover:text-white">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-6 text-center">
        <p>© 2025 ORN-AI. All rights reserved.</p>

        <p className="mt-3 md:mt-0">
          Design By{" "}
          <span className="text-[#A7004C]">
            <a
              href="https://cybite.in/"
              target="_blank"
              rel="noreferrer"
            >
              Cybite
            </a>
          </span>{" "}
          team
        </p>
      </div>
    </footer>
  );
}