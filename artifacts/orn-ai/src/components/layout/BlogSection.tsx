import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPost {
  id: string | number;
  blogId?: string;
  title: string;
  excerpt?: string;
  description?: string;
  category?: string;
  thumbnail: string;
  published_at?: string;
  createdAt?: string;
}

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: "Navigating the Future of Tech Careers in 2025",
    description:
      "Explore how emerging technologies like generative AI and cloud-native architecture are reshaping what European enterprises look for in top talent.",
    category: "Career Insights",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    published_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Cyber Security Fundamentals for Modern Infrastructure",
    description:
      "Why zero-trust architectures and hands-on simulation labs are mandatory benchmarks for engineering candidates entering Tier-1 environments.",
    category: "Security",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    published_at: "2025-01-10T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Mastering Full-Stack Scalability and DevOps Pipelines",
    description:
      "A deep dive into continuous deployment, container orchestration, and high-availability database strategies for global-scale products.",
    category: "Engineering",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    published_at: "2025-01-05T00:00:00.000Z",
  },
  {
    id: 4,
    title: "Data Science & AI: Moving from Models to Production",
    description:
      "Bridging the critical gap between statistical experimentation and robust, productionized machine learning microservices.",
    category: "Data & AI",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    published_at: "2024-12-28T00:00:00.000Z",
  },
];

export function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOGS);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.blogId || item.id,
            blogId: item.blogId,
            title: item.title,
            description: item.description,
            excerpt: item.description,
            category: item.category || "Technology",
            thumbnail:
              item.thumbnail ||
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            published_at: item.createdAt || new Date().toISOString(),
          }));
          setBlogs(formatted);
        }
      })
      .catch((err) => {
        console.warn("Using default blog entries due to API fetch error:", err);
      });
  }, []);

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 380;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setActiveSlide(index);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) scrollToSlide(activeSlide - 1);
  };

  const handleNext = () => {
    if (activeSlide < blogs.length - 1) scrollToSlide(activeSlide + 1);
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const onScroll = () => {
      const cardWidth = 380;
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveSlide(Math.min(Math.max(index, 0), blogs.length - 1));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [blogs.length]);

  return (
    <section className="relative w-full overflow-hidden bg-white selection:bg-[#17122A] selection:text-white">
      {/* Top Solid Header Area (#17122A with Geometric Grid Overlay) */}
      <div className="bg-[#17122A] text-white w-full pt-20 md:pt-28 pb-28 md:pb-36 px-6 md:px-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Geometric blueprint grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Our Blogs
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Insights, updates, and expert guidance to help you grow in your career.
          </p>
        </motion.div>
      </div>

      {/* Bottom Carousel / Cards Area (Overlaps the header by -mt-20) */}
      <div className="w-full pb-16 md:pb-24 relative -mt-20 md:-mt-24 z-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          
          {/* Scrollable Container */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {blogs.map((b, idx) => {
              const formattedDate = new Date(b.published_at || b.createdAt || "").toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );

              return (
                <motion.article
                  key={b.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.15 }}
                  className="blog-card flex-none w-[310px] sm:w-[360px] md:w-[390px] bg-white border border-[#e0e3e5] hover:border-[#6E56CF]/40 rounded-2xl overflow-hidden snap-start flex flex-col justify-between shadow-[0_4px_24px_rgba(23,18,42,0.06)] hover:shadow-[0_16px_40px_rgba(23,18,42,0.12)] transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Top Image Container */}
                  <div className="h-52 sm:h-56 w-full relative overflow-hidden bg-[#f2f4f6]">
                    <img
                      src={b.thumbnail}
                      alt={b.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Date */}
                      <div className="font-mono text-xs font-semibold text-[#43474e] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]" />
                        {formattedDate !== "Invalid Date" ? formattedDate : "Jan 12, 2025"}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-[#191c1e] mb-3 leading-snug group-hover:text-[#6E56CF] transition-colors line-clamp-2">
                        {b.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-[#43474e] mb-6 line-clamp-3 leading-relaxed font-normal">
                        {b.excerpt || b.description || "The global job market is evolving faster than ever..."}
                      </p>
                    </div>

                    {/* Read More Footer Link */}
                    <div className="pt-4 border-t border-[#17122A]/5 flex items-center justify-between mt-auto">
                      <Link
                        href={`/blogs/${b.blogId || b.id}`}
                        className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#17122A] group-hover:text-[#6E56CF] group-hover:underline transition-all uppercase tracking-widest"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </Link>

                      <span className="font-mono text-[11px] text-[#43474e]/70">
                        {formattedDate !== "Invalid Date" ? formattedDate : ""}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Carousel Controls: Arrows & Active Indicator Dots */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={activeSlide === 0}
              aria-label="Previous Blog"
              className="w-10 h-10 rounded-full border border-[#17122A]/20 flex items-center justify-center text-[#17122A] hover:bg-[#17122A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {blogs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === i
                      ? "bg-[#17122A] w-7"
                      : "bg-[#17122A]/25 hover:bg-[#17122A]/50 w-2.5"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={activeSlide === blogs.length - 1}
              aria-label="Next Blog"
              className="w-10 h-10 rounded-full border border-[#17122A]/20 flex items-center justify-center text-[#17122A] hover:bg-[#17122A] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default BlogSection;
