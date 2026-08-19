// components/layout/header/PublicHeader.tsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ShieldCheck,
  BrainCircuit,
  Laptop,
  BarChart3,
  MonitorSmartphone,
  Atom,
  ArrowUpRight,
} from "lucide-react";

import ornAiLogo from "@assets/logo_1777984164420.jpg";

interface PublicHeaderProps {
  user: any;
  UserMenu: React.ComponentType<{ compact?: boolean }>;
}

interface CourseItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
}

const COURSES: CourseItem[] = [
  {
    title: "Cyber Security",
    desc: "Learn to secure systems and networks.",
    icon: ShieldCheck,
    link: "/cyber-security",
  },
  {
    title: "Data Science & AI",
    desc: "Machine Learning, AI and Analytics.",
    icon: BrainCircuit,
    link: "/data-science-ai",
  },
  {
    title: "Advanced Programs",
    desc: "Cloud, DevOps and emerging tech.",
    icon: Laptop,
    link: "/advanced-programs",
  },
  {
    title: "Business Analytics",
    desc: "Data-driven decision making.",
    icon: BarChart3,
    link: "/business-analytics",
  },
  {
    title: "Technology Programs",
    desc: "Modern IT and software skills.",
    icon: MonitorSmartphone,
    link: "/technology-programs",
  },
  {
    title: "Science Programs",
    desc: "Research and scientific learning.",
    icon: Atom,
    link: "/science-programs",
  },
];

export default function PublicHeader({ user, UserMenu }: PublicHeaderProps) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCoursesOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setCoursesOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCoursesOpen(false);
    }, 180);
  };

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 selection:bg-[#17122A] selection:text-white ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-[#e2e8f0]"
          : "bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]/80"
      }`}
    >
      <div className="max-w-[1440px] mx-auto h-14 flex items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="ORN-AI home">
          <img
            src={ornAiLogo}
            alt="ORN-AI — Optimize, Revolutionize, Navigate"
            className="h-9 md:h-10 w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#43474e]">
          {!user && (
            <Link
              href="/"
              className={`transition-colors hover:text-[#17122A] ${
                location === "/" ? "text-[#17122A] font-semibold" : ""
              }`}
            >
              Platform
            </Link>
          )}

          {user?.role === "candidate" && (
            <>
              <Link href="#" className="hover:text-[#17122A] transition-colors">
                Feed
              </Link>
              <Link href="#" className="hover:text-[#17122A] transition-colors">
                Workshops
              </Link>
              <Link href="/courses" className="hover:text-[#17122A] transition-colors">
                Courses
              </Link>
              <Link href="#" className="hover:text-[#17122A] transition-colors">
                Messages
              </Link>
            </>
          )}

          {!user && (
            <>
              {/* Courses Mega Dropdown Trigger */}
              <div
                className="relative py-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 transition-colors hover:text-[#17122A] focus:outline-none ${
                    coursesOpen ? "text-[#17122A] font-semibold" : ""
                  }`}
                  aria-expanded={coursesOpen}
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      coursesOpen ? "rotate-180 text-[#17122A]" : "text-[#74777f]"
                    }`}
                  />
                </button>

                {/* Courses Mega Dropdown Menu */}
                <AnimatePresence>
                  {coursesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[760px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(23,18,42,0.12)] border border-[#e2e8f0] overflow-hidden z-50 p-6"
                    >
                      {/* 2 Rows x 3 Columns Course Grid */}
                      <div className="grid grid-cols-3 gap-4 pb-6">
                        {COURSES.map((course) => {
                          const Icon = course.icon;
                          return (
                            <Link
                              key={course.title}
                              href={course.link}
                              onClick={() => setCoursesOpen(false)}
                              className="group/item flex flex-col p-3.5 rounded-xl border border-transparent hover:border-[#17122A]/10 hover:bg-[#f7f9fb] transition-all duration-200"
                            >
                              <div className="w-10 h-10 rounded-lg bg-[#f0edf7] group-hover/item:bg-[#17122A] text-[#17122A] group-hover/item:text-white flex items-center justify-center mb-3 transition-colors duration-200">
                                <Icon className="w-5 h-5" />
                              </div>
                              <strong className="text-sm font-bold text-[#17122A] group-hover/item:text-[#6E56CF] tracking-tight mb-1 transition-colors">
                                {course.title}
                              </strong>
                              <p className="text-xs text-[#64748b] leading-relaxed">
                                {course.desc}
                              </p>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Bottom Footer: View all programs */}
                      <div className="pt-4 border-t border-[#e2e8f0] text-center">
                        <Link
                          href="/courses"
                          onClick={() => setCoursesOpen(false)}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#17122A] hover:text-[#6E56CF] tracking-wide transition-colors group/view"
                        >
                          <span>View all programs</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5 transition-transform duration-200" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/blogs"
                className={`transition-colors hover:text-[#17122A] ${
                  location === "/blogs" ? "text-[#17122A] font-semibold" : ""
                }`}
              >
                Blogs
              </Link>

              <Link
                href="/about-us"
                className={`transition-colors hover:text-[#17122A] ${
                  location === "/about-us" ? "text-[#17122A] font-semibold" : ""
                }`}
              >
                About
              </Link>

              <Link
                href="/contact-us"
                className={`transition-colors hover:text-[#17122A] ${
                  location === "/contact-us" ? "text-[#17122A] font-semibold" : ""
                }`}
              >
                Contact
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-5">
          {!user && (
            <>
              <Link
                href="/login"
                className="text-[15px] font-medium text-[#17122A] hover:text-[#6E56CF] transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#17122A] hover:bg-[#2B234B] active:scale-95 text-white text-[15px] font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Join Talent Pool</span>
              </Link>
            </>
          )}

          {user && <UserMenu compact />}
        </div>
      </div>
    </header>
  );
}
