// components/layout/header/PublicHeader.tsx

import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, UserPlus } from "lucide-react";

import ornAiLogo from "@assets/logo_1777984164420.jpg";

import { Button } from "@/components/ui/button";

interface PublicHeaderProps {
  user: any;
  UserMenu: React.ComponentType<{ compact?: boolean }>;
}

export default function PublicHeader({
  user,
  UserMenu,
}: PublicHeaderProps) {
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="ORN-AI home">
          <img
            src={ornAiLogo}
            alt="ORN-AI — Optimize, Revolutionize, Navigate"
            className="h-10 w-auto object-contain rounded-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {!user && (
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Platform
            </Link>
          )}

          {user?.role === "candidate" && (
            <>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Feed
              </Link>

              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Workshops
              </Link>

              <Link
                href="/courses"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Courses
              </Link>

              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Messages
              </Link>
            </>
          )}

          {!user && (
            <>
              {/* Courses Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCoursesOpen(true)}
              >
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  Courses
                  <ChevronDown className="h-4 w-4" />
                </button>

                {coursesOpen && (
                  <div
                    className="absolute left-1/2 top-full z-50 mt-3 w-[1100px] -translate-x-1/2 rounded-3xl border bg-white shadow-2xl"
                    onMouseLeave={() => setCoursesOpen(false)}
                  >
                    <div className="grid grid-cols-3 gap-4 p-6">

                      <Link href="/cyber-security">
                        <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                          <h4 className="font-semibold text-[#001858]">
                            Cyber Security
                          </h4>
                          <p className="text-sm text-[#595959]">
                            Learn to secure systems and networks.
                          </p>
                        </div>
                      </Link>

                      <Link href="/data-science-ai">
                        <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                          <h4 className="font-semibold text-[#001858]">
                            Data Science & AI
                          </h4>
                          <p className="text-sm text-[#595959]">
                            Machine Learning, AI and Analytics.
                          </p>
                        </div>
                      </Link>

                      <Link href="/advanced-programs">
                        <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                          <h4 className="font-semibold text-[#001858]">
                            Advanced Programs
                          </h4>
                          <p className="text-sm text-[#595959]">
                            Cloud, DevOps and emerging tech.
                          </p>
                        </div>
                      </Link>

                      <Link href="/business-analytics">
                        <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                          <h4 className="font-semibold text-[#001858]">
                            Business Analytics
                          </h4>
                          <p className="text-sm text-[#595959]">
                            Data-driven decision making.
                          </p>
                        </div>
                      </Link>

                      <Link href="/technology-programs">
                        <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                          <h4 className="font-semibold text-[#001858]">
                            Technology Programs
                          </h4>
                          <p className="text-sm text-[#595959]">
                            Modern IT and software skills.
                          </p>
                        </div>
                      </Link>

                      <Link href="/science-programs">
                        <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                          <h4 className="font-semibold text-[#001858]">
                            Science Programs
                          </h4>
                          <p className="text-sm text-[#595959]">
                            Research and scientific learning.
                          </p>
                        </div>
                      </Link>

                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/blogs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blogs
              </Link>

              <Link
                href="/about-us"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>

              <Link
                href="/contact-us"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user == null && (
            <Link href="/register">
              <Button className="gap-2">
                <UserPlus className="size-4" />
                Join Talent Pool
              </Button>
            </Link>
          )}

          <UserMenu compact />
        </div>
      </div>
    </header>
  );
}