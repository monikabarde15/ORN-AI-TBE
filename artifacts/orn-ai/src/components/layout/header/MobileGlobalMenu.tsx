// components/layout/header/MobileGlobalMenu.tsx

import React, { useState } from "react";
import { X, ChevronDown, ShieldCheck, BrainCircuit, Laptop, BarChart3, MonitorSmartphone, Atom, ArrowUpRight, LogIn, UserPlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

import ornAiLogo from "@assets/logo_1777984164420.jpg";

interface MobileGlobalMenuProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const COURSES = [
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

export default function MobileGlobalMenu({
  open,
  onClose,
  user,
}: MobileGlobalMenuProps) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [location] = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] lg:hidden"
            onClick={onClose}
          />

          {/* Drawer Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 h-[100dvh] w-[88vw] max-w-[340px] bg-white border-r border-[#e2e8f0] z-[80] shadow-2xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="h-20 border-b border-[#e2e8f0] flex items-center justify-between px-5">
              <Link href="/" onClick={onClose} className="flex items-center">
                <img
                  src={ornAiLogo}
                  alt="ORN-AI"
                  className="h-8 w-auto object-contain rounded-md"
                />
              </Link>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#17122A] hover:bg-slate-100 transition-colors"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Navigation Area */}
            <div className="overflow-y-auto flex-1 p-5 space-y-1 text-[#17122A]">
              {!user && (
                <>
                  <Link
                    href="/"
                    onClick={onClose}
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      location === "/" ? "bg-[#17122A]/5 text-[#17122A] font-semibold" : "hover:bg-slate-50"
                    }`}
                  >
                    Platform
                  </Link>

                  {/* Expandable Courses Accordion */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setCoursesOpen(!coursesOpen)}
                      className="w-full rounded-xl px-4 py-3 text-base font-medium hover:bg-slate-50 flex items-center justify-between transition-colors"
                    >
                      <span className={coursesOpen ? "text-[#17122A] font-semibold" : ""}>Courses</span>
                      <ChevronDown
                        className={`h-4 w-4 text-[#74777f] transition-transform duration-200 ${
                          coursesOpen ? "rotate-180 text-[#17122A]" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {coursesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-3 pr-1 pt-1 pb-2 space-y-1"
                        >
                          {COURSES.map((course) => {
                            const Icon = course.icon;
                            return (
                              <Link
                                key={course.title}
                                href={course.link}
                                onClick={onClose}
                                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-md bg-[#f0edf7] text-[#17122A] flex items-center justify-center shrink-0 mt-0.5">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <strong className="block text-sm font-semibold text-[#17122A]">
                                    {course.title}
                                  </strong>
                                  <span className="text-xs text-[#64748b] leading-tight line-clamp-1">
                                    {course.desc}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}

                          <Link
                            href="/courses"
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#17122A] px-3 py-2 hover:underline"
                          >
                            <span>View all programs</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/blogs"
                    onClick={onClose}
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      location === "/blogs" ? "bg-[#17122A]/5 text-[#17122A] font-semibold" : "hover:bg-slate-50"
                    }`}
                  >
                    Blogs
                  </Link>

                  <Link
                    href="/about-us"
                    onClick={onClose}
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      location === "/about-us" ? "bg-[#17122A]/5 text-[#17122A] font-semibold" : "hover:bg-slate-50"
                    }`}
                  >
                    About
                  </Link>

                  <Link
                    href="/contact-us"
                    onClick={onClose}
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      location === "/contact-us" ? "bg-[#17122A]/5 text-[#17122A] font-semibold" : "hover:bg-slate-50"
                    }`}
                  >
                    Contact
                  </Link>
                </>
              )}

              {/* Candidate Global Nav */}
              {user?.role === "candidate" && (
                <>
                  <Link href="#" onClick={onClose} className="block rounded-xl px-4 py-3 hover:bg-slate-50">
                    Feed
                  </Link>
                  <Link href="#" onClick={onClose} className="block rounded-xl px-4 py-3 hover:bg-slate-50">
                    Workshops
                  </Link>
                  <Link href="/courses" onClick={onClose} className="block rounded-xl px-4 py-3 hover:bg-slate-50">
                    Courses
                  </Link>
                  <Link href="#" onClick={onClose} className="block rounded-xl px-4 py-3 hover:bg-slate-50">
                    Messages
                  </Link>
                </>
              )}
            </div>

            {/* Bottom Actions for Guest */}
            {!user && (
              <div className="p-5 border-t border-[#e2e8f0] bg-[#f8fafc] space-y-3">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#e2e8f0] bg-white text-[#17122A] text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#17122A] text-white text-sm font-semibold hover:bg-[#2B234B] transition-colors shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join Talent Pool</span>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
