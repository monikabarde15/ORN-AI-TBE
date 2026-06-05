import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBanner from "./components/Banner";
import { useRoute, Link } from "wouter";
import { Shell } from "@/components/layout/Shell";

export default function BlogDetail() {
 const [, params] = useRoute("/blogs/:id");

const id = params?.id;

  const [blog, setBlog] = useState(null);

  // ✅ Static blog data array
  const blogsData = [
    {
      id: 1,
      title: "The Future of Learning: How ORN-AI Is Empowering Global Talent",
 excerpt: `
      <p>The global job market is evolving faster than ever, and traditional education systems are struggling to keep pace. Today’s learners need more than just degrees—they need real skills, real confidence, and real opportunities.</p>
      <p>At ORN-AI, we are redefining what modern skill development looks like.</p>

      <h2>Why Hands-On Learning Matters</h2>
      <p>Most online courses stop at theory. The result? Learners complete programs but still lack real-world competence. ORN-AI solves this through:</p>
      <ul>
        <li>Practical labs</li>
        <li>Real scenarios</li>
        <li>Case-based training</li>
        <li>Cross-technology exposure</li>
      </ul>
      <p>This approach helps candidates build capabilities that employers recognize instantly.</p>

      <h2>Bridging the Gap Between Learning & Earning</h2>
      <p>With personalized CV writing, interview preparation, and ethical placement pathways, ORN-AI transforms training into tangible career outcomes—especially for expats and underserved regions.</p>

      <h2>Education Without Borders</h2>
      <p>Our expansion into European markets ensures global readiness. Whether you're preparing for a cybersecurity role in Germany or a cloud job in the UAE, our programs adapt to your goals.</p>

      <p><strong>ORN-AI isn’t just a platform—it’s a pathway to your future.</strong></p>
    `,      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/1.svg",//"https://fastly.picsum.photos/id/1015/800/500.jpg?hmac=pSNYsY7XYU05VD89MUu0QDrVHgAu2yZaGSC4wzh7ld8",//"/assets/blog1.jpg",
    },
    {
      id: 2,
      title: "Why Ethical Placement Matters — And How ORN-AI Is Changing the Game",
excerpt: `
      <p>Fraudulent job channels, backdoor hiring, and unsafe employment practices have become dangerously common. Many candidates lose money, time, and even career credibility due to these traps.</p>
      <p>ORN-AI is built on the opposite philosophy: <em>ethics, transparency & long-term trust.</em></p>

      <h2>The Reality Many Students Face</h2>
      <ul>
        <li>Fake consultancies charge illegal fees</li>
        <li>Short-term roles with no contracts</li>
        <li>Hidden risks in international hiring</li>
        <li>No guidance after placement</li>
      </ul>
      <p>These issues ruin confidence and reduce employability.</p>

      <h2>ORN-AI’s Ethical Career Model</h2>
      <p>We offer:</p>
      <ul>
        <li><em>Merit-based job guarantees</em></li>
        <li><em>Zero backdoor or unethical pathways</em></li>
        <li><em>Transparent employer selection</em></li>
        <li><em>Post-placement mentoring</em></li>
      </ul>
      <p>Every candidate is supported with CV upgrades, mock interviews, and market-aligned training so they enter roles confidently and safely.</p>

      <h2>A Safer Way Forward</h2>
      <p>In a world full of misleading promises, ORN-AI stands strong as a student-first platform—ensuring your growth, dignity, and future remain protected.</p>
    `,      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/2.svg",//"https://fastly.picsum.photos/id/1015/800/500.jpg?hmac=pSNYsY7XYU05VD89MUu0QDrVHgAu2yZaGSC4wzh7ld8",//"/assets/blog2.jpg",
    },
    {
      id: 3,
      title: "The Power of Cross-Technology Training in 2025: Why You Need It",
excerpt: `
      <p>Today’s job roles no longer exist in silos. A Linux engineer must understand cloud. A cybersecurity analyst must know networking. A DevOps engineer must be comfortable with automation and containers.</p>
      <p>This is why <strong>cross-technology training isn’t optional—it’s essential.</strong></p>

      <h2>ORN-AI’s Multi-Domain Approach</h2>
      <p>Our programs cover a wide range of technologies, including:</p>
      <ul>
        <li>Linux & Red Hat</li>
        <li>Cyber Security</li>
        <li>Cloud Computing (AWS, Azure)</li>
        <li>Kubernetes & DevOps</li>
        <li>Business Management</li>
        <li>Soft Skills & Leadership</li>
      </ul>
      <p>This blended approach prepares learners for dynamic roles and global job markets.</p>

      <h2>Real-World Relevance</h2>
      <p>Every module is backed by:</p>
      <ul>
        <li>Lab practice</li>
        <li>Real scenarios</li>
        <li>Troubleshooting tasks</li>
        <li>Industry case studies</li>
      </ul>
      <p>Learners don’t just understand concepts—they apply them.</p>

      <h2>Career Growth Through Versatility</h2>
      <p>Cross-technology professionals earn more, grow faster, and adapt better. ORN-AI ensures you gain this advantage through curated, modern, employer-ready content.</p>
    `,      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/3.svg",//"https://fastly.picsum.photos/id/1015/800/500.jpg?hmac=pSNYsY7XYU05VD89MUu0QDrVHgAu2yZaGSC4wzh7ld8",//"/assets/blog3.jpg",
    },
    {
      id: 4,
      title: "From Classroom to Career: How ORN-AI Supports You Beyond Training",
      excerpt: `
      <p>Most institutions disappear once the course ends. But the truth is: <strong>your journey begins after you finish learning.</strong></p>
      <p>ORN-AI is built to guide you not only through training, but through every stage of your career.</p>

      <h2>What Happens After You Complete Your Course?</h2>
      <p>Here’s what makes ORN-AI different:</p>

      <h3>1. Personalized CV Writing</h3>
      <p>Your resume is rewritten to match global standards.</p>

      <h3>2. Interview Preparation</h3>
      <p>Mock interviews, Q&A guides, and expert coaching ensure you’re ready for employers.</p>

      <h3>3. Ethical Placement Support</h3>
      <p>We connect you only with safe, verified, merit-based opportunities.</p>

      <h3>4. Continuous Career Mentoring</h3>
      <p>We help you navigate challenges even after placement, including role transitions and skill upgrades.</p>

      <h2>Success Built on Support</h2>
      <p>This long-term support system helps learners build stable, high-growth careers—locally and internationally.</p>
      <p><strong>ORN-AI is not just a course provider. It’s a career partner.</strong></p>
    `,      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/4.svg",//"https://fastly.picsum.photos/id/1015/800/500.jpg?hmac=pSNYsY7XYU05VD89MUu0QDrVHgAu2yZaGSC4wzh7ld8",//"/assets/blog4.jpg",
    },
  ];

  useEffect(() => {
    // Convert id to number for comparison
    const foundBlog = blogsData.find((b) => b.id === Number(id));
    setBlog(foundBlog || null);
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0b0718]">
        <p className="text-lg mb-3">⚠️ Blog not found.</p>
        <Link
          to="/blogs"
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] hover:from-[#9063ff] hover:to-[#66b9ff] transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <>
    <Shell>
      <HeroBanner
          title={blog.title}
          subtitle="Your subtitle or description goes here"
          ctaText="Sign up"
          ctaHref="/signup"
          image="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
          height="h-96"
          />
      <div className="min-h-screen bg-[#fff] text-white py-20 px-5 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl mb-8 group shadow-lg shadow-[#fff]">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src={blog.thumbnail}
              alt={blog.title}
              className="rounded-2xl w-full object-cover max-h-[500px] transition-transform duration-700 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0718]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Title */}
        

          {/* Blog Content */}
          <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="prose prose-lg max-w-none text-black"
  dangerouslySetInnerHTML={{ __html: blog.excerpt }}
/>

          
          {/* Back Button */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/blogs"
              className="inline-block px-6 py-3 rounded-full bg-[linear-gradient(90deg,#170d3e_30%,#080e1f_100%)]  font-medium text-white"
            >
              ← Back to Blogs
            </Link>
          </motion.div>
        </motion.div>
      </div>
      </Shell>
    </>
  );
}
