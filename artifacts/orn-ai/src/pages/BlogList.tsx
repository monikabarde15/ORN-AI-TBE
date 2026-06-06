import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import axios from "axios";
import debounce from "lodash/debounce";
import { motion } from "framer-motion"; // 🪄 for smooth hover animations
import HeroBanner from "./components/Banner";
import { Shell } from "@/components/layout/Shell";
import api from "../../services/api";

export default function BlogList() {
 const [location, navigate] = useLocation();
  
  // ✅ Helper: Full image URL fix
  const getFullImageUrl = (path) => {
    if (!path) return "/assets/default-blog.jpg";
    if (path.startsWith("http")) return path;
    return `${path}`;
  };

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialPage = parseInt(params.get("page") || "1", 10);
  const initialQuery = params.get("q") || "";

  const [blogs, setBlogs] = useState([]);
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

    const resp = await api.get("/api/blogs");

    let data = resp?.data?.data || [];

    if (query) {
      data = data.filter((item) =>
        item.title?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setCount(data.length);

    const start = (pageToFetch - 1) * pageSize;
    const end = start + pageSize;

    setBlogs(data.slice(start, end));
  } catch (err) {
    console.error("fetch blogs error:", err);
    setError("Failed to load blogs");
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
                    src={b.thumbnail}
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
                  const raw = b.description || "";
                  const cleaned = raw.replace(/<[^>]*>/g, "");

                    // limit to 120 characters
                    return cleaned.slice(0, 120) + (cleaned.length > 120 ? "..." : "");
                  })()}
                </p>

                <div className="flex items-center justify-between">
                 <div className="text-sm text-gray-400">
  {new Date(b.createdAt).toLocaleDateString()}
</div>

<Link
  to={`/blogs/${b.id}`}
  className="inline-block bg-gradient-to-r from-[#8f5bff] to-[#5ec2ff] text-black px-4 py-2 rounded-full text-sm font-medium"
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
