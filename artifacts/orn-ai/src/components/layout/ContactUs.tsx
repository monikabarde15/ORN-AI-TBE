import React, { useState } from "react";
import "../../components/layout/ContactUs.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryList from "country-list-with-dial-code-and-flag";

const countryCodes = countryList.getAll().map((c) => ({
  dialCode: c.dialCode,
  name: c.name,
  code: c.countryCode,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  // ⭐ Updated Final Working Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const response = await fetch("https://formspree.io/f/xjknejey", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    setLoading(false);

    if (response.ok) {
      toast.success("Message Sent Successfully!");
      e.target.reset();
    } else {
      toast.error("Error! Something went wrong.");
    }
  };

  return (
    <section className="contactus-section max-w-[] mx-auto" id="contact">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER */}
      <motion.div
        className="contactus-header"
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.6 }}
        variants={fadeUp}
      >
        <span className="contactus-sub">GET IN TOUCH</span>
        <h2 className="contactus-title">
          Let's Build Your <span className="gradient-text">Career Together</span>
        </h2>
        <p className="contactus-desc">
          We're here to guide you on your learning journey. Reach out to us for course details,
          career support, or any assistance you need.
        </p>
      </motion.div>

      <div className="contactus-grid max-w-7xl mx-auto">

        {/* LEFT FORM */}
        <motion.form
          className="contactus-form"
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={fadeUp}
        >
          {/* FIRST + LAST NAME */}
          <div className="contact-row">
            <div className="contact-field">
              <label>First Name</label>
              <input type="text" name="first_name" required />
            </div>

            <div className="contact-field">
              <label>Last Name</label>
              <input type="text" name="last_name" required />
            </div>
          </div>

          {/* EMAIL */}
          <div className="contact-field">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>

          {/* PHONE */}
          <div className="contact-field">
            <label>Phone</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                name="country_code"
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#4845a5ff",
                  width: "150px",
                }}
              >
                {countryCodes.map((c, i) => (
                  <option key={i} value={c.dialCode}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input type="text" name="phone" required style={{ flex: 1 }} />
            </div>
          </div>

          {/* MESSAGE */}
          <div className="contact-field">
            <label>Message</label>
            <textarea rows={3} name="message" required></textarea>
          </div>

          {/* SUBMIT */}
          <button className="contactus-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message →"}
          </button>
        </motion.form>

        {/* RIGHT SECTION */}
        <motion.div
          className="contactus-info"
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
          variants={fadeUp}
        >
          {/* Email */}
          <div className="contactus-info-card">
            <div className="info-icon-wrapper email-icon">✉️</div>
            <div>
              <div className="contactus-info-label">Email</div>
              <div className="contactus-info-text">connect@orn-ai.co.uk</div>
            </div>
          </div>

          {/* Phone */}
          <div className="contactus-info-card">
            <div className="info-icon-wrapper phone-icon">📞</div>
            <div>
              <div className="contactus-info-label">Phone</div>
              <div className="contactus-info-text">+91 9059366967</div>
            </div>
          </div>

          {/* Address */}
          <div className="contactus-info-card">
            <div className="info-icon-wrapper location-icon">📍</div>
            <div>
              <div className="contactus-info-label">Office</div>
              <div className="contactus-info-text">
                71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ
              </div>
            </div>
          </div>

          {/* Signup */}
          <div className="ready-card">
            <h3 className="ready-card-title">Signup</h3>
            <p className="ready-card-text">
              Start your learning journey with ORN-AI and access personalized career support.
            </p>
            <a href="/auth/boxed-signup">
              <button className="ready-card-btn">Get Started Now</button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
