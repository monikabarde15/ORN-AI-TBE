import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import axios from "axios";
import debounce from "lodash/debounce";
import { motion } from "framer-motion"; // 🪄 for smooth hover animations
import HeroBanner from "./components/Banner";
import { Shell } from "@/components/layout/Shell";

export default function BlogList() {
 const [location, navigate] = useLocation();
  const API_BASE = "#";
  const getToken = () => localStorage.getItem("token") || "";

  const api = axios.create({
    baseURL: API_BASE,
    headers: { Accept: "application/json" },
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ✅ Helper: Full image URL fix
  const getFullImageUrl = (path) => {
    if (!path) return "/assets/default-blog.jpg";
    if (path.startsWith("http")) return path;
    return `${path}`;
  };

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialPage = parseInt(params.get("page") || "1", 10);
  const initialQuery = params.get("q") || "";
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
    `,
      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/1.svg",//"/assets/blog1.jpg",
      published_at: "2025-12-01T10:00:00Z",
      blogId: 1,
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
    `,
      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/2.svg",//"/assets/blog2.jpg",
      published_at: "2025-12-01T11:00:00Z",
      blogId: 2,
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
    `,
      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/3.svg",//"/assets/blog3.jpg",
      published_at: "2025-12-01T12:00:00Z",
      blogId: 3,
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
    `,
      thumbnail: "https://vidya-merege.vercel.app/assets/blogs/4.svg",//"/assets/blog4.jpg",
      published_at: "2025-12-01T13:00:00Z",
      blogId: 4,
    },
    // {
    //   id: 5,
    //   title: "Success Built on Support",
    //   excerpt: "This long-term support system helps learners build stable, high-growth careers—locally and internationally. ORN-AI is not just a course provider. It’s a career partner.",
    //   thumbnail: "/assets/blog5.jpg",
    //   published_at: "2025-12-01T14:00:00Z",
    //   blogId: 5,
    // },
  ];
  const [blogs] = useState(blogsData); // Using static array
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(6);
  const [q, setQ] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateURL = (newPage, newQuery) => {
  const s = new URLSearchParams();

  if (newQuery) s.set("q", newQuery);
  if (newPage && newPage !== 1) s.set("page", String(newPage));

  const url = `/blogs${s.toString() ? `?${s.toString()}` : ""}`;

  navigate(url);
};

  const debouncedFetch = useMemo(
    () =>
      debounce((nextQ, nextPage) => {
        fetchData(nextPage, nextQ);
      }, 500),
    []
  );

  useEffect(() => {
    fetchData(page, q);
    return () => debouncedFetch.cancel();
  }, []); // eslint-disable-line

  useEffect(() => {
    updateURL(page, q);
    setError("");
    setLoading(true);
    debouncedFetch(q, page);
  }, [q, page]); // eslint-disable-line

  async function fetchData(pageToFetch = 1, query = "") {
    try {
      setLoading(true);
      setError("");

      const countResp = await api.get("/blog/count/");
      const totalCount = countResp?.data?.count ?? countResp?.data ?? 0;
      setCount(Number(totalCount));

      const resp = await api.get("/blog/", {
        params: {
          page: pageToFetch,
          page_size: pageSize,
          search: query,
          q: query,
        },
      });

      const data = resp?.data?.results ?? resp?.data ?? [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch blogs error:", err);
//setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setPage(1);
    setQ(e.target.value);
  };

  return (
    <>
    <Shell>
 <HeroBanner
    title="Our Blogs"
    subtitle="Your subtitle or description goes here"
    ctaText="Sign up"
    ctaHref="/signup"
    image="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
    height="h-96"
    />      <div className="min-h-screen bg-[#fff] text-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
            <div>
              
              <p className="text-gray-400 mt-2">
                Insights, updates, and expert guidance to help you grow in your career.
              </p>
            </div>

            <div className="w-full md:w-1/3">
              <input
                value={q}
                onChange={handleSearchChange}
                placeholder="Search blogs..."
                className="w-full rounded-xl px-4 py-2 bg-[#fff] border border-[#fff] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b4dff] transition-all duration-200"
              />
            </div>
          </div>

          {/* Loading / Error */}
          {loading && <div className="py-8 text-center text-gray-300">Loading...</div>}
          {error && <div className="py-4 text-center text-red-400">{error}</div>}

          {/* Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <motion.article
                key={b.id}
                whileHover={{ scale: 1.04, y: -5 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="bg-[#110717] rounded-2xl p-5 shadow-lg border border-[#2b2136] hover:shadow-[0_0_20px_#7b4dff30] transition-all duration-300"
              >
                <div className="h-44 rounded-lg overflow-hidden mb-4 relative group">
                  <img
                    src={getFullImageUrl(
                      b.thumbnail || b.image || b.imageUrl || b.image_path
                    )}
                    alt={b.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b16]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-xl font-semibold mb-1 group-hover:text-[#8f5bff] transition-colors">
                  {b.title}
                </h3>

                {/* <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {b.excerpt ??
                    b.short_description ??
                    (b.content
                      ? b.content.replace(/(<([^>]+)>)/gi, "").slice(0, 120) + "..."
                      : "")}
                </p> */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {(() => {
                    const raw =
                      b.excerpt ||
                      b.short_description ||
                      b.content ||
                      "";

                    // remove all HTML tags
                    const cleaned = raw.replace(/<[^>]*>/g, "");

                    // limit to 120 characters
                    return cleaned.slice(0, 120) + (cleaned.length > 120 ? "..." : "");
                  })()}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {new Date(
                      b.published_at ?? b.created_at ?? Date.now()
                    ).toLocaleDateString()}
                  </div>

                  <Link
                    to={`/blogs/${b.blogId}`}
                    className="inline-block bg-gradient-to-r from-[#8f5bff] to-[#5ec2ff] text-black px-4 py-2 rounded-full text-sm font-medium hover:from-[#a070ff] hover:to-[#74d1ff] transition-all duration-300 shadow-md"
                  >
                    Read →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center space-x-3">
            <button
              onClick={() => gotoPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg bg-[#1b1522] disabled:opacity-40 border border-[#2b2136] hover:bg-[#2b2136] transition-all duration-200"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pNum = i + 1;
                if (
                  pNum === 1 ||
                  pNum === totalPages ||
                  (pNum >= page - 1 && pNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pNum}
                      onClick={() => gotoPage(pNum)}
                      className={`px-3 py-1 rounded-md transition-all duration-200 ${
                        pNum === page
                          ? "bg-gradient-to-r from-[#7b4dff] to-[#3cb3ff] text-black shadow-md"
                          : "bg-[#160d18] text-gray-300 border border-[#2b2136] hover:bg-[#231829]"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                }
                if (pNum === 2 && page > 4) return <span key={pNum}>…</span>;
                if (pNum === totalPages - 1 && page < totalPages - 3)
                  return <span key={pNum}>…</span>;
                return null;
              })}
            </div>

            <button
              onClick={() => gotoPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg bg-[#1b1522] disabled:opacity-40 border border-[#2b2136] hover:bg-[#2b2136] transition-all duration-200"
            >
              Next
            </button>
          </div>

          <div className="mt-6 text-center text-gray-500">
            Showing page {page} of {totalPages} — {count} posts
          </div>
        </div>
      </div>
      </Shell>
    </>
  );
}
