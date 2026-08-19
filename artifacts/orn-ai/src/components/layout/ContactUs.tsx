import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryList from "country-list-with-dial-code-and-flag";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const countryCodes = countryList.getAll().map((c) => ({
  dialCode: c.dialCode,
  name: c.name,
  code: c.countryCode,
}));

export function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xjknejey", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      setLoading(false);

      if (response.ok) {
        toast.success("Message Sent Successfully!");
        form.reset();
      } else {
        toast.error("Error! Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error connecting to server. Please try again.");
    }
  };

  return (
    <section className="w-full bg-[#17122A] text-white py-16 md:py-24 px-6 md:px-12 lg:px-16 relative overflow-hidden selection:bg-[#6E56CF] selection:text-white" id="contact">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Subtle blueprint grid background overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="text-[#A48FFF] text-xs sm:text-sm font-medium tracking-wide block mb-3">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Let's Build Your Career Together
          </h2>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
            We're here to guide you on your learning journey. Reach out to us for course details, career support, or any assistance you need.
          </p>
        </motion.div>

        {/* 2-Column Main Grid (Left: Form, Right: Info Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left: Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-5"
          >
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  placeholder=""
                  className="w-full bg-white text-black h-12 px-4 rounded-xl border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E56CF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  placeholder=""
                  className="w-full bg-white text-black h-12 px-4 rounded-xl border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E56CF] transition-all"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-white text-black h-12 px-4 rounded-xl border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E56CF] transition-all text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Phone</label>
                <div className="flex items-center gap-2 w-full">
                  <div className="relative shrink-0 w-[110px] sm:w-[115px]">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      name="country_code"
                      className="w-full bg-white text-black text-xs sm:text-sm font-medium h-12 px-2.5 rounded-xl border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E56CF] cursor-pointer appearance-none pr-6 truncate"
                    >
                      {countryCodes.map((c, i) => (
                        <option key={i} value={c.dialCode}>
                          {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                    {/* Custom chevron indicator */}
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Phone number"
                    className="flex-1 min-w-0 w-full bg-white text-black h-12 px-4 rounded-xl border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E56CF] transition-all text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                placeholder=""
                className="w-full bg-white text-black p-4 rounded-2xl border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E56CF] transition-all resize-y min-h-[130px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-[#17122A] font-bold text-sm px-7 py-3 rounded-full hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2 w-fit disabled:opacity-50"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Right: 3 Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-4 sm:gap-5"
          >
            {/* Email Card */}
            <div className="bg-white text-black rounded-2xl p-6 shadow-md border border-white/10 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[#f0edf7] flex items-center justify-center text-[#17122A] shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-[#17122A]" />
              </div>
              <div>
                <span className="text-gray-500 text-xs sm:text-sm font-medium block">Email</span>
                <a
                  href="mailto:connect@orn-ai.co.uk"
                  className="text-[#17122A] text-base sm:text-lg font-bold tracking-tight hover:underline"
                >
                  connect@orn-ai.co.uk
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white text-black rounded-2xl p-6 shadow-md border border-white/10 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[#f0edf7] flex items-center justify-center text-[#17122A] shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-[#17122A]" />
              </div>
              <div>
                <span className="text-gray-500 text-xs sm:text-sm font-medium block">Phone</span>
                <a
                  href="tel:+919059366967"
                  className="text-[#17122A] text-base sm:text-lg font-bold tracking-tight hover:underline"
                >
                  +91 9059366967
                </a>
              </div>
            </div>

            {/* Office Location Card */}
            <div className="bg-white text-black rounded-2xl p-6 shadow-md border border-white/10 flex items-start gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-[#f0edf7] flex items-center justify-center text-[#17122A] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-[#17122A]" />
              </div>
              <div>
                <span className="text-gray-500 text-xs sm:text-sm font-medium block mb-1">Office</span>
                <p className="text-[#17122A] text-sm sm:text-base font-bold leading-snug tracking-tight">
                  71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default ContactUs;
