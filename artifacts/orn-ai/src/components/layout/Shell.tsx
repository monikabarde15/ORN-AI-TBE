// artifacts\orn-ai\src\components\layout\Shell.tsx
import { ChevronDown } from "lucide-react";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ornAiLogo from "@assets/logo_1777984164420.jpg";
import logoimg from "../../../public/logo.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Search, UserPlus, Settings2, BarChart3, Database, GraduationCap, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useEffect } from "react";
function UserMenu({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth();
  // if (!user) {

  if (!user || !user.fullName) {
    return (
      <Link href="/login">
        <Button variant={compact ? "ghost" : "outline"} size={compact ? "sm" : "default"} className="gap-2" data-testid="button-header-login">
          <LogIn className="size-4" />
          Sign in
        </Button>
      </Link>
    );
  }
  const initials = user.fullName
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2" data-testid="button-user-menu">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials || "U"}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">{user.fullName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm">{user.fullName}</span>
            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
          {user?.role === "admin" && (
  <Link href="/admin">
    <DropdownMenuItem className="cursor-pointer gap-2">
      <UserIcon className="size-4" />
      Dashboard
    </DropdownMenuItem>
  </Link>
)}
        {user.candidateId && (
          <Link href={`/candidate/${user.candidateId}/evaluation`}>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <UserIcon className="size-4" />
              My evaluation
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={async () => {
  await logout();
  window.location.href = "/login";
}}
          data-testid="button-logout"
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (location === "/" && user?.role === "admin") {
      setLocation("/admin");
    }
    if (location === "/" && user?.role === "candidate") {
      setLocation(`/candidate/${user.candidateId}/evaluation`);
    }
  }, [location, user, setLocation]);

  const [coursesOpen, setCoursesOpen] = useState(false);

  const candidateRoutes = [
  "/courses",
  "/feed",
  "/workshops",
  "/messages",
];

const isDashboard =
  location.startsWith("/recruiter") ||
  location.startsWith("/admin") ||
  location.startsWith("/candidate") ||
  candidateRoutes.some(route => location.startsWith(route)) ||
  /^\/candidate\/[^/]+\/training$/.test(location);

  if (isDashboard) {
    return (
      <div className="min-h-[100dvh] flex w-full bg-muted/30">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-background flex flex-col fixed inset-y-0 z-10">
          <div className="h-16 flex items-center px-6 border-b">
            <Link href="/" className="flex items-center" aria-label="ORN-AI home">
              <img
                src={ornAiLogo}
                alt="ORN-AI — Optimize, Revolutionize, Navigate"
                className="h-9 w-auto object-contain rounded-lg"
              />
            </Link>
          </div>

          <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
            {user?.role === "candidate" ? (
              <>
                <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Learning Hub
                </div>

                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <BarChart3 className="size-4" />
                  Feed
                </Link>

                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <GraduationCap className="size-4" />
                  Workshops
                </Link>

                <Link href="/courses" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <GraduationCap className="size-4" />
                  Courses
                </Link>

                

                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                  <UserIcon className="size-4" />
                  Messages
                </Link>
                {user?.candidateId && (
                  <Link
                    href={`/candidate/${user.candidateId}/evaluation`}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
                  >
                    <BarChart3 className="size-4" />
                    My Evaluation
                  </Link>
                )}
              </>
            ) : (
              <>
                <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Recruitment
                      </div>
                      <Link href="/recruiter" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        <Search className="size-4" />
                        Talent Search
                      </Link>
                      <Link href="/admin/blog/add" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/blog/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-blogs">
                        <GraduationCap className="size-4" />
                        Blogs
                      </Link>
                      <Link href="/recruiter/add" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                        Add Candidate
                      </Link>
                       <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        LMS & Learning Ecosystem
                      </div>
                      <Link href="/recruiter/courses" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/courses" || location === "/recruiter/course/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                       Course Management
                      </Link>

                      <Link href="/recruiter/learning-path" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/learning-path" || location === "/recruiter/learning-path" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                        Learning Paths
                      </Link>

                      <Link href="#" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/courses" || location === "/recruiter/course/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                        Course Categories
                      </Link>
                      <Link href="#" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter/courses" || location === "/recruiter/course/add" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} data-testid="link-nav-add-candidate">
                        <UserPlus className="size-4" />
                       Live Training Sessions
                      </Link>

                      <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Career Transformation
                      </div>
                      <Link
                        href="/training"
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location.startsWith("/training") || /^\/candidate\/[^/]+\/training$/.test(location) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                        data-testid="link-nav-training"
                      >
                        <GraduationCap className="size-4" />
                        Training Pipeline
                      </Link>

                      <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Platform 
                      </div>

                      <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/admin" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        <BarChart3 className="size-4" />
                        Overview
                      </Link>
                      <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground/50 cursor-not-allowed">
                        <Database className="size-4" />
                        Data Sources
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground/50 cursor-not-allowed">
                        <Settings2 className="size-4" />
                        Settings
                      </div>
              </>
            )}
           
          </div>
          <div className="border-t p-3">
            <UserMenu />
          </div>
        </aside>
<div className="flex-1 pl-64 flex flex-col">

  <header className="h-16 border-b bg-background sticky top-0 z-40">
    <div className="h-full px-6 flex items-center justify-between">

      <div className="flex items-center gap-6">
       
        {user?.role === "candidate" && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#">Feed</Link>
            <Link href="#">Workshops</Link>
            <Link href="/courses">Courses</Link>
            <Link href="#">Messages</Link>
          </nav>
        )}
      </div>

      <UserMenu />
    </div>
  </header>

  <main className="flex-1">
    {children}
  </main>

</div>

      </div>
      // </div >
    );
  }

  // Public pages (landing, demo, candidate flows)
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="ORN-AI home">
            <img
              src={ornAiLogo}
              alt="ORN-AI — Optimize, Revolutionize, Navigate"
              className="h-10 w-auto object-contain rounded-lg"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
           {!user && (
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Platform
                </Link>
              )}

             
            {user?.role === "candidate" && (
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                 Feed
              </Link>
            )}
            {user?.role === "candidate" && (
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Workshops
              </Link>
            )}
            {user?.role === "candidate" && (
              <Link
                href="/courses"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                 Courses
              </Link>
            )}
            {user?.role === "candidate" && (
              <Link
                href="/#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Messages
              </Link>
            )}
           {!user && (
              <>
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
                            <h4 className="font-semibold text-[#001858]">Cyber Security</h4>
                            <p className="text-sm text-[#595959]">
                              Learn to secure systems and networks.
                            </p>
                          </div>
                        </Link>

                        <Link href="/data-science-ai">
                          <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                            <h4 className="font-semibold text-[#001858]">Data Science & AI</h4>
                            <p className="text-sm text-[#595959]">
                              Machine Learning, AI and Analytics.
                            </p>
                          </div>
                        </Link>

                        <Link href="/advanced-programs">
                          <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                            <h4 className="font-semibold text-[#001858]">Advanced Programs</h4>
                            <p className="text-sm text-[#595959]">
                              Cloud, DevOps and emerging tech.
                            </p>
                          </div>
                        </Link>

                        <Link href="/business-analytics">
                          <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                            <h4 className="font-semibold text-[#001858]">Business Analytics</h4>
                            <p className="text-sm text-[#595959]">
                              Data-driven decision making.
                            </p>
                          </div>
                        </Link>

                        <Link href="/technology-programs">
                          <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                            <h4 className="font-semibold text-[#001858]">Technology Programs</h4>
                            <p className="text-sm text-[#595959]">
                              Modern IT and software skills.
                            </p>
                          </div>
                        </Link>

                        <Link href="/science-programs">
                          <div className="rounded-xl border p-4 bg-[#f7f9ff] hover:bg-[#e2e9ff] cursor-pointer">
                            <h4 className="font-semibold text-[#001858]">Science Programs</h4>
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
                  Contacts
                </Link>
              </>
            )}
           
          </nav>
         
            <div className="flex items-center gap-3">
              {user == null && user?.role !== "candidate" && (
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

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="bg-[#17122A] text-white py-12 px-6 md:px-16 lg:px-24">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-700 pb-10 text-center md:text-left">
          {/* Logo + Description */}
          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <div className="bg-white p-2 rounded-xl inline-flex items-center justify-center shadow-md">
                <img
                  src={logoimg}
                  alt="ORN-AI"
                  width={180}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>


            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto md:mx-0">
              An ISO-certified training partner committed to your skills, growth, and career success.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-3">
              {[
                // {
                //   Icon: Facebook,
                //   link: "#",
                // },

                {
                  Icon: FaInstagram,
                  link: "https://www.instagram.com/ornai_official/",
                },
                {
                  Icon: FaLinkedin,
                  link: "https://www.linkedin.com/company/orn-ai/",
                },
                {
                  Icon: FaYoutube,
                  link: "https://www.youtube.com/@ORN-AILearning",
                },
              ].map(({ Icon, link }, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a132b] p-2.5 rounded-lg hover:bg-[#7c4dff] transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/" className="hover:text-white">
                  Platform
                </a>
              </li>

              <li>
                <a href="/about-us" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact-us" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/blogs" className="hover:text-white">
                  Blogs
                </a>
              </li>
              
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">

              <li>
                <a href="/cyber-security" className="hover:text-white">
                  Cyber Security
                </a>
              </li>
              <li>
                <a href="/data-science-ai" className="hover:text-white">
                  Data Science & AI
                </a>
              </li>
              <li>
                <a href="/advanced-programs" className="hover:text-white">
                  Advanced Programs
                </a>
              </li>
              <li>
                <a href="/business-analytics" className="hover:text-white">
                  Business Analytics
                </a>
              </li>
              <li>
                <a href="/technology-programs" className="hover:text-white">
                  Technology Programs
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-white">
                  Telecommunication
                </a>
              </li> */}
              <li>
                <a href="/science-programs" className="hover:text-white">
                  Science Programs
                </a>
              </li>

            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Help</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" className="hover:text-white">
                  Terms and Condition
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="contact-us" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-white">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-6 text-center">
          <p>© 2025 ORN-AI. All rights reserved.</p>
          <p className="mt-3 md:mt-0">
            Design By{" "}
            <span className="text-[#A7004C]"><a href="https://cybite.in/" target="_blank">Cybite</a></span> team
          </p>
        </div>
      </footer>
    </div>
  );
}