import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function BlogSection() {
  const blogsData = [
    {
      id: 1,
      title: "The Future of Learning: How ORN-AI Is Empowering Global Talent",
      excerpt: `<p>The global job market is evolving faster than ever...</p>`,
      thumbnail:"../../public/assets/blogs/1.svg",
      published_at: "2025-12-01T10:00:00Z",
      blogId: 1,
    },
    {
      id: 2,
      title: "Why Ethical Placement Matters — And How ORN-AI Is Changing the Game",
      excerpt: `<p>Fraudulent job channels are rising...</p>`,
      thumbnail:"../../public/assets/blogs/2.svg",
      published_at: "2025-12-01T11:00:00Z",
      blogId: 2,
    },
    {
      id: 3,
      title: "The Power of Cross-Technology Training in 2025: Why You Need It",
      excerpt: `<p>Today’s job roles no longer exist in silos...</p>`,
      thumbnail:"../../public/assets/blogs/3.svg",
      published_at: "2025-12-01T12:00:00Z",
      blogId: 3,
    },
  ];

  const [blogs] = useState(blogsData);

  return (
    <div className="min-h-screen bg-[#0a0f19] text-gray-100 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* HEADER SECTION */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Blogs
            </span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Insights, updates, and expert guidance to help you grow in your career.
          </p>
        </div>

        {/* BLOG CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((b) => (
            <motion.div
              key={b.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-[#0d1220] rounded-[22px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)]
                         border border-[#1f2635] hover:shadow-[0_6px_25px_rgba(123,77,255,0.25)]
                         transition-all duration-300 min-h-[430px] flex flex-col justify-between"
            >

              {/* IMAGE BOX — SAME STYLE AS TESTIMONIAL CARD */}
              <div className="rounded-xl overflow-hidden h-40 mb-4 bg-[#111827] border border-[#1f2635] shadow-inner">
                <img
                  src={b.thumbnail}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-white leading-snug mb-2">
                {b.title}
              </h3>

              {/* EXCERPT */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {b.excerpt.replace(/<[^>]*>/g, "").slice(0, 130)}...
              </p>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-gray-400 text-sm">
                  {new Date(b.published_at).toLocaleDateString()}
                </span>

                <Link
                  to={`/blog-detail/${b.blogId}`}
                  className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-purple-400 to-blue-400
                             text-black font-medium shadow-md hover:scale-105 transition-transform"
                >
                  Read →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
